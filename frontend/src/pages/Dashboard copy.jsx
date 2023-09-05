import React, { useEffect, useRef } from "react";
import { DashboardLayoutComponent } from "@syncfusion/ej2-react-layouts";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { TiDelete } from "react-icons/ti"; // Import the react-icons for delete icon

export default function Dashboard() {
  useEffect(() => {
    updateSampleSection();
  }, []);
  const dashboardObj = useRef(null);
  const cellSpacing = [5, 5];
  let count = 8;

  const onCloseIconHandler = (event) => {
    let panel = event.target.closest(".e-panel");
    if (panel) {
      dashboardObj.current.removePanel(panel.id);
    }
  };

  const btnClick = () => {
    let panel = {
      id: `panel_${count}`,
      sizeX: 1,
      sizeY: 1,
      row: 0,
      col: 0,
      content: `
        <span class="e-close-icon e-clear-icon"></span>
        <div class="text-align">${count}</div>
      `,
    };

    dashboardObj.current.addPanel(panel);
    let closeIcon = document
      .getElementById(panel.id)
      .querySelector(".e-clear-icon");
    closeIcon.addEventListener("click", onCloseIconHandler);
    count++;
  };

  return (
    <div>
      <div id="default_target" className="control-section">
        <div className="addContainer">
          <ButtonComponent id="add" cssClass="e-info" onClick={btnClick}>
            Add Panel
          </ButtonComponent>
        </div>
        <DashboardLayoutComponent
          id="default_dashboard"
          columns={12} // 12-column layout
          ref={dashboardObj}
          cellSpacing={cellSpacing}
          allowResizing={true}
        >
          {/* ROW 1 */}
          <div
            id="one"
            className="e-panel"
            data-row="0"
            data-col="0"
            data-sizeX="3" // 1/4 width
            data-sizeY="1" // Same height as others
          >
            <span
              id="close"
              className="e-close-icon e-clear-icon"
              onClick={onCloseIconHandler}
            >
              <TiDelete />
            </span>
            <div className="e-panel-container">
              <div className="text-align">0</div>
            </div>
          </div>
          {/* ... repeat for other three boxes in row 1 ... */}

          {/* ROW 2 */}
          <div
            id="flight-data"
            className="e-panel"
            data-row="1"
            data-col="0"
            data-sizeX="7" // 7/12 width
            data-sizeY="2" // Same height as ARC Flysheets
          >
            <span
              id="close"
              className="e-close-icon e-clear-icon"
              onClick={onCloseIconHandler}
            >
              <TiDelete />
            </span>
            <div className="e-panel-container">
              {/* Content for Flight Data */}
            </div>
          </div>
          <div
            id="arc-flysheets"
            className="e-panel"
            data-row="1"
            data-col="7"
            data-sizeX="5" // 5/12 width
            data-sizeY="2" // Same height as Flight Data
          >
            <span
              id="close"
              className="e-close-icon e-clear-icon"
              onClick={onCloseIconHandler}
            >
              <TiDelete />
            </span>
            <div className="e-panel-container">
              {/* Content for ARC Flysheets */}
            </div>
          </div>

          {/* ROW 3 */}
          <div
            id="videos"
            className="e-panel"
            data-row="2"
            data-col="0"
            data-sizeX="4" // 1/3 width
            data-sizeY="1" // Equal dimensions
          >
            <span
              id="close"
              className="e-close-icon e-clear-icon"
              onClick={onCloseIconHandler}
            >
              <TiDelete />
            </span>
            <div className="e-panel-container">{/* Content for Videos */}</div>
          </div>
          <div
            id="space-news"
            className="e-panel"
            data-row="2"
            data-col="4"
            data-sizeX="4" // 1/3 width
            data-sizeY="1" // Equal dimensions
          >
            <span
              id="close"
              className="e-close-icon e-clear-icon"
              onClick={onCloseIconHandler}
            >
              <TiDelete />
            </span>
            <div className="e-panel-container">
              {/* Content for Space News */}
            </div>
          </div>
          <div
            id="weather-data"
            className="e-panel"
            data-row="2"
            data-col="8"
            data-sizeX="4" // 1/3 width
            data-sizeY="1" // Equal dimensions
          >
            <span
              id="close"
              className="e-close-icon e-clear-icon"
              onClick={onCloseIconHandler}
            >
              <TiDelete />
            </span>
            <div className="e-panel-container">
              {/* Content for Weather Data */}
            </div>
          </div>
        </DashboardLayoutComponent>
      </div>
    </div>
  );
}
