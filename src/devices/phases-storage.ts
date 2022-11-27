import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import { constant, pipe } from 'fp-ts/function';
import { isAfter, startOfDay } from 'date-fns';

import { PomodoroPhaseType, StoredPomodoroPhase } from '../core/types/pomodoro';
import { GetStoredPhasesFn, SavePhaseFn } from '../use-cases/dependencies/pomodoro';

type ParsedPhase = {
  type: PomodoroPhaseType;
  startTime: string;
  endTime: string;
};

const PHASES_STORAGE_KEY = 'pomodoros-phases';

const getData = () =>
  pipe(
    O.fromNullable(localStorage.getItem(PHASES_STORAGE_KEY)),
    O.chain(O.tryCatchK((text) => JSON.parse(text) as ParsedPhase[])),
    O.map(
      A.map(
        (phase): StoredPomodoroPhase => ({
          ...phase,
          startTime: new Date(phase.startTime),
          endTime: new Date(phase.endTime),
        }),
      ),
    ),
    O.getOrElse(constant<StoredPomodoroPhase[]>([])),
    A.filter((phase) => isAfter(phase.startTime, startOfDay(new Date()))),
    IO.of,
  );

export const phasesStorage: {
  save: SavePhaseFn;
  get: GetStoredPhasesFn;
} = {
  save: (phase) =>
    pipe(
      getData(),
      IO.map((savedPhases) => JSON.stringify([...savedPhases, phase])),
      IO.map((phasesText) => localStorage.setItem(PHASES_STORAGE_KEY, phasesText)),
    ),
  get: getData,
};
