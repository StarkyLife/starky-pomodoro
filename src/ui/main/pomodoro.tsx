import { useStore } from 'effector-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  $currentPomodoroPhase,
  pomodoroPhaseFinished,
  pomodoroPhaseStopped,
} from '../../connector/pomodoro';
import { startTimer } from '../../utils/timer';

export const Pomodoro: React.FC = () => {
  const currentPhase = useStore($currentPomodoroPhase);
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
