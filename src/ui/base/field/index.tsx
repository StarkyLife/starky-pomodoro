import React, { PropsWithChildren } from 'react';

import './styles.css';

type Props = {
  className?: string;
  text: string | React.ReactNode;
} & PropsWithChildren;

export const Field: React.FC<Props> = ({ className, text, children }) => (
  <label className={`field ${className ?? ''}`}>
    {typeof text === 'string' ? <span>{text}</span> : text}
    {children}
  </label>
);
