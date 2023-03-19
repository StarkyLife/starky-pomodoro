import React, { useCallback } from 'react';

import './styles.css';

type Props = {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string | number;
  onChange?: (value: string) => void;
};

export const Input: React.FC<Props> = ({ className, type, value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value),
    [onChange]
  );

  return (
    <input
      className={`input ${className ?? ''}`}
      type={type}
      value={value}
      onChange={handleChange}
    />
  );
};
