import { createEvent, createStore } from 'effector';
import { getNextPhase } from '../use-cases/pomodoro';

export const $currentPomodoroPhase = createStore(getNextPhase());
export const pomodoroPhaseFinished = createEvent();
export const pomodoroPhaseStopped = createEvent();

$currentPomodoroPhase.on(pomodoroPhaseFinished, (currentPhase) =>
  getNextPhase({ currentPhaseType: currentPhase.type }),
);
$currentPomodoroPhase.on(pomodoroPhaseStopped, (currentPhase) =>
  getNextPhase({ currentPhaseType: currentPhase.type, isStopped: true }),
);
