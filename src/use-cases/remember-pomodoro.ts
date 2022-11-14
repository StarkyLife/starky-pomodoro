import { PomodoroPhaseType } from './pomodoro';

export type PomodoroPhase = {
  type: PomodoroPhaseType;
  startTime: Date;
};

export type SavedPomodoroPhase = {
  type: PomodoroPhaseType;
  startTime: Date;
  endTime: Date;
};

export const rememberPomodoroPhase = (
  saveFn: (item: SavedPomodoroPhase) => void,
  pomodoroPhase: PomodoroPhase,
) =>
  saveFn({
    type: pomodoroPhase.type,
    startTime: pomodoroPhase.startTime,
    endTime: new Date(),
  });
