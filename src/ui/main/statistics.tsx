import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { showStatistics } from '../../use-cases/show-statistics';

export const Statistics: React.FC = () => {
  const statistics = showStatistics();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(format(new Date(), 'HH:mm:ss')), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Current time: {currentTime}</p>
      {statistics.map((item) => (
        <p>
          {item.phaseType} - {format(item.startTime, 'HH:mm')}
        </p>
      ))}
    </div>
  );
};
