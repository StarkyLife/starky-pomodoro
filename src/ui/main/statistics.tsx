import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { $statistics } from '../../connector';

export const Statistics: React.FC = () => {
  const statistics = useStore($statistics);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(format(new Date(), 'HH:mm')), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Current time: {currentTime}</p>
      {statistics.map((item) => (
        <p key={item.startTime.getTime()}>
          {item.phaseType} - {format(item.startTime, 'HH:mm')}
        </p>
      ))}
    </div>
  );
};
