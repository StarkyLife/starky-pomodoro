import { PomodoroPhaseType } from './pomodoro';

export type StatisticsItem = {
  phaseType: PomodoroPhaseType;
  startTime: Date;
  endTime?: Date;
};

export const showStatistics = () => [
  {
    phaseType: 'work',
    startTime: new Date('2022-11-13T06:00:00.000Z'),
    endTime: new Date('2022-11-13T06:25:00.000Z'),
  },
  {
    phaseType: 'rest',
    startTime: new Date('2022-11-13T06:25:00.000Z'),
  },
];
