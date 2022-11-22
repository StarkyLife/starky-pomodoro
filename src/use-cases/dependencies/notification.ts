import * as IO from 'fp-ts/IO';

export type NotifyFn = (text: string) => IO.IO<void>;
