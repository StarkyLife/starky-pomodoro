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
import { getTimeText } from '../../utils/time';

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

  const handleFinish = useCallback(() => {
    stopTimerRef.current = undefined;
    pomodoroPhaseFinished();
  }, []);

  const handleClick = useCallback(() => {
    if (stopTimerRef.current) {
      stopTimerRef.current();
      stopTimerRef.current = undefined;
      pomodoroPhaseStopped();
    } else {
      stopTimerRef.current = startTimer(
        setRemainingTime,
        handleFinish,
        currentPhase.countDown,
      );
      pomodoroPhaseStarted();
    }
  }, [setRemainingTime, currentPhase.countDown, handleFinish]);

  const { minutes, seconds } = getTimeText(remainingTime);

  return (
    <button className="timer" onClick={handleClick}>
      <div>{currentPhase.type}</div>
      <div>{minutes}:{seconds}</div>
    </button>
  );
};
