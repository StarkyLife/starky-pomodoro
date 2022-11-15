import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';

import { SavedPomodoroPhase } from '../core/types/pomodoro';

type SavePomodoroPhaseFn = (phase: SavedPomodoroPhase) => IO.IO<void>;
type GetPomodorosFn = () => IO.IO<SavedPomodoroPhase[]>;

type PomodorosStorage = {
  save: SavePomodoroPhaseFn;
  get: GetPomodorosFn;
};

const POMODOROS_STORAGE_KEY = 'pomodoros';

const getData = () =>
  pipe(
    IO.Do,
    IO.map(() =>
      pipe(
        O.fromNullable(localStorage.getItem(POMODOROS_STORAGE_KEY)),
        O.chain(O.tryCatchK((text) => JSON.parse(text) as SavedPomodoroPhase[])),
        O.getOrElse(constant<SavedPomodoroPhase[]>([])),
      ),
    ),
  );

export const pomodorosStorage: PomodorosStorage = {
  save: (phase) =>
    pipe(
      getData(),
      IO.map((savedPhases) => JSON.stringify([...savedPhases, phase])),
      IO.map((phasesText) => localStorage.setItem(POMODOROS_STORAGE_KEY, phasesText)),
    ),
  get: getData,
};
