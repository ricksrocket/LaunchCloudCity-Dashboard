import React, { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { BsCheck } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';

import { themeColors } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const ThemeSettings = () => {
  const {
    setColor,
    setMode,
    currentMode,
    currentColor,
    setThemeSettings,
  } = useStateContext();

  const [pickerColor, setPickerColor] = useState(currentColor);

  const handleColorChange = (args) => {
    setPickerColor(args.currentValue.hex);
  };

  return (
<div className="bg-half-transparent w-screen fixed nav-item top-0 right-0">
      <div className="float-right h-screen dark:text-gray-200 bg-white dark:bg-[#484B52] w-400">
        {/* ... (existing code) */}
        <div className="p-4 border-t-1 border-color ml-4">
          <p className="font-semibold text-xl">Theme Colors</p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              {/* ... (existing color circles buttons) */}
            </div>
            <TooltipComponent content="Custom Color" position="TopCenter">
              <div className="relative mt-2 cursor-pointer flex gap-5 items-center">
                <button
                  type="button"
                  className="h-10 w-10 rounded-full cursor-pointer"
                  style={{ backgroundColor: pickerColor }}
                  onClick={() => {
                    setColor(pickerColor);
                    setThemeSettings(false);
                  }}
                >
                  <BsCheck className="ml-2 text-2xl text-white" />
                </button>
                <ColorPickerComponent
                  id="custom-color-picker"
                  mode="Palette"
                  modeSwitcher={false}
                  inline
                  showButtons={false}
                  value={pickerColor}
                  change={handleColorChange}
                />
              </div>
            </TooltipComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
