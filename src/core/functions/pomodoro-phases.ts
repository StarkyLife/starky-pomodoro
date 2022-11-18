import { getSecondsForMinutes } from '../../utils/time';
import { PomodoroPhase } from '../types/pomodoro';

export const createWorkPhase = (): PomodoroPhase => ({
  type: 'work',
  countDown: getSecondsForMinutes(25),
});
export const createRestPhase = (): PomodoroPhase => ({
  type: 'rest',
  countDown: getSecondsForMinutes(5),
});
