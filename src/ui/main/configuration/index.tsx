import { useStore } from 'effector-react';
import React, { useCallback } from 'react';
import {
  restTimeChanged,
  workTimeChanged,
  $restTimeConfig,
  $workTimeConfig,
} from '../../../connector';
import { ExpandableBlock } from '../../base/expadable-block';
import { Field } from '../../base/field';
import { Input } from '../../base/input';

import './styles.css';

export const PomodoroConfiguration: React.FC = () => {
  const work = useStore($workTimeConfig);
  const rest = useStore($restTimeConfig);

  const handleWorkTimeChanged = useCallback((value: string) => workTimeChanged(+value), []);
  const handleRestTimeChanged = useCallback((value: string) => restTimeChanged(+value), []);

  return (
    <section className="configuration">
      <ExpandableBlock direction="left-right">
        <form className="configuration__form">
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
      </ExpandableBlock>
    </section>
  );
};
