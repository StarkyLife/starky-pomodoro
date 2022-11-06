import { constVoid } from 'fp-ts/function';
import { getMillisecondsForMinutes } from '../utils/time';
import { startTimer } from '../utils/timer';
import { getNextPhase } from './pomodoro';

jest.useFakeTimers();

// TODO: it should get countDowns from configuration store

it('should get next phase', () => {
  expect(getNextPhase()).toEqual({ type: 'work', countDownInMin: 25 });
  expect(getNextPhase('work')).toEqual({ type: 'rest', countDownInMin: 5 });
  expect(getNextPhase('rest')).toEqual({ type: 'work', countDownInMin: 25 });
});

it('should get next phase after finish', () => {
  let currentPhase = getNextPhase();
  const onFinish = () => {
    currentPhase = getNextPhase(currentPhase.type);
  };

  startTimer(constVoid, onFinish, currentPhase.countDownInMin);
  jest.advanceTimersByTime(getMillisecondsForMinutes(currentPhase.countDownInMin));

  expect(currentPhase).toEqual({ type: 'rest', countDownInMin: 5 });
});
