import {
  DashboardLayoutComponent,
  PanelDirective,
  PanelsDirective,
} from "@syncfusion/ej2-react-layouts";
import React from "react";

const App = () => {
  const cellSpacing = [20, 20];

  return (
    <div className="ml-5 mr-5" style={{ height: "100vh" }}>
      <p className="text-xl font-bold mb-4">
        <span className="mr-2">DASHBOARD</span>
        <br></br>
        <span className="ml-2">
          Welcome to the Maharishi School Rocketry Team Dashboard
        </span>
      </p>
      <div className="control-section">
        <DashboardLayoutComponent
          id="analytic_dashboard"
          cellAspectRatio={1 / 2}
          cellSpacing={cellSpacing}
          columns={12}
        >
          <PanelsDirective>
            {/* Row 1 */}
            <PanelDirective
              sizeX={3}
              sizeY={1}
              row={0}
              col={0}
              // content={card1}
              header="<div>NASA STEM Contacts
              </div>"
            ></PanelDirective>

            <PanelDirective
              sizeX={3}
              sizeY={1}
              row={0}
              col={3}
              // content={card2}
              header="<div>Number of Test Flights
              </div>"
            ></PanelDirective>

            <PanelDirective
              sizeX={3}
              sizeY={1}
              row={0}
              col={6}
              // content={card3}
              header="<div>ARC Funds Raised</div>"
            ></PanelDirective>

            <PanelDirective
              sizeX={3}
              sizeY={1}
              row={0}
              col={9}
              // content={card4}
              header="<div> NASA SLA Funds Raised</div>"
            ></PanelDirective>

            {/* Row 2 */}

            <PanelDirective
              sizeX={7}
              sizeY={2}
              row={1}
              col={0}
              // content={pie.bind(this)}
              header="<div>Flight Data</div>"
            ></PanelDirective>
            <PanelDirective
              sizeX={5}
              sizeY={2}
              row={1}
              col={7}
              // content={map.bind(this)}
              header="<div>ARC Flysheets</div>"
            ></PanelDirective>

            {/* Row 3 */}

            <PanelDirective
              sizeX={4}
              sizeY={2}
              row={3}
              col={0}
              // content={pieChart.bind(this)}
              header="<div>Videos</div>"
            ></PanelDirective>
            <PanelDirective
              sizeX={4}
              sizeY={2}
              row={3}
              col={4}
              // content={visitorsChart.bind(this)}
              header="<div>Space News</div>"
            ></PanelDirective>
            <PanelDirective
              sizeX={4}
              sizeY={2}
              row={3}
              col={8}
              // content={visitorsChart.bind(this)}
              header="<div>Weather Data</div>"
            ></PanelDirective>
          </PanelsDirective>
        </DashboardLayoutComponent>
      </div>
    </div>
  );
};

export default App;
