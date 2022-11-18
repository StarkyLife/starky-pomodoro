import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

import { rememberPomodoroPhase } from '../use-cases/remember-pomodoro';
import { PomodoroPhase } from '../core/types/pomodoro';
import { phasesStorage } from '../devices/phases-storage';
import { createRestPhase, createWorkPhase } from '../core/functions/pomodoro-phases';

export const finishPomodoroUseCase = (
  currentPhase: O.Option<PomodoroPhase>,
  startTime: O.Option<Date>,
) =>
  pipe(
    currentPhase,
    O.chainFirst((phase) =>
      pipe(
        startTime,
        O.map((time) => rememberPomodoroPhase(phasesStorage.save, phase.type, time)()),
      ),
    ),
    O.map((phase) => (phase.type === 'work' ? createRestPhase() : createWorkPhase())),
    O.toUndefined,
  );
