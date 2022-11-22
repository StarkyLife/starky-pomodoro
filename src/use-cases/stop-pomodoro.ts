import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';

import { PomodoroConfiguration, PomodoroPhase } from '../core/types/pomodoro';
import { createWorkPhase } from '../core/functions/pomodoro-phases';

export const stopPomodoroUseCase = (
  currentPhase: O.Option<PomodoroPhase>,
  config: PomodoroConfiguration,
) => pipe(currentPhase, O.map(constant(createWorkPhase(config))), O.toUndefined);
