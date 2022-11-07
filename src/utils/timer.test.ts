import { getMillisecondsForSeconds } from './time';
import { startTimer } from './timer';

jest.useFakeTimers();

const createTickMock = () => {
  const ticks: number[] = [];

  return {
    ticks,
    onTick: (tick: number) => {
      ticks.push(tick);
    },
  };
};

it('should count down untill finish', () => {
  // ARRANGE

  const ticksMock = createTickMock();
  const onFinish = jest.fn();

  // ACT

  startTimer(ticksMock.onTick, onFinish, 60);
  jest.advanceTimersByTime(getMillisecondsForSeconds(60));

  // ASSERT

  expect(onFinish).toHaveBeenCalledTimes(1);
  expect(ticksMock.ticks).toEqual(Array.from({ length: 60 }).map((_, i) => 60 - (i + 1)));
});

it('should count down until stop', () => {
  // ARRANGE

  const ticksMock = createTickMock();
  const onFinish = jest.fn();

  // ACT

  const stopTimer = startTimer(ticksMock.onTick, onFinish, 120);
  jest.advanceTimersByTime(getMillisecondsForSeconds(60));
  stopTimer();

  // ASSERT

  expect(onFinish).not.toHaveBeenCalled();
  expect(ticksMock.ticks).toEqual(Array.from({ length: 60 }).map((_, i) => 120 - (i + 1)));
});
