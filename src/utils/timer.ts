import { getMillisecondsForSeconds } from './time';

export const startTimer = (
  onTick: (remainingTimeInSeconds: number) => void,
  onFinish: () => void,
  countDownInSeconds: number,
) => {
  let remainingTime = countDownInSeconds;

  const interval = setInterval(() => {
    onTick(--remainingTime);
    if (remainingTime <= 0) {
      clearInterval(interval);
      onFinish();
    }
  }, getMillisecondsForSeconds(1));

  return () => clearInterval(interval);
};
