import * as O from 'fp-ts/Option';
import * as IOO from 'fp-ts/IOOption';
import { pipe } from 'fp-ts/function';

import { PomodoroConfiguration, PomodoroPhase } from '../core/types/pomodoro';
import { createRestPhase, createWorkPhase } from '../core/functions/pomodoro-phases';
import { SavePhaseFn } from './dependencies/pomodoro';
import { NotifyFn } from './dependencies/notification';

type FinishPomodoroUseCaseDeps = {
  saveFn: SavePhaseFn;
  notifyFn: NotifyFn;
};

export const finishPomodoroUseCase = (
  deps: FinishPomodoroUseCaseDeps,
  currentPhase: O.Option<PomodoroPhase>,
  startTime: O.Option<Date>,
  config: PomodoroConfiguration
) =>
  pipe(
    IOO.fromOption(currentPhase),
    IOO.chainFirst((phase) =>
      pipe(
        IOO.fromOption(startTime),
        IOO.chainIOK((time) =>
          deps.saveFn({
            type: phase.type,
            startTime: time,
            endTime: new Date(),
          })
        )
      )
    ),
    IOO.chainFirst((phase) =>
      IOO.fromIO(
        deps.notifyFn(
          phase.type === 'work'
            ? 'Work phase is finished. Time to rest!'
            : 'Rest is over. Time to work!'
        )
      )
    ),
    IOO.map((phase) => (phase.type === 'work' ? createRestPhase(config) : createWorkPhase(config))),
    IOO.toUndefined
  );
