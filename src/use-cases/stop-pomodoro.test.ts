import * as O from 'fp-ts/Option';
import { createRestPhase, createWorkPhase } from '../core/functions/pomodoro-phases';
import { PomodoroConfiguration } from '../core/types/pomodoro';
import { stopPomodoroUseCase } from './stop-pomodoro';

const CONFIG: PomodoroConfiguration = {
  workTime: 25,
  restTime: 5,
};

it('should stop timer', () => {
  const stopTimer = jest.fn();

  stopPomodoroUseCase({ stopTimer: () => stopTimer }, O.none, CONFIG)();

  expect(stopTimer).toHaveBeenCalled();
});

it('should do nothing if currentPhase is not set', () => {
  const stopTimer = jest.fn();

  const nextPhase = stopPomodoroUseCase({ stopTimer: () => stopTimer }, O.none, CONFIG)();

  expect(nextPhase).toBeUndefined();
});

it('should return next phase', () => {
  const stopTimer = jest.fn();
  const currentPhase = createRestPhase(CONFIG);

  const nextPhase = stopPomodoroUseCase(
    { stopTimer: () => stopTimer },
    O.some(currentPhase),
    CONFIG,
  )();

  expect(nextPhase).toEqual(createWorkPhase(CONFIG));
});
