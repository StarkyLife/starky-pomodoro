import { createWorkPhase } from '../core/functions/pomodoro-phases';
import { PomodoroConfiguration } from '../core/types/pomodoro';

export const initializePomodoroUseCase = (config: PomodoroConfiguration) => createWorkPhase(config);
