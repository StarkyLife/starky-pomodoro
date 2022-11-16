import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import { constant, pipe } from 'fp-ts/function';

import { PomodoroPhaseType, SavedPomodoroPhase } from '../core/types/pomodoro';
import { GetPomodorosFn, SavePomodoroPhaseFn } from '../use-cases/dependencies/pomodoro';

type ParsedPhase = {
  type: PomodoroPhaseType;
  startTime: string;
  endTime: string;
};

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
        O.chain(O.tryCatchK((text) => JSON.parse(text) as ParsedPhase[])),
        O.map(
          A.map(
            (phase): SavedPomodoroPhase => ({
              ...phase,
              startTime: new Date(phase.startTime),
              endTime: new Date(phase.endTime),
            }),
          ),
        ),
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
