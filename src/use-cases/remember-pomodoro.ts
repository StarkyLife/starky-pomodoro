import { PomodoroPhaseType } from '../core/types/pomodoro';
import { SavePomodoroPhaseFn } from './dependencies/pomodoro';

export const rememberPomodoroPhase = (
  saveFn: SavePomodoroPhaseFn,
  pomodoroPhaseType: PomodoroPhaseType,
  pomodoroPhaseStartTime: Date,
) =>
  saveFn({
    type: pomodoroPhaseType,
    startTime: pomodoroPhaseStartTime,
    endTime: new Date(),
  });
