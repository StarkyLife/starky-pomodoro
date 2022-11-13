import { getSecondsForMinutes } from '../utils/time';

export type PomodoroPhaseType = 'work' | 'rest';
export type PomodoroPhase = { type: PomodoroPhaseType; countDown: number };

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
    ? { type: 'work', countDown: getSecondsForMinutes(1) }
    : { type: 'rest', countDown: getSecondsForMinutes(5) };
};
