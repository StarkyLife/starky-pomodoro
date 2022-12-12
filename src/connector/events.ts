import { createEvent } from 'effector';
import { PomodoroPhase } from '../core/types/pomodoro';

export const timerClicked = createEvent();
export const timerTicked = createEvent<number>();

export const pomodoroInitialized = createEvent();
export const pomodoroPhaseStarted = createEvent();
export const pomodoroPhaseStopped = createEvent();
export const pomodoroPhaseFinished = createEvent();

export const workTimeChanged = createEvent<number>();
export const restTimeChanged = createEvent<number>();

export const nextPhaseInitiated = createEvent<PomodoroPhase>();
