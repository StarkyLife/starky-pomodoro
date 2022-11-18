import * as O from 'fp-ts/Option';

export type PomodoroPhaseType = 'work' | 'rest';
export type PomodoroPhase = {
  type: PomodoroPhaseType;
  countDown: number
};
export type StoredPomodoroPhase = {
  type: PomodoroPhaseType;
  startTime: Date;
  endTime: Date
};
export type StatisticsItem = {
  phaseType: PomodoroPhaseType;
  startTime: Date;
  endTime: O.Option<Date>;
};
