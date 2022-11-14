import * as O from 'fp-ts/Option';
import { StatisticsItem } from '../core/types/pomodoro';

export const showStatistics = (): StatisticsItem[] => [
  {
    phaseType: 'work',
    startTime: new Date('2022-11-13T06:00:00.000Z'),
    endTime: O.some(new Date('2022-11-13T06:25:00.000Z')),
  },
  {
    phaseType: 'rest',
    startTime: new Date('2022-11-13T06:25:00.000Z'),
    endTime: O.none
  },
];
