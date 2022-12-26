import { useStore } from 'effector-react';
import React, { useCallback } from 'react';
import {
  restTimeChanged,
  workTimeChanged,
  $restTimeConfig,
  $workTimeConfig,
} from '../../../connector';
import { useToggle } from '../../hooks/use-toggle';

import './styles.css';

export const PomodoroConfiguration: React.FC = () => {
  const work = useStore($workTimeConfig);
  const rest = useStore($restTimeConfig);

  const handleWorkTimeChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => workTimeChanged(+e.target.value),
    []
  );
  const handleRestTimeChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => restTimeChanged(+e.target.value),
    []
  );

  const [isVisible, handleToggle] = useToggle();

  return (
    <section className="configuration">
      <form className={`configuration__form--${isVisible ? 'visible' : 'hidden'}`}>
        <label className="configuration__field">
          <span>Work</span>
          <input type="number" value={work} onChange={handleWorkTimeChanged} />
        </label>
        <label className="configuration__field">
          <span>Rest</span>
          <input type="number" value={rest} onChange={handleRestTimeChanged} />
        </label>
      </form>
      <button className="configuration__toggler" onClick={handleToggle}>
        {isVisible ? '⇦' : '⇨'}
      </button>
    </section>
  );
};
