import React from 'react';

import { Pomodoro } from './ui/main/pomodoro';

import './app.css';

export const App: React.FC = () => (
  <main>
    <section className="statistics">
      <button className="statistics__toggler">⇩</button>
    </section>

    <section className="configuration">
      <form className="configuration__form--hidden">
        <label>
          Work
          <input type="number" value="25" />
        </label>
        <label>
          Rest
          <input type="number" value="5" />
        </label>
      </form>
      <button className="configuration__toggler">→</button>
    </section>

    <section className="pomodoro">
      <Pomodoro />
    </section>
  </main>
);
