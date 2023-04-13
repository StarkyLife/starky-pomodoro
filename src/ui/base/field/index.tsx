import React, { PropsWithChildren } from 'react';
import { cn } from '../../utils/classnames';

import './styles.css';

type Props = {
  className?: string;
  text: string | React.ReactNode;
} & PropsWithChildren;

export const Field: React.FC<Props> = ({ className, text, children }) => (
  <label className={cn('field', className)}>
    {typeof text === 'string' ? <span>{text}</span> : text}
    {children}
  </label>
);
