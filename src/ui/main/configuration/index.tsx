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
    [],
  );
  const handleRestTimeChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => restTimeChanged(+e.target.value),
    [],
  );

  const [isVisible, handleToggle] = useToggle();

  return (
    <section className="configuration">
      <form className={`configuration__form--${isVisible ? 'visible' : 'hidden'}`}>
        <div className="configuration__field">
          <label>Work</label>
          <input type="number" value={work} onChange={handleWorkTimeChanged} />
        </div>
        <div className="configuration__field">
          <label>Rest</label>
          <input type="number" value={rest} onChange={handleRestTimeChanged} />
        </div>
      </form>
      <button className="configuration__toggler" onClick={handleToggle}>
        {isVisible ? '⇦' : '⇨'}
      </button>
    </section>
  );
};
