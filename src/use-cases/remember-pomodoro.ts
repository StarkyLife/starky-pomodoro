import * as IO from 'fp-ts/IO';
import { PomodoroPhaseType, SavedPomodoroPhase } from '../core/types/pomodoro';

export const rememberPomodoroPhase = (
  saveFn: (item: SavedPomodoroPhase) => IO.IO<void>,
  pomodoroPhaseType: PomodoroPhaseType,
  pomodoroPhaseStartTime: Date,
) =>
  saveFn({
    type: pomodoroPhaseType,
    startTime: pomodoroPhaseStartTime,
    endTime: new Date(),
  });
