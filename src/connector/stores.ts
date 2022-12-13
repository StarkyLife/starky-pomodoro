import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';
import { combine, createStore } from 'effector';

import { PomodoroConfiguration, PomodoroPhase } from '../core/types/pomodoro';
import { showStatistics } from '../use-cases/show-statistics';
import { phasesStorage } from '../devices/phases-storage';

export const $pomodoroPhase = createStore<O.Option<PomodoroPhase>>(O.none);
export const $phaseStartTime = createStore<O.Option<Date>>(O.none);

export const $remainingTime = createStore(0);

export const $statistics = combine([$pomodoroPhase, $phaseStartTime]).map(
  ([currentPhase, startTime]) =>
    showStatistics(phasesStorage.get, constant(currentPhase), constant(startTime))(),
);
export const $workTimeConfig = createStore(25);
export const $restTimeConfig = createStore(5);
export const $config = combine<PomodoroConfiguration>({
  workTime: $workTimeConfig,
  restTime: $restTimeConfig,
});
