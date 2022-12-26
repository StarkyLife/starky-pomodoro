import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IO';

import { PomodoroPhase, StoredPomodoroPhase } from '../core/types/pomodoro';
import { showStatistics } from './show-statistics';

const createStoredPhase = (): StoredPomodoroPhase => ({
  type: 'work',
  startTime: new Date('2022-11-13T06:00:00.000Z'),
  endTime: new Date('2022-11-13T06:25:00.000Z'),
});
const createPomodoroPhase = (): PomodoroPhase => ({
  type: 'rest',
  countDown: 1,
});

const callUseCase = (
  storedPhases: StoredPomodoroPhase[],
  activePhase: O.Option<PomodoroPhase>,
  startTime: O.Option<Date>
) => {
  const getStoredPhases = jest.fn().mockReturnValue(IO.of(storedPhases));
  const getCurrentActivePhase = jest.fn().mockReturnValue(activePhase);
  const getActivePhaseStartTime = jest.fn().mockReturnValue(startTime);

  return showStatistics(getStoredPhases, getCurrentActivePhase, getActivePhaseStartTime)();
};

it('should show all finished and current pomodoros', () => {
  const storedPhase = createStoredPhase();
  const activePhase = createPomodoroPhase();
  const startTime = new Date('2022-11-13T06:25:00.000Z');

  const statistics = callUseCase([storedPhase], O.some(activePhase), O.some(startTime));

  expect(statistics).toEqual([
    {
      phaseType: storedPhase.type,
      startTime: storedPhase.startTime,
      endTime: O.some(storedPhase.endTime),
    },
    {
      phaseType: activePhase.type,
      startTime,
      endTime: O.none,
    },
  ]);
});

it('should show only finished if active one is not started', () => {
  const storedPhase = createStoredPhase();
  const activePhase = createPomodoroPhase();

  const statistics = callUseCase([storedPhase], O.some(activePhase), O.none);

  expect(statistics).toEqual([
    {
      phaseType: storedPhase.type,
      startTime: storedPhase.startTime,
      endTime: O.some(storedPhase.endTime),
    },
  ]);
});
