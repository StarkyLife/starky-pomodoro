import React from 'react';
import { Pomodoro } from './ui/main/pomodoro';
import { Statistics } from './ui/main/statistics';

export const App: React.FC = () => (
  <div>
    <div>Hello Pomodoro</div>
    <Pomodoro />
    <Statistics />
  </div>
);
