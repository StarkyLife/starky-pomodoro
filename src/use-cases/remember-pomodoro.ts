import { PomodoroPhaseType } from '../core/types/pomodoro';
import { SavePhaseFn } from './dependencies/pomodoro';

export const rememberPomodoroPhase = (
  saveFn: SavePhaseFn,
  pomodoroPhaseType: PomodoroPhaseType,
  pomodoroPhaseStartTime: Date,
) =>
  saveFn({
    type: pomodoroPhaseType,
    startTime: pomodoroPhaseStartTime,
    endTime: new Date(),
  });
