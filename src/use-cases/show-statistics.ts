import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IO';
import * as A from 'fp-ts/Array';
import { PomodoroPhase, StatisticsItem } from '../core/types/pomodoro';
import { GetStoredPhasesFn } from './dependencies/pomodoro';

export const showStatistics = (
  getStoredPhases: GetStoredPhasesFn,
  getCurrentActivePhase: () => O.Option<PomodoroPhase>,
  getActivePhaseStartTime: () => O.Option<Date>
) =>
  pipe(
    getStoredPhases(),
    IO.map(
      A.map(
        (storedPhase): StatisticsItem => ({
          phaseType: storedPhase.type,
          startTime: storedPhase.startTime,
          endTime: O.some(storedPhase.endTime),
        })
      )
    ),
    IO.map((storedPhasesStatistics) =>
      pipe(
        O.Do,
        O.bind('startTime', getActivePhaseStartTime),
        O.bind('activePhase', getCurrentActivePhase),
        O.fold(
          () => storedPhasesStatistics,
          ({ startTime, activePhase }) => [
            ...storedPhasesStatistics,
            {
              phaseType: activePhase.type,
              startTime,
              endTime: O.none,
            },
          ]
        )
      )
    )
  );
