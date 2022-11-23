import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';

import { attach, combine, createEffect, createEvent, createStore, sample } from 'effector';
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

export const initializePomodoroFx = attach({
  source: $config,
  effect: createEffect((config: PomodoroConfiguration) => initializePomodoroUseCase(config)),
});
export const finishPomodoroFx = attach({
  source: combine([$pomodoroPhase, $phaseStartTime, $config]),
  effect: createEffect(
    ([phase, startTime, config]: [
      O.Option<PomodoroPhase>,
      O.Option<Date>,
      PomodoroConfiguration,
    ]) =>
      finishPomodoroUseCase(
        { saveFn: phasesStorage.save, notifyFn: notificationService.notify },
        phase,
        startTime,
        config,
      )(),
  ),
});
export const stopPomodoroPhaseFx = attach({
  source: combine([$pomodoroPhase, $config]),
  effect: createEffect(([currentPhase, config]: [O.Option<PomodoroPhase>, PomodoroConfiguration]) =>
    stopPomodoroUseCase(currentPhase, config),
  ),
});

export const pomodoroPhaseFinished = createEvent();
export const pomodoroPhaseStopped = createEvent();
export const pomodoroPhaseStarted = createEvent();
export const nextPhaseInitiated = createEvent<PomodoroPhase>();
export const workTimeChanged = createEvent<number>();
export const restTimeChanged = createEvent<number>();

$pomodoroPhase.on(nextPhaseInitiated, (_, nextPhase) => O.some(nextPhase));
$pomodoroPhase.on(initializePomodoroFx.doneData, (_, phase) => O.some(phase));

$phaseStartTime.on(pomodoroPhaseStarted, () => O.some(new Date()));
$phaseStartTime.reset(nextPhaseInitiated);

$workTimeConfig.on(workTimeChanged, (_, newTime) => newTime);
$restTimeConfig.on(restTimeChanged, (_, newTime) => newTime);

sample({
  source: combine([$config, $phaseStartTime]),
  filter: ([_, startTime]) => O.isNone(startTime),
  target: initializePomodoroFx
});

sample({
  source: finishPomodoroFx.doneData,
  filter: Boolean,
  target: nextPhaseInitiated,
});

sample({
  source: stopPomodoroPhaseFx.doneData,
  filter: Boolean,
  target: nextPhaseInitiated,
});
