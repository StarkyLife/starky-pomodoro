export type PomodoroPhaseType = 'work' | 'rest';
export type PomodoroPhase = { type: PomodoroPhaseType; countDownInMin: number };

export const getNextPhase = (currentPhase?: PomodoroPhaseType): PomodoroPhase =>
  currentPhase === 'work'
    ? { type: 'rest', countDownInMin: 5 }
    : { type: 'work', countDownInMin: 25 };

