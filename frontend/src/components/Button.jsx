// Button.jsx 
import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({ icon, bgColor, color, bgHoverColor, size, text, borderRadius, width }) => {
  const { setIsClicked, initialState } = useStateContext();

  // Use template literals and ${} for dynamic class names
  const buttonClasses = `text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`;
  const buttonClasses1 = `text-${size} py-2 px-4 md:py-1 md:px-2 w-${width} md:w-auto hover:drop-shadow-xl hover:bg-${bgHoverColor}`;


  return (
    <button
      type='button'
      onClick={() => setIsClicked(initialState)}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={buttonClasses}
    >
      {icon} {text}
    </button>
  );
};

// Button.propTypes = {
//   icon: PropTypes.node,
//   bgColor: PropTypes.string,
//   color: PropTypes.string,
//   bgHoverColor: PropTypes.string,
//   size: PropTypes.string,
//   text: PropTypes.string,
//   borderRadius: PropTypes.string,
//   width: PropTypes.string,
//   type: PropTypes.oneOf(['button', 'submit', 'reset']), // Specify the allowed types
// };

export default Button;
