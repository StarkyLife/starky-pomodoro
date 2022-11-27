import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';

import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { PomodoroConfiguration, PomodoroPhase } from '../core/types/pomodoro';
import { phasesStorage } from '../devices/phases-storage';
import { showStatistics } from '../use-cases/show-statistics';
import { initializePomodoroUseCase } from '../use-cases/initialize-pomodoro';
import { finishPomodoroUseCase } from '../use-cases/finish-pomodoro';
import { stopPomodoroUseCase } from '../use-cases/stop-pomodoro';
import { getSecondsForMinutes } from '../utils/time';
import { notificationService } from '../devices/notification-service';

export const $pomodoroPhase = createStore<O.Option<PomodoroPhase>>(O.none);
export const $phaseStartTime = createStore<O.Option<Date>>(O.none);
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

export const pomodoroInitialized = createEvent();
export const pomodoroPhaseStarted = createEvent();
export const pomodoroPhaseFinished = createEvent();
export const pomodoroPhaseStopped = createEvent();
export const workTimeChanged = createEvent<number>();
export const restTimeChanged = createEvent<number>();

const nextPhaseInitiated = createEvent<PomodoroPhase>();

const initializePomodoroFx = createEffect((config: PomodoroConfiguration) =>
  initializePomodoroUseCase(config),
);
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
    stopPomodoroUseCase(currentPhase, config),
);

$pomodoroPhase.on(nextPhaseInitiated, (_, nextPhase) => O.some(nextPhase));
$pomodoroPhase.on(initializePomodoroFx.doneData, (_, phase) => O.some(phase));

$phaseStartTime.on(pomodoroPhaseStarted, () => O.some(new Date()));
$phaseStartTime.reset(nextPhaseInitiated);

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
