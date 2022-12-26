import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IO';
import { constant, pipe } from 'fp-ts/function';

import { PomodoroConfiguration, PomodoroPhase } from '../core/types/pomodoro';
import { createWorkPhase } from '../core/functions/pomodoro-phases';
import { StopTimerFn } from './dependencies/timer';

export const stopPomodoroUseCase = (
  deps: {
    stopTimer: StopTimerFn;
  },
  currentPhase: O.Option<PomodoroPhase>,
  config: PomodoroConfiguration
) =>
  pipe(
    deps.stopTimer(),
    IO.map(() => pipe(currentPhase, O.map(constant(createWorkPhase(config))), O.toUndefined))
  );
