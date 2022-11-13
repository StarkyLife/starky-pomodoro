import { showStatistics, StatisticsItem } from './show-statistics';

it('should show all finished and current pomodoros', () => {
  const finishedPhases: StatisticsItem[] = [
    {
      phaseType: 'work',
      startTime: new Date('2022-11-13T06:00:00.000Z'),
      endTime: new Date('2022-11-13T06:25:00.000Z'),
    },
  ];
  const activePhase: StatisticsItem = {
    phaseType: 'rest',
    startTime: new Date('2022-11-13T06:25:00.000Z'),
  };

  const statistics = showStatistics();

  expect(statistics).toEqual([...finishedPhases, activePhase]);
});
