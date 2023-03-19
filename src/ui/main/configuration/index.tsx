import { useStore } from 'effector-react';
import React, { useCallback } from 'react';
import {
  restTimeChanged,
  workTimeChanged,
  $restTimeConfig,
  $workTimeConfig,
} from '../../../connector';
import { Field } from '../../base/field';
import { Input } from '../../base/input';
import { useToggle } from '../../hooks/use-toggle';

import './styles.css';

export const PomodoroConfiguration: React.FC = () => {
  const work = useStore($workTimeConfig);
  const rest = useStore($restTimeConfig);

  const handleWorkTimeChanged = useCallback((value: string) => workTimeChanged(+value), []);
  const handleRestTimeChanged = useCallback((value: string) => restTimeChanged(+value), []);

  const [isVisible, handleToggle] = useToggle();

  return (
    <section className="configuration">
      <form className={`configuration__form--${isVisible ? 'visible' : 'hidden'}`}>
        <Field text="Work">
          <Input
            className="configuration__input"
            type="number"
            value={work}
            onChange={handleWorkTimeChanged}
          />
        </Field>
        <Field text="Rest">
          <Input
            className="configuration__input"
            type="number"
            value={rest}
            onChange={handleRestTimeChanged}
          />
        </Field>
      </form>
      <button className="configuration__toggler" onClick={handleToggle}>
        {isVisible ? '⇦' : '⇨'}
      </button>
    </section>
  );
};
