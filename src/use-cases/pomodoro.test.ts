import { getSecondsForMinutes } from '../utils/time';
import { getNextPhase } from './pomodoro';

jest.useFakeTimers();

it('should get next phase', () => {
  expect(getNextPhase()).toEqual({ type: 'work', countDown: getSecondsForMinutes(25) });
  expect(getNextPhase({ currentPhaseType: 'work' })).toEqual({
    type: 'rest',
    countDown: getSecondsForMinutes(5),
  });
  expect(getNextPhase({ currentPhaseType: 'rest' })).toEqual({
    type: 'work',
    countDown: getSecondsForMinutes(25),
  });
  expect(getNextPhase({ currentPhaseType: 'work', isStopped: true })).toEqual({
    type: 'work',
    countDown: getSecondsForMinutes(25),
  });
});
