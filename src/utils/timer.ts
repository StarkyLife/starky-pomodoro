import { getMillisecondsForSeconds } from './time';

export const startTimer = (
  onTick: (remainingTimeInSeconds: number) => void,
  onFinish: () => void,
  countDownInSeconds: number,
) => {
  let remainingTime = countDownInSeconds

  const interval = setInterval(() => onTick(--remainingTime), getMillisecondsForSeconds(1));
  const timeout = setTimeout(() => {
    clearInterval(interval);
    onFinish();
  }, getMillisecondsForSeconds(countDownInSeconds));

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
};
