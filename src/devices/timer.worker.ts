const startTimer = (
  onTick: (tick: number) => void,
  onFinish: () => void,
  countDownInSeconds: number
) => {
  let remainingTime = countDownInSeconds;
  onTick(--remainingTime);

  const interval = setInterval(() => {
    onTick(--remainingTime);
    if (remainingTime <= 0) {
      clearInterval(interval);
      onFinish();
    }
  }, 1000);

  return () => clearInterval(interval);
};

let stop: (() => void) | undefined;

const start = (countDown: number) => {
  return startTimer(
    (remaining) => {
      postMessage(['Tick', remaining]);
    },
    () => {
      postMessage(['Finish']);
    },
    countDown,
  );
};

onmessage = (e) => {
  if (e.data[0] === 'Start') {
    stop = start(e.data[1]);
  }

  if (e.data[0] === 'Stop') {
    stop?.();
  }
};

export {};
