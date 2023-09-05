// FlysheetRocketInfoAdd.jsx

import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// import Button from "react-bootstrap/Button";
import Button from "../../components/Button"; // Import your Button component
import { useStateContext } from "../../contexts/ContextProvider"; // Import the context
import { getParachutes } from "../../services/servParachutes";

import FlysheetContext from "../../contexts/FlysheetContext";
import { Row, Col } from "react-bootstrap";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

export default function FlysheetRocketInfoAdd() {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const { id } = useParams(); // extract the _id from the URL params
  console.log("id:", id);

  const [parachutes, setParachutes] = useState([]);
  const { flysheetState, setFlysheetState, flysheets, setFlysheets } =
    useContext(FlysheetContext);

  console.log("flysheets", flysheets);

  // load parachute from database when component is loaded
  useEffect(() => {
    // check local storage for 'flysheetState', if present delete it
    const storedFlysheetState = localStorage.getItem("flysheetState");
    if (storedFlysheetState) {
      localStorage.removeItem("flysheetState");
    }
    // Fetch parachutes from the server using the getParachutes service
    getParachutes()
      .then((response) => {
        if (response.success) {
          setParachutes(response.data);
        }
        console.log(response.data);
      })
      .catch((error) => {
        console.error("An error occurred while fetching the data.", error);
      });
  }, []);

  useEffect(() => {
    const storedFlysheetState = localStorage.getItem("flysheetState");

    if (storedFlysheetState) {
      const parsedStoredState = JSON.parse(storedFlysheetState);

      // Check if the states are different
      if (JSON.stringify(parsedStoredState) !== JSON.stringify(flysheetState)) {
        setFlysheetState(parsedStoredState);
      }
    } else {
      const flysheet = flysheets.find((flysheet) => flysheet._id === id);
      if (flysheet) {
        setFlysheetState(flysheet);
      }
    }
  }, [flysheets, id]);

  // Another useEffect to handle saving to localStorage when flysheetState changes
  useEffect(() => {
    localStorage.setItem("flysheetState", JSON.stringify(flysheetState));
  }, [flysheetState]);

  const handleChange = (args) => {
    let name, value;
    // if args.itemData? console.log("yes") otherwise console.log("no")
    if (args.itemData) {
      name = args.itemData.name;
      value = args.itemData.value;
    } else{
      name = args.event.target.name;
      value = args.event.target.value;
    }
   

    setFlysheetState((prevFlysheetState) => ({
      ...prevFlysheetState,
      preFlight: {
        ...prevFlysheetState.preFlight,
        rocketInformation: {
          ...prevFlysheetState.preFlight.rocketInformation,
          [name]: value,
        },
      },
    }));
  };

  const handleSelect = (args) => {
    const selectedValue = args.itemData; // Use 'args.itemData' to access the selected value

    setFlysheetState((prevFlysheetState) => ({
      ...prevFlysheetState,
      preFlight: {
        ...prevFlysheetState.preFlight,
        rocketInformation: {
          ...prevFlysheetState.preFlight.rocketInformation,
          parachuteAreaBooster: selectedValue,
        },
      },
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/flysheets/weather/add");
  };

  return (
    <div className="ml-5">
      <p className="text-xl font-bold mb-4">
        <span className="mr-2">Add Flysheet: Step 1 - </span>
        <span className="ml-2">Pre-Flight Rocket Information</span>
      </p>
      <form onSubmit={handleNext} className="mt-6">

        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="flightNumber"
          >
            Flight Number
          </label>
          <TextBoxComponent
            type="number"
            name="flightNumber"
            id="flightNumber"
            value={flysheetState.flightNumber}
            // placeholder="Enter Flight Number"
            floatLabelType="Auto"
            change={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="motorSerialNumber"
          >
            Motor Used
          </label>
          <TextBoxComponent
            type="text"
            name="motorUsed"
            id="motorUsed"
            value={flysheetState.preFlight.rocketInformation.motorUsed}
            // placeholder="motor used"
            floatLabelType="Auto"
            change={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="motorSerialNumber"
          >
            Motor Serial Number
          </label>
          <TextBoxComponent
            type="text"
            name="motorSerialNumber"
            id="motorSerialNumber"
            value={flysheetState.preFlight.rocketInformation.motorSerialNumber}
            // placeholder="Serial Number"
            floatLabelType="Auto"
            change={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="targetApogee"
          >
            Liftoff Mass
          </label>
          <TextBoxComponent
            type="number"
            name="liftoffMass"
            id="liftoffMass"
            value={flysheetState.preFlight.rocketInformation.liftoffMass}
            // placeholder="Liftoff Mass"
            floatLabelType="Auto"
            change={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="parachuteAreaBooster"
          >
            Parachute Area - {`${parachutes.length} Choices Available`}
          </label>
          <DropDownListComponent
            required
            dataSource={parachutes.map((parachute) => ({
              text: `${parachute.area} - ${parachute.shape}`,
              value: parachute.area, // Include the area property
              name: "parachuteAreaBooster",
            }))}
            fields={{text: "text", value: "value"}}
            change={handleChange} // Use the correct event handler
            id="parachuteAreaBooster"
            value={
              flysheetState.preFlight.rocketInformation.parachuteAreaBooster
            }
          />
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="targetApogee"
          >
            Target Apogee
          </label>
          <TextBoxComponent
            type="number"
            name="targetApogee"
            id="targetApogee"
            value={flysheetState.preFlight.rocketInformation.targetApogee}
            // placeholder="Target Apogee"
            floatLabelType="Auto"
            change={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="staticStabilityMargin"
          >
            Static Stability Margin
          </label>
          <TextBoxComponent
            type="number"
            name="staticStabilityMargin"
            id="staticStabilityMargin"
            value={
              flysheetState.preFlight.rocketInformation.staticStabilityMargin
            }
            // placeholder="Target Apogee"
            floatLabelType="Auto"
            change={handleChange}
            required
          />
        </div>
        <div className="mb-3 flex justify-between">
          <Link to="/flysheets">
            <Button
              color="white"
              bgColor={currentColor}
              text="Back-Flysheet List"
              borderRadius="10px"
              width="1/3"
            />
          </Link>

          {/* <button type="submit">
              <Button
                color="white"
                bgColor={currentColor}
                text="Next - Edit Weather"
                borderRadius="10px"
                width="1/3"
              />
            </button> */}
          <ButtonComponent // Use Syncfusion ButtonComponent here
            content="Next - Add Weather"
            type="submit" // Set the type to "submit"
            style={{
              // style text color white
              color: "white",
              borderRadius: "10px",
              width: "1/3",
              backgroundColor: currentColor,
            }}
          />
        </div>
      </form>
    </div>
  );
}
