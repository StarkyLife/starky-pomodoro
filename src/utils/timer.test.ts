import { getMillisecondsForMinutes } from './time';
import { startTimer } from './timer';

jest.useFakeTimers();

it('should count down', () => {
  // ARRANGE
  const actualTicks: number[] = [];
  const onTick = (tick: number) => {
    actualTicks.push(tick);
  };

  let isFinished = false;
  const onFinish = () => {
    isFinished = true;
  };

  // ACT

  const stopTimer = startTimer(onTick, onFinish, 2);
  jest.advanceTimersByTime(getMillisecondsForMinutes(1));
  stopTimer();

  // ASSERT

  expect(isFinished).toBe(true);
  expect(actualTicks).toEqual(Array.from({ length: 60 }).map((_, i) => i));
});
