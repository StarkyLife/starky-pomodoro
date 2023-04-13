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
import { RoundButton } from '../../base/round-button';

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
    <RoundButton onClick={handleClick}>
      <div className="timer-text">{currentPhase.type}</div>
      <div className="timer-text">
        {minutes}:{seconds}
      </div>
    </RoundButton>
  );
};
