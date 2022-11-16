import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';

import { combine, createEvent, createStore, sample } from 'effector';
import { getNextPhase } from '../use-cases/get-next-phase';
import { rememberPomodoroPhase } from '../use-cases/remember-pomodoro';
import { PomodoroPhase } from '../core/types/pomodoro';
import { pomodorosStorage } from '../devices/pomodoros-storage';
import { showStatistics } from '../use-cases/show-statistics';

// TODO:
// - currentPhase = O.Option, так как инициализация может потребовать заглянуть в localStorage,
// чтобы достать сохраненную конфигурацию
// - initializePomodoro use case
// - finishPomodoro use case
// - stopPomodoro use case

export const pomodoroPhaseFinished = createEvent();
export const pomodoroPhaseStopped = createEvent();
export const pomodoroPhaseStarted = createEvent();
export const nextPhaseInitiated = createEvent<PomodoroPhase>();

export const $currentPomodoroPhase = createStore(getNextPhase()).on(
  nextPhaseInitiated,
  (_, nextPhase) => nextPhase,
);
export const $currentPomodoroStartTime = createStore<O.Option<Date>>(O.none)
  .on(pomodoroPhaseStarted, () => O.some(new Date()))
  .reset(nextPhaseInitiated);
export const $statistics = combine([$currentPomodoroPhase, $currentPomodoroStartTime]).map(
  ([currentPhase, startTime]) =>
    showStatistics(pomodorosStorage.get, constant(currentPhase), constant(startTime))(),
);

sample({
  clock: pomodoroPhaseFinished,
  source: combine([$currentPomodoroPhase, $currentPomodoroStartTime]),
  fn: ([currentPhase, startTime]) =>
    pipe(
      startTime,
      O.map((time) => rememberPomodoroPhase(pomodorosStorage.save, currentPhase.type, time)()),
      () => getNextPhase({ currentPhaseType: currentPhase.type }),
    ),
  target: nextPhaseInitiated,
});

sample({
  clock: pomodoroPhaseStopped,
  source: $currentPomodoroPhase,
  fn: (currentPhase) => getNextPhase({ currentPhaseType: currentPhase.type, isStopped: true }),
  target: nextPhaseInitiated,
});
