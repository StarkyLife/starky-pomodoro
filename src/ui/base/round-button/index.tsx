import React from 'react';

import './styles.css';

type Props = React.PropsWithChildren & {
  onClick?: () => void;
};

export const RoundButton: React.FC<Props> = ({ children, onClick }) => (
  <button className="round-button" onClick={onClick}>
    {children}
  </button>
);
