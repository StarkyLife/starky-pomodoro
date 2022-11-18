import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';

import { PomodoroPhase } from '../core/types/pomodoro';
import { createWorkPhase } from '../core/functions/pomodoro-phases';

export const stopPomodoroUseCase = (currentPhase: O.Option<PomodoroPhase>) =>
  pipe(currentPhase, O.map(constant(createWorkPhase())), O.toUndefined);
