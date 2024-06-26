import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IO';
import { constVoid } from 'fp-ts/function';

import { createRestPhase, createWorkPhase } from '../core/functions/pomodoro-phases';
import { PomodoroConfiguration } from '../core/types/pomodoro';
import { finishPomodoroUseCase } from './finish-pomodoro';

const MOCKED_NOW = new Date('2022-11-13T06:25:00.000Z');

jest.useFakeTimers();
jest.setSystemTime(MOCKED_NOW);

const CONFIG: PomodoroConfiguration = {
  workTime: 25,
  restTime: 5,
};

const configureDependencies = () => ({
  saveFn: jest.fn().mockReturnValue(IO.of(constVoid())),
  notifyFn: jest.fn().mockReturnValue(IO.of(constVoid())),
});

it('should do noting if currentPhase is not set', () => {
  const deps = configureDependencies();

  const nextPhase = finishPomodoroUseCase(deps, O.none, O.some(new Date()), CONFIG)();

  expect(nextPhase).toBeUndefined();
});

it('should do noting if startTime is not set', () => {
  const deps = configureDependencies();

  const nextPhase = finishPomodoroUseCase(deps, O.some(createRestPhase(CONFIG)), O.none, CONFIG)();

  expect(nextPhase).toBeUndefined();
});

it('should return `work` phase given `rest` phase and notify', () => {
  const deps = configureDependencies();

  const nextPhase = finishPomodoroUseCase(
    deps,
    O.some(createRestPhase(CONFIG)),
    O.some(new Date()),
    CONFIG
  )();

  expect(nextPhase).toEqual(createWorkPhase(CONFIG));
  expect(deps.notifyFn).toHaveBeenCalledWith('Rest is over. Time to work!');
});

it('should return `rest` phase given `work` phase and notify', () => {
  const deps = configureDependencies();

  const nextPhase = finishPomodoroUseCase(
    deps,
    O.some(createWorkPhase(CONFIG)),
    O.some(new Date()),
    CONFIG
  )();

  expect(nextPhase).toEqual(createRestPhase(CONFIG));
  expect(deps.notifyFn).toHaveBeenCalledWith('Work phase is finished. Time to rest!');
});

it('should save finished pomodoro phase info to storage', () => {
  const deps = configureDependencies();
  const pomodoroPhaseStartTime = new Date('2022-11-13T06:00:00.000Z');

  finishPomodoroUseCase(
    deps,
    O.some(createWorkPhase(CONFIG)),
    O.some(pomodoroPhaseStartTime),
    CONFIG
  )();

  expect(deps.saveFn).toHaveBeenCalledWith({
    type: 'work',
    startTime: pomodoroPhaseStartTime,
    endTime: MOCKED_NOW,
  });
});
