import * as O from 'fp-ts/Option';

import { createEvent, createStore } from 'effector';
import { getNextPhase } from '../use-cases/pomodoro';

export const $currentPomodoroPhase = createStore(getNextPhase());
export const $currentPomodoroStartTime = createStore<O.Option<Date>>(O.none);

export const pomodoroPhaseFinished = createEvent();
export const pomodoroPhaseStopped = createEvent();
export const pomodoroPhaseStarted = createEvent();

$currentPomodoroPhase.on(pomodoroPhaseFinished, (currentPhase) =>
  getNextPhase({ currentPhaseType: currentPhase.type }),
);
$currentPomodoroPhase.on(pomodoroPhaseStopped, (currentPhase) =>
  getNextPhase({ currentPhaseType: currentPhase.type, isStopped: true }),
);

$currentPomodoroStartTime.on(pomodoroPhaseStarted, () => O.some(new Date()));

// TODO: onStop or onFinish -> rememberPhase -> reset startTime store -> getNextPhase
