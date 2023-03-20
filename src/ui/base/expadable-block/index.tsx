import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import './styles.css';

type Direction = 'top-bottom' | 'left-right';

type Props = {
  className?: string;
  direction: Direction;
} & PropsWithChildren;

const directionArrows: Record<Direction, { visible: string; hidden: string }> = {
  'top-bottom': { visible: '⇧', hidden: '⇩' },
  'left-right': { visible: '⇦', hidden: '⇨' },
};

export const ExpandableBlock: React.FC<Props> = ({ className, direction, children }) => {
  const [isVisible, setVisibility] = useState(false);
  const handleToggle = useCallback(() => {
    setVisibility((isVisible) => !isVisible);
  }, [setVisibility]);

  const arrow = useMemo(() => directionArrows[direction], [direction]);

  return (
    <section className={`expandable-block expandable-block--${direction} ${className ?? ''}`}>
      <div
        className={`expandable-block__content expandable-block__content--${
          isVisible ? 'visible' : 'hidden'
        }`}
      >
        {children}
      </div>
      <button
        className={`expandable-block__button expandable-block__button--${direction}`}
        onClick={handleToggle}
      >
        {isVisible ? arrow.visible : arrow.hidden}
      </button>
    </section>
  );
};
