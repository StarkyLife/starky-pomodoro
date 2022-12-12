import * as IO from 'fp-ts/IO';

export type StartTimerFn = (countDown: number) => IO.IO<void>;
export type StopTimerFn = () => IO.IO<void>;
