import React, { PropsWithChildren } from 'react';
import { cn } from '../../utils/classnames';

import './styles.css';

type Props = { className?: string } & PropsWithChildren;

export const Form: React.FC<Props> = ({ className, children }) => (
  <form className={cn('form', className)} data-testid="form">
    {children}
  </form>
);
