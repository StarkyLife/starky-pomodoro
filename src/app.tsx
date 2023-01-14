import React from 'react';

import { Pomodoro } from './ui/main/pomodoro-timer';
import { PomodoroConfiguration } from './ui/main/configuration';
import { Statistics } from './ui/main/statistics';

import './app.css';

export const App: React.FC = () => (
  <main>
    <Statistics />

    <PomodoroConfiguration />

    <section className="pomodoro">
      <Pomodoro />
    </section>
  </main>
);
