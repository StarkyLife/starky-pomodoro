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

const CONFIG: PomodoroConfiguration = {
  workTime: getSecondsForMinutes(25),
  restTime: getSecondsForMinutes(5),
};

export const $pomodoroPhase = createStore<O.Option<PomodoroPhase>>(O.none);
export const $phaseStartTime = createStore<O.Option<Date>>(O.none);
export const $statistics = combine([$pomodoroPhase, $phaseStartTime]).map(
  ([currentPhase, startTime]) =>
    showStatistics(phasesStorage.get, constant(currentPhase), constant(startTime))(),
);

export const initializePomodoroFx = createEffect(() => initializePomodoroUseCase(CONFIG));
export const finishPomodoroFx = attach({
  source: combine([$pomodoroPhase, $phaseStartTime]),
  effect: createEffect(([phase, startTime]: [O.Option<PomodoroPhase>, O.Option<Date>]) =>
    finishPomodoroUseCase(phasesStorage.save, phase, startTime, CONFIG),
  ),
});
export const stopPomodoroPhaseFx = attach({
  source: $pomodoroPhase,
  effect: createEffect((currentPhase: O.Option<PomodoroPhase>) =>
    stopPomodoroUseCase(currentPhase, CONFIG),
  ),
});

export const pomodoroPhaseFinished = createEvent();
export const pomodoroPhaseStopped = createEvent();
export const pomodoroPhaseStarted = createEvent();
export const nextPhaseInitiated = createEvent<PomodoroPhase>();

$pomodoroPhase.on(nextPhaseInitiated, (_, nextPhase) => O.some(nextPhase));
$pomodoroPhase.on(initializePomodoroFx.doneData, (_, phase) => O.some(phase));

$phaseStartTime.on(pomodoroPhaseStarted, () => O.some(new Date()));
$phaseStartTime.reset(nextPhaseInitiated);

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
