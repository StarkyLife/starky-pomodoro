import * as O from 'fp-ts/Option';
import { constant, identity, pipe } from 'fp-ts/function';
import { combine, createEffect, createEvent, createStore, sample, split } from 'effector';

import { PomodoroConfiguration, PomodoroPhase } from '../core/types/pomodoro';
import { phasesStorage } from '../devices/phases-storage';
import { showStatistics } from '../use-cases/show-statistics';
import { initializePomodoroUseCase } from '../use-cases/initialize-pomodoro';
import { finishPomodoroUseCase } from '../use-cases/finish-pomodoro';
import { stopPomodoroUseCase } from '../use-cases/stop-pomodoro';
import { getSecondsForMinutes } from '../utils/time';
import { notificationService } from '../devices/notification-service';
import { timerWorkerGatewayFactory } from '../devices/timer';

const timerGateway = timerWorkerGatewayFactory();

export const $pomodoroPhase = createStore<O.Option<PomodoroPhase>>(O.none);
export const $phaseStartTime = createStore<O.Option<Date>>(O.none);
export const $remainingTime = createStore(0);
export const $statistics = combine([$pomodoroPhase, $phaseStartTime]).map(
  ([currentPhase, startTime]) =>
    showStatistics(phasesStorage.get, constant(currentPhase), constant(startTime))(),
);
export const $workTimeConfig = createStore(getSecondsForMinutes(25));
export const $restTimeConfig = createStore(getSecondsForMinutes(5));
export const $config = combine<PomodoroConfiguration>({
  workTime: $workTimeConfig,
  restTime: $restTimeConfig,
});

export const timerClicked = createEvent();
export const timerTicked = createEvent<number>();

export const pomodoroInitialized = createEvent();
export const pomodoroPhaseStarted = createEvent();
export const pomodoroPhaseStopped = createEvent();
export const pomodoroPhaseFinished = createEvent();

export const workTimeChanged = createEvent<number>();
export const restTimeChanged = createEvent<number>();

export const nextPhaseInitiated = createEvent<PomodoroPhase>();

const initializePomodoroFx = createEffect((config: PomodoroConfiguration) =>
  initializePomodoroUseCase(config),
);
const startPomodoroFx = createEffect((countDown: number) => timerGateway.start(countDown)());
const finishPomodoroFx = createEffect(
  ([phase, startTime, config]: [O.Option<PomodoroPhase>, O.Option<Date>, PomodoroConfiguration]) =>
    finishPomodoroUseCase(
      { saveFn: phasesStorage.save, notifyFn: notificationService.notify },
      phase,
      startTime,
      config,
    )(),
);
const stopPomodoroPhaseFx = createEffect(
  ([currentPhase, config]: [O.Option<PomodoroPhase>, PomodoroConfiguration]) =>
    stopPomodoroUseCase({ stopTimer: timerGateway.stop }, currentPhase, config)(),
);

/* ------------------------------------------------------------------------- */

timerGateway.subscribeToFinish(pomodoroPhaseFinished)();
timerGateway.subscribeToTicks(timerTicked)();

$pomodoroPhase.on(nextPhaseInitiated, (_, nextPhase) => O.some(nextPhase));
$pomodoroPhase.on(initializePomodoroFx.doneData, (_, phase) => O.some(phase));

$phaseStartTime.on(pomodoroPhaseStarted, () => O.some(new Date()));
$phaseStartTime.reset(nextPhaseInitiated);

$remainingTime.on($pomodoroPhase, (_, phase) =>
  pipe(
    phase,
    O.fold(constant(0), ({ countDown }) => countDown),
  ),
);
$remainingTime.on(timerTicked, (_, remainingTime) => remainingTime);

$workTimeConfig.on(workTimeChanged, (_, newTime) => newTime);
$restTimeConfig.on(restTimeChanged, (_, newTime) => newTime);

sample({
  clock: $config,
  source: $phaseStartTime,
  filter: O.isNone,
  target: pomodoroInitialized,
});
sample({
  clock: pomodoroInitialized,
  source: $config,
  target: initializePomodoroFx,
});

split({
  clock: timerClicked,
  source: combine([$pomodoroPhase, $remainingTime]),
  match: ([phase, remainingTime]) =>
    pipe(
      phase,
      O.map(({ countDown }) => (countDown > remainingTime ? 'stop' : 'start')),
      O.fold(constant('skip'), identity),
    ),
  cases: {
    start: pomodoroPhaseStarted,
    stop: pomodoroPhaseStopped,
  },
});

sample({
  clock: pomodoroPhaseStarted,
  source: $pomodoroPhase,
  filter: O.isSome,
  fn: (phase) =>
    pipe(
      phase,
      O.fold(constant(0), ({ countDown }) => countDown),
    ),
  target: startPomodoroFx,
});

sample({
  clock: pomodoroPhaseStopped,
  source: combine([$pomodoroPhase, $config]),
  target: stopPomodoroPhaseFx,
});
sample({
  source: stopPomodoroPhaseFx.doneData,
  filter: Boolean,
  target: nextPhaseInitiated,
});

sample({
  clock: pomodoroPhaseFinished,
  source: combine([$pomodoroPhase, $phaseStartTime, $config]),
  target: finishPomodoroFx,
});
sample({
  source: finishPomodoroFx.doneData,
  filter: Boolean,
  target: nextPhaseInitiated,
});
