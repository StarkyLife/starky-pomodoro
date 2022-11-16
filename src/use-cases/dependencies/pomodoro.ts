import * as IO from 'fp-ts/IO';
import { SavedPomodoroPhase } from '../../core/types/pomodoro';

export type SavePomodoroPhaseFn = (phase: SavedPomodoroPhase) => IO.IO<void>;
export type GetPomodorosFn = () => IO.IO<SavedPomodoroPhase[]>;
