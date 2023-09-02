// Button.jsx 
import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({ icon, bgColor, color, bgHoverColor, size, text, borderRadius, width }) => {
  const { setIsClicked, initialState } = useStateContext();

  // Use template literals and ${} for dynamic class names
  const buttonClasses = `text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`;

  return (
    <button
      type="button"
      onClick={() => setIsClicked(initialState)}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={buttonClasses}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
