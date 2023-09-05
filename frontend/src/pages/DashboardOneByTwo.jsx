import { DashboardLayoutComponent } from '@syncfusion/ej2-react-layouts';
import React from 'react';

const App = () => {
  const cellSpacing = [5, 5];

  return (
    <div>
      <div className="control-section">
        <DashboardLayoutComponent
          id="defaultLayout"
          cellSpacing={cellSpacing}
          allowResizing={true}
          columns={5}
        >
          <div
            id="one"
            className="e-panel"
            data-row="0"
            data-col="0"
            data-sizex="1"
            data-sizey="1"
          >
            <span id="close" className="e-template-icon e-clear-icon" />
            <div className="e-panel-container">
              <div className="text-align">0</div>
            </div>
          </div>
          <div
            id="two"
            className="e-panel"
            data-row="1"
            data-col="0"
            data-sizex="1"
            data-sizey="2"
          >
            <span id="close" className="e-template-icon e-clear-icon" />
            <div className="e-panel-container">
              <div className="text-align">1</div>
            </div>
          </div>
        </DashboardLayoutComponent>
      </div>
    </div>
  );
};

export default App;
