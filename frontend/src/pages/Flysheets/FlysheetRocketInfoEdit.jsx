// FlysheetRocketInfoAdd.jsx
// React Imports
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// import Button from "react-bootstrap/Button";
import Button from "../../components/Button"; // Import your Button component
import { useStateContext } from "../../contexts/ContextProvider"; // Import the context
import { getParachutes } from "../../services/servParachutes";

import FlysheetContext from "../../contexts/FlysheetContext";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlysheetState((prevFlysheetState) => ({
      ...prevFlysheetState,
      [name]: value,
      preFlight: {
        ...prevFlysheetState.preFlight,
        rocketInformation: {
          ...prevFlysheetState.preFlight.rocketInformation,
          [name]: value,
        },
      },
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    console.log("flysheetState:", flysheetState);
    // Navigate to the next page
    navigate(`/flysheets/weather/edit/${id}`);
  };

  return (
    <div className="ml-5">
      <p className="text-xl font-bold mb-4">
        <span className="mr-2">Edit Flysheet: Step 1 - </span>
        <span className="ml-2">Pre-Flight Rocket Information</span>
      </p>

      <Form onSubmit={handleAdd}>
        <label
          className="font-semibold text-sm dark:text-gray-200"
          htmlFor="date"
        >
          Flight Number
        </label>

        <div className="mb-3 border-t-1 border-gray-400">
          <Form.Group controlId="flightNumber">
            {/* <Form.Label className="bold-label">Flight Number</Form.Label> */}
            <Form.Control
              type="number"
              name="flightNumber"
              value={flysheetState.flightNumber}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="date"
          >
            Motor Used
          </label>
          <Form.Group controlId="motorUsed">
            {/* <Form.Label className="bold-label">Motor Used</Form.Label> */}
            <Form.Control
              type="text"
              name="motorUsed"
              value={flysheetState.preFlight.rocketInformation.motorUsed}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="date"
          >
            Motor Serial Number
          </label>
          <Form.Group controlId="motorSerialNumber">
            {/* <Form.Label className="bold-label">Motor Serial Number</Form.Label> */}
            <Form.Control
              type="text"
              name="motorSerialNumber"
              value={
                flysheetState.preFlight.rocketInformation.motorSerialNumber
              }
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="date"
          >
            Liftoff Mass
          </label>
          <Form.Group controlId="liftoffMass">
            {/* <Form.Label className="bold-label">Liftoff Mass</Form.Label> */}
            <Form.Control
              type="number"
              name="liftoffMass"
              value={flysheetState.preFlight.rocketInformation.liftoffMass}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="date"
          >
            Parachute Area (in²): {parachutes.length} Choices Available
          </label>
          <Form.Group controlId="parachuteAreaBooster">
            {/* <Form.Label className="bold-label">
              Parachute Area (in²): {parachutes.length} Choices Available
            </Form.Label> */}
            <Form.Control
              as="select"
              name="parachuteAreaBooster"
              value={
                flysheetState.preFlight.rocketInformation
                  .parachuteAreaBooster || ""
              }
              onChange={handleChange}
              defaultValue="" // Set the default value to an empty string
            >
              <option value="">None</option>{" "}
              {/* Add this option to select none */}
              {parachutes.map((parachute, _id) => (
                <option key={_id} value={parachute.area}>
                  {parachute.area} - {parachute.shape}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="date"
          >
            Target Apogee
          </label>
          <Form.Group controlId="targetApogee">
            {/* <Form.Label className="bold-label">Target Apogee</Form.Label> */}
            <Form.Control
              type="number"
              name="targetApogee"
              value={flysheetState.preFlight.rocketInformation.targetApogee}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-b-1 pb-4 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="date"
          >
            Static Stability Margin
          </label>
          <Form.Group controlId="staticStabilityMargin">
            {/* <Form.Label className="bold-label">
              Static Stability Margin
            </Form.Label> */}
            <Form.Control
              type="number"
              name="staticStabilityMargin"
              value={
                flysheetState.preFlight.rocketInformation.staticStabilityMargin
              }
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        {/* <Row className="justify-content-between">
          <Col xs={5} md={3}>
            <Link to="/flysheets">
              <Button variant="primary" style={{ width: "100%" }}>
                Back-Flysheet List
              </Button>
            </Link>
          </Col>

          <Col xs={5} md={3}>
            <Button type="submit" variant="primary" style={{ width: "100%" }}>
              Next - Edit Weather
            </Button>
          </Col>
        </Row> */}
        <div className="mb-3 mr-5 flex justify-between">
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
            content="Next - Edit Weather"
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
      </Form>
    </div>
  );
}
