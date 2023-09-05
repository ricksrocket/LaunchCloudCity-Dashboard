import React, { useEffect, useRef } from "react";
import { DashboardLayoutComponent } from "@syncfusion/ej2-react-layouts";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { MdClose } from "react-icons/md"; // Import react-icons

export default function DashboardFusion() {
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
    let panel = [
      {
        id: `${count}_layout`,
        sizeX: 1,
        sizeY: 1,
        row: 0,
        col: 0,
        content: `
          <span class="e-close-icon e-clear-icon"></span>
          <div class="text-align">${count}</div>
        `,
      },
    ];
    dashboardObj.current.addPanel(panel[0]);
    let closeIcon = document
      .getElementById(`${count}_layout`)
      .querySelector(".e-clear-icon");
    closeIcon.addEventListener("click", onCloseIconHandler.bind(this));
    count = count + 1;
  };

  useEffect(() => {
    const closeIcons = document.querySelectorAll(".e-clear-icon");
    closeIcons.forEach((icon) => {
      icon.addEventListener("click", onCloseIconHandler);
    });
  }, []);

  return (
    <div>
      <div id="default_target" className="control-section">
        <div className="addContainer">
          <ButtonComponent
            id="add"
            cssClass="e-info"
            onClick={btnClick}
          >
            Add Panel
          </ButtonComponent>
        </div>
        <DashboardLayoutComponent
          id="default_dashboard"
          columns={5}
          ref={dashboardObj}
          cellSpacing={cellSpacing}
          allowResizing={true}
        >
          {/* Your panels */}
        </DashboardLayoutComponent>
      </div>
    </div>
  );
}
