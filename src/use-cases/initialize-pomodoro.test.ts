import { PomodoroConfiguration } from '../core/types/pomodoro';
import { initializePomodoroUseCase } from './initialize-pomodoro';

const CONFIG: PomodoroConfiguration = {
  workTime: 25,
  restTime: 5,
};

it('should get initial phase to start with', () => {
  const initialPhase = initializePomodoroUseCase(CONFIG);

  expect(initialPhase).toEqual({ type: 'work', countDown: 25 });
});
