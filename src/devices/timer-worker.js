export default () => {
  const startTimer = (onTick, onFinish, countDownInSeconds) => {
    let remainingTime = countDownInSeconds;

    const interval = setInterval(() => {
      onTick(--remainingTime);
      if (remainingTime <= 0) {
        clearInterval(interval);
        onFinish();
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  let stop;

  const start = (countDown) => {
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
};
