import { PomodoroConfiguration, PomodoroPhase } from '../types/pomodoro';

export const createWorkPhase = (config: PomodoroConfiguration): PomodoroPhase => ({
  type: 'work',
  countDown: config.workTime,
});
export const createRestPhase = (config: PomodoroConfiguration): PomodoroPhase => ({
  type: 'rest',
  countDown: config.restTime,
});
