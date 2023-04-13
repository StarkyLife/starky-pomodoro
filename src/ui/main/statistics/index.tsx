import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, startOfDay, differenceInMinutes } from 'date-fns';
import { useStore } from 'effector-react';
import { $statistics } from '../../../connector';
import { ExpandableBlock } from '../../base/expandable-block';

import './styles.css';

const getFullHoursPosition = (hour: number) => (100 / 24) * hour;
const getMinutesPosition = (minutes: number) => (100 / 1440) * minutes;

const fullHoursView = pipe(
  A.makeBy(23, (i) => i + 1),
  A.map((hour) => ({
    timeText: `${hour < 10 ? '0' + hour : hour}:00`,
    position: getFullHoursPosition(hour),
  }))
);

export const Statistics: React.FC = () => {
  const statistics = useStore($statistics);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startOfDayCache = useMemo(() => startOfDay(currentTime), [currentTime]);

  const getDayMinutesFor = useCallback(
    (date: Date) => differenceInMinutes(date, startOfDayCache),
    [startOfDayCache]
  );

  const currentTimeMinutes = useMemo(
    () => getDayMinutesFor(currentTime),
    [currentTime, getDayMinutesFor]
  );

  const statisticsView = useMemo(
    () =>
      pipe(
        statistics,
        A.filterMap((s) =>
          pipe(
            s.endTime,
            O.map((endTime) => ({
              className: `timeline__block--${s.phaseType === 'work' ? 'primary' : 'secondary'}`,
              start: getMinutesPosition(getDayMinutesFor(s.startTime)),
              end: getMinutesPosition(getDayMinutesFor(endTime)),
            }))
          )
        )
      ),
    [statistics, getDayMinutesFor]
  );

  return (
    <section className="statistics">
      <ExpandableBlock direction="top-bottom">
        <div className="statistics__content">
          <div className="timeline">
            {fullHoursView.map(({ timeText, position }) => (
              <div
                key={`full-hour-${timeText}`}
                className="timeline__point"
                style={{ left: `${position}%` }}
              >
                <span>{timeText}</span>
              </div>
            ))}
            {statisticsView.map(({ className, start, end }) => (
              <div
                key={`stats-${start}-${end}`}
                className={className}
                style={{ left: `${start}%`, width: `${end - start}%` }}
              ></div>
            ))}
            <div
              className="timeline__block"
              style={{ left: `${getMinutesPosition(currentTimeMinutes)}%`, width: `1px` }}
            >
              <span>{format(currentTime, 'HH:mm')}</span>
            </div>
          </div>
        </div>
      </ExpandableBlock>
    </section>
  );
};
