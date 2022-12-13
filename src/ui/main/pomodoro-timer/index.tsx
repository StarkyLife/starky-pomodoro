import * as O from 'fp-ts/Option';
import { useStore } from 'effector-react';
import React, { useCallback, useEffect } from 'react';
import {
  pomodoroInitialized,
  timerClicked,
  $pomodoroPhase,
  $remainingTime,
} from '../../../connector';
import { getTimeText } from '../../../utils/time';
import { PomodoroPhase } from '../../../core/types/pomodoro';

import './styles.css';

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
  const remainingTime = useStore($remainingTime);

  const handleClick = useCallback(() => {
    timerClicked();
  }, []);

  const { minutes, seconds } = getTimeText(remainingTime);

  return (
    <button className="timer" onClick={handleClick}>
      <div>{currentPhase.type}</div>
      <div>
        {minutes}:{seconds}
      </div>
    </button>
  );
};
