import * as O from 'fp-ts/Option';

import { StatisticsItem } from '../core/types/pomodoro';
import { showStatistics } from './show-statistics';

it('should show all finished and current pomodoros', () => {
  const finishedPhases: StatisticsItem[] = [
    {
      phaseType: 'work',
      startTime: new Date('2022-11-13T06:00:00.000Z'),
      endTime: O.some(new Date('2022-11-13T06:25:00.000Z')),
    },
  ];
  const activePhase: StatisticsItem = {
    phaseType: 'rest',
    startTime: new Date('2022-11-13T06:25:00.000Z'),
    endTime: O.none,
  };

  const statistics = showStatistics();

  expect(statistics).toEqual([...finishedPhases, activePhase]);
});
