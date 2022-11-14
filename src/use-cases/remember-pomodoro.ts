import { PomodoroPhaseType, SavedPomodoroPhase } from '../core/types/pomodoro';

export const rememberPomodoroPhase = (
  saveFn: (item: SavedPomodoroPhase) => void,
  pomodoroPhaseType: PomodoroPhaseType,
  pomodoroPhaseStartTime: Date,
) =>
  saveFn({
    type: pomodoroPhaseType,
    startTime: pomodoroPhaseStartTime,
    endTime: new Date(),
  });
