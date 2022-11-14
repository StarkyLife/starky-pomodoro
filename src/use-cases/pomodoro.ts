import { PomodoroPhase, PomodoroPhaseType } from '../core/types/pomodoro';
import { getSecondsForMinutes } from '../utils/time';

export const getNextPhase = (
  options: {
    currentPhaseType?: PomodoroPhaseType;
    isStopped?: boolean;
  } = {},
): PomodoroPhase => {
  const isWorkPhaseNext =
    !options.currentPhaseType ||
    options.currentPhaseType === 'rest' ||
    (options.currentPhaseType === 'work' && options.isStopped);

  return isWorkPhaseNext
    ? { type: 'work', countDown: getSecondsForMinutes(25) }
    : { type: 'rest', countDown: getSecondsForMinutes(5) };
};
