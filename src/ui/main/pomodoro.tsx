import * as O from 'fp-ts/Option';
import { useStore } from 'effector-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  $pomodoroPhase,
  pomodoroPhaseStarted,
  pomodoroInitialized,
  pomodoroPhaseStopped,
  pomodoroPhaseFinished,
} from '../../connector/pomodoro';
import { PomodoroPhase } from '../../core/types/pomodoro';
import { startTimer } from '../../utils/timer';

export const Pomodoro: React.FC = () => {
  const currentPhase = useStore($pomodoroPhase);

  useEffect(() => pomodoroInitialized(), []);

  return O.isNone(currentPhase) ? (
    <div>Loading</div>
  ) : (
    <PomodoroTimer currentPhase={currentPhase.value} />
  );
};

export const PomodoroTimer: React.FC<{ currentPhase: PomodoroPhase }> = ({ currentPhase }) => {
  const [remainingTime, setRemainingTime] = useState(currentPhase.countDown);

  useEffect(() => setRemainingTime(currentPhase.countDown), [currentPhase]);

  const stopTimerRef = useRef<(() => void) | undefined>(undefined);

  const handleStart = useCallback(() => {
    stopTimerRef.current?.();
    stopTimerRef.current = startTimer(
      setRemainingTime,
      pomodoroPhaseFinished,
      currentPhase.countDown,
    );
    pomodoroPhaseStarted();
  }, [setRemainingTime, currentPhase.countDown]);

  const handleStop = useCallback(() => {
    stopTimerRef.current?.();
    pomodoroPhaseStopped();
  }, []);

  return (
    <div>
      <p>{currentPhase.type}</p>
      <p>{remainingTime}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};
