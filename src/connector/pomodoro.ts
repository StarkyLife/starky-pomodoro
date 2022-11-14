import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

import { combine, createEvent, createStore, sample } from 'effector';
import { getNextPhase } from '../use-cases/pomodoro';
import { rememberPomodoroPhase } from '../use-cases/remember-pomodoro';
import { PomodoroPhase } from '../core/types/pomodoro';

export const pomodoroPhaseFinished = createEvent();
export const pomodoroPhaseStopped = createEvent();
export const pomodoroPhaseStarted = createEvent();
export const nextPhaseInitiated = createEvent<PomodoroPhase>();

export const $currentPomodoroPhase = createStore(getNextPhase())
  .on(nextPhaseInitiated, (_, nextPhase) => nextPhase);
export const $currentPomodoroStartTime = createStore<O.Option<Date>>(O.none)
  .on(pomodoroPhaseStarted, () => O.some(new Date()))
  .reset(nextPhaseInitiated);

sample({
  clock: pomodoroPhaseFinished,
  source: combine([$currentPomodoroPhase, $currentPomodoroStartTime]),
  fn: ([currentPhase, startTime]) =>
    pipe(
      startTime,
      // TODO: передать реальную функцию
      O.map((time) => rememberPomodoroPhase(() => {}, currentPhase.type, time)),
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
