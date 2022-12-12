import { useStore } from 'effector-react';
import React, { useCallback } from 'react';
import {
  restTimeChanged,
  workTimeChanged,
  $restTimeConfig,
  $workTimeConfig,
} from '../../connector';

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

  return (
    <form>
      <label>
        Work time
        <input name="workTime" value={work} onChange={handleWorkTimeChanged} />
      </label>
      <label>
        Rest time
        <input name="restTime" value={rest} onChange={handleRestTimeChanged} />
      </label>
    </form>
  );
};
