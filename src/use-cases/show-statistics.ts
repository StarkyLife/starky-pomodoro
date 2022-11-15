import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IO';
import * as A from 'fp-ts/Array';
import { PomodoroPhase, SavedPomodoroPhase, StatisticsItem } from '../core/types/pomodoro';

export const showStatistics = (
  getStoredPhases: () => IO.IO<SavedPomodoroPhase[]>,
  getCurrentActivePhase: () => PomodoroPhase,
  getActivePhaseStartTime: () => O.Option<Date>,
) =>
  pipe(
    getStoredPhases(),
    IO.map(
      A.map(
        (storedPhase): StatisticsItem => ({
          phaseType: storedPhase.type,
          startTime: storedPhase.startTime,
          endTime: O.some(storedPhase.endTime),
        }),
      ),
    ),
    IO.map((storedPhasesStatistics) =>
      pipe(
        O.Do,
        O.bind('startTime', getActivePhaseStartTime),
        O.bind('activePhase', () => O.of(getCurrentActivePhase())),
        O.fold(
          () => storedPhasesStatistics,
          ({ startTime, activePhase }) => [
            ...storedPhasesStatistics,
            {
              phaseType: activePhase.type,
              startTime,
              endTime: O.none,
            },
          ],
        ),
      ),
    ),
  );
