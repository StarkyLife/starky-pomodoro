import React from 'react';

import { Pomodoro } from './ui/main/pomodoro-timer';
import { PomodoroConfiguration } from './ui/main/configuration';

import './app.css';

export const App: React.FC = () => (
  <main>
    <section className="statistics">
      <button className="statistics__toggler">⇩</button>
    </section>

    <PomodoroConfiguration />

    <section className="pomodoro">
      <Pomodoro />
    </section>
  </main>
);
