import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

import { PomodoroConfiguration, PomodoroPhase } from '../core/types/pomodoro';
import { createRestPhase, createWorkPhase } from '../core/functions/pomodoro-phases';
import { SavePhaseFn } from './dependencies/pomodoro';

export const finishPomodoroUseCase = (
  saveFn: SavePhaseFn,
  currentPhase: O.Option<PomodoroPhase>,
  startTime: O.Option<Date>,
  config: PomodoroConfiguration,
) =>
  pipe(
    currentPhase,
    O.chainFirst((phase) =>
      pipe(
        startTime,
        O.map((time) =>
          saveFn({
            type: phase.type,
            startTime: time,
            endTime: new Date(),
          })(),
        ),
      ),
    ),
    O.map((phase) => (phase.type === 'work' ? createRestPhase(config) : createWorkPhase(config))),
    O.toUndefined,
  );
