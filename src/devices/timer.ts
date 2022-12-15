import * as IO from 'fp-ts/IO';
import { pipe } from 'fp-ts/function';
import { StopTimerFn } from '../use-cases/dependencies/timer';

const worker = new Worker(new URL('./timer.worker', import.meta.url));

type TickWatcherFn = (tick: number) => void;
type FinishWatcherFn = () => void;
type UnsubscribeFn = () => IO.IO<void>;

type TimerGateway = {
  start: (countDown: number) => IO.IO<void>;
  stop: StopTimerFn;
  subscribeToTicks: (fn: TickWatcherFn) => IO.IO<UnsubscribeFn>;
  subscribeToFinish: (fn: FinishWatcherFn) => IO.IO<UnsubscribeFn>;
};

export const timerWorkerGatewayFactory = (): TimerGateway => {
  const ticksWatchers = new Set<TickWatcherFn>();
  const finishWatchers = new Set<FinishWatcherFn>();

  worker.onmessage = (e) => {
    if (e.data[0] === 'Finish') {
      finishWatchers.forEach((fn) => fn());
      return;
    }

    if (e.data[0] === 'Tick') {
      ticksWatchers.forEach((fn) => fn(e.data[1]));
      return;
    }
  };

  return {
    start: (countDown) => IO.of(worker.postMessage(['Start', countDown])),
    stop: () => IO.of(worker.postMessage(['Stop'])),
    subscribeToTicks: (watcher) =>
      pipe(
        IO.Do,
        IO.map(() => ticksWatchers.add(watcher)),
        IO.map(() => () => IO.of(ticksWatchers.delete(watcher))),
      ),
    subscribeToFinish: (watcher) =>
      pipe(
        IO.Do,
        IO.map(() => finishWatchers.add(watcher)),
        IO.map(() => () => IO.of(finishWatchers.delete(watcher))),
      ),
  };
};
