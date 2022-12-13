import { useState, useCallback } from 'react';

export const useToggle = (): [boolean, () => void] => {
  const [isVisible, setVisibility] = useState(false);
  const handleToggle = useCallback(() => {
    setVisibility((isVisible) => !isVisible);
  }, [setVisibility]);

  return [isVisible, handleToggle];
};
