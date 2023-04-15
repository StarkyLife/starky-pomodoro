import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { cn, createBEM } from '../../utils/classnames';

import './styles.css';

const blockBEM = createBEM('expandable-block');
const contentBEM = createBEM('expandable-block__content');
const buttonBEM = createBEM('expandable-block__button');

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
    <section className={cn(blockBEM(direction), className)}>
      <div className={contentBEM(isVisible ? 'visible' : 'hidden')}>{children}</div>
      <button
        data-testid="expandable-block-toggler"
        className={buttonBEM(direction)}
        onClick={handleToggle}
      >
        {isVisible ? arrow.visible : arrow.hidden}
      </button>
    </section>
  );
};
