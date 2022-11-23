import React from 'react';
import { PomodoroConfiguration } from './ui/main/configuration';
import { Pomodoro } from './ui/main/pomodoro';
import { Statistics } from './ui/main/statistics';

export const App: React.FC = () => (
  <div>
    <div>Hello Pomodoro</div>
    <PomodoroConfiguration />
    <Pomodoro />
    <Statistics />
  </div>
);
