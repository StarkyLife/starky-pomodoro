import * as IO from 'fp-ts/IO';
import { StoredPomodoroPhase } from '../../core/types/pomodoro';

export type SavePhaseFn = (phase: StoredPomodoroPhase) => IO.IO<void>;
export type GetStoredPhasesFn = () => IO.IO<StoredPomodoroPhase[]>;
