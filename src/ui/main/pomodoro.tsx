import React, { useCallback, useRef, useState } from 'react';
import { getNextPhase, PomodoroPhase } from '../../use-cases/pomodoro';
import { startTimer } from '../../utils/timer';

export const Pomodoro: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState(getNextPhase());
  const [remainingTime, setRemainingTime] = useState(currentPhase.countDown);

  const handlePhaseUpdate = useCallback(
    (newPhase: PomodoroPhase) => {
      setCurrentPhase(newPhase);
      setRemainingTime(newPhase.countDown);
    },
    [setCurrentPhase, setRemainingTime],
  );

  const handleFinish = useCallback(() => {
    handlePhaseUpdate(getNextPhase({ currentPhaseType: currentPhase.type }));
  }, [currentPhase.type, handlePhaseUpdate]);

  const stopTimerRef = useRef<(() => void) | undefined>(undefined);

  const handleStart = useCallback(() => {
    stopTimerRef.current?.();
    stopTimerRef.current = startTimer(setRemainingTime, handleFinish, currentPhase.countDown);
  }, [setRemainingTime, currentPhase.countDown, handleFinish]);

  const handleStop = useCallback(() => {
    stopTimerRef.current?.();

    handlePhaseUpdate(getNextPhase({ currentPhaseType: currentPhase.type, isStopped: true }));
  }, [currentPhase.type, handlePhaseUpdate]);

  return (
    <div>
      <p>{currentPhase.type}</p>
      <p>{remainingTime}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};
