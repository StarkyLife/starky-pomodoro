import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { $statistics } from '../../../connector';
import { useToggle } from '../../hooks/use-toggle';

import './styles.css';

export const Statistics: React.FC = () => {
  const statistics = useStore($statistics);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(format(new Date(), 'HH:mm')), 1000);
    return () => clearInterval(interval);
  }, []);

  const [isVisible, handleToggle] = useToggle();

  return (
    <section className="statistics">
      <div className={`statistics__content--${isVisible ? 'visible' : 'hidden'}`}>
        <div className="timeline">
          <div className="timeline__point" style={{ left: '50%' }}>
            <span>{currentTime}</span>
          </div>
        </div>
        {statistics.map((item) => (
          <p key={item.startTime.getTime()}>
            {item.phaseType} - {format(item.startTime, 'HH:mm')}
          </p>
        ))}
      </div>
      <button className="statistics__toggler" onClick={handleToggle}>
        {isVisible ? '⇧' : '⇩'}
      </button>
    </section>
  );
};
