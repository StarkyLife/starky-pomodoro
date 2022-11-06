import { getMillisecondsForMinutes, getMillisecondsForSeconds } from './time';

export const startTimer = (onTick: (tick: number) => void, onFinish: () => void, countDownInMin: number) => {
  let tick = 0;

  const interval = setInterval(() => onTick(tick++), getMillisecondsForSeconds(1));
  const timeout = setTimeout(() => {
    clearInterval(interval);
    onFinish();
  }, getMillisecondsForMinutes(countDownInMin));

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
    onFinish();
  };
};
