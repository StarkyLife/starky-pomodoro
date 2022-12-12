import * as O from 'fp-ts/Option';
import { createEffect } from 'effector';

import { PomodoroConfiguration, PomodoroPhase } from '../core/types/pomodoro';
import { initializePomodoroUseCase } from '../use-cases/initialize-pomodoro';
import { finishPomodoroUseCase } from '../use-cases/finish-pomodoro';
import { stopPomodoroUseCase } from '../use-cases/stop-pomodoro';
import { StartTimerFn, StopTimerFn } from '../use-cases/dependencies/timer';
import { SavePhaseFn } from '../use-cases/dependencies/pomodoro';
import { NotifyFn } from '../use-cases/dependencies/notification';

export const initializePomodoroFx = createEffect((config: PomodoroConfiguration) =>
  initializePomodoroUseCase(config),
);
export const startPomodoroFx = createEffect(
  ({ startTimer, countDown }: { startTimer: StartTimerFn; countDown: number }) =>
    startTimer(countDown)(),
);
export const finishPomodoroFx = createEffect(
  ({
    savePhase,
    notify,
    phase,
    startTime,
    config,
  }: {
    savePhase: SavePhaseFn;
    notify: NotifyFn;
    phase: O.Option<PomodoroPhase>;
    startTime: O.Option<Date>;
    config: PomodoroConfiguration;
  }) => finishPomodoroUseCase({ saveFn: savePhase, notifyFn: notify }, phase, startTime, config)(),
);
export const stopPomodoroPhaseFx = createEffect(
  ({
    stopTimer,
    currentPhase,
    config,
  }: {
    stopTimer: StopTimerFn;
    currentPhase: O.Option<PomodoroPhase>;
    config: PomodoroConfiguration;
  }) => stopPomodoroUseCase({ stopTimer }, currentPhase, config)(),
);
