// FlysheetLaunchAdd.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

// import Button from "react-bootstrap/Button";

import FlysheetContext from "../../contexts/FlysheetContext";
import { createFlysheet } from "../../services/servFlysheets";

// import Button from "react-bootstrap/Button";
import Button from "../../components/Button"; // Import your Button component
import { useStateContext } from "../../contexts/ContextProvider"; // Import the context

export default function FlysheetLaunchAdd() {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();

  const { flysheetState, setFlysheetState } = useContext(FlysheetContext);

  useEffect(() => {
    // Get User object from local storage
    const user = JSON.parse(localStorage.getItem("User"));
    console.log("user:", user.team);
    // Add the teamId to the flysheetState
    setFlysheetState((prevFlysheetState) => {
      return {
        ...prevFlysheetState,
        teamId: user.team,
      };
    });
  }, []);

  useEffect(() => {
    console.log("flysheetState:", flysheetState);
    localStorage.setItem("flysheetState", JSON.stringify(flysheetState));
  }, [flysheetState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlysheetState((prevFlysheetState) => {
      return {
        ...prevFlysheetState,
        [name]: value,
        preFlight: {
          ...prevFlysheetState.preFlight,
          launchInformation: {
            ...prevFlysheetState.preFlight.launchInformation,
            [name]: value,
          },
        },
        postFlight: {
          ...prevFlysheetState.postFlight,
          [name]: value,
        },
      };
    });
  };

  const handleChangeContestAltimeterApogee = (e) => {
    const { name, value } = e.target;
    setFlysheetState((prevFlysheetState) => {
      // Calculate altitudeScore using the current value from event target
      const contestAltimeterApogee = parseFloat(value) || 0;
      const targetApogee =
        parseFloat(
          prevFlysheetState.preFlight.rocketInformation.targetApogee
        ) || 0;
      const altitudeScore = Math.abs(contestAltimeterApogee - targetApogee);

      // Create a new postFlight object and update its properties
      const updatedPostFlight = {
        ...prevFlysheetState.postFlight,
        contestAltimeterApogee,
        tarcScores: {
          ...prevFlysheetState.postFlight.tarcScores,
          altitudeScore,
          totalScore:
            altitudeScore +
            prevFlysheetState.postFlight.tarcScores.durationScore,
        },
      };

      // Return the updated state
      return {
        ...prevFlysheetState,
        [name]: value,
        postFlight: updatedPostFlight,
      };
    });
  };

  const handleChangeTimer1Duration = (e) => {
    const { name, value } = e.target;
    setFlysheetState((prevFlysheetState) => {
      // Calculate avgDuration using the current value from event target and the current value of timer2Duration
      const timer1Duration = parseFloat(value) || 0;
      const timer2Duration =
        parseFloat(prevFlysheetState.postFlight.timer2Duration) || 0;
      const avgDuration = (timer1Duration + timer2Duration) / 2;

      // Create a new postFlight object and update its properties
      const updatedPostFlight = {
        ...prevFlysheetState.postFlight,
        timer1Duration,
        avgDuration,
        tarcScores: {
          ...prevFlysheetState.postFlight.tarcScores,
          durationScore: calculateDurationScore(avgDuration),
          totalScore:
            prevFlysheetState.postFlight.tarcScores.altitudeScore +
            calculateDurationScore(avgDuration),
        },
      };

      // Return the updated state
      return {
        ...prevFlysheetState,
        [name]: value,
        postFlight: updatedPostFlight,
      };
    });
  };

  const handleChangeTimer2Duration = (e) => {
    const { name, value } = e.target;
    setFlysheetState((prevFlysheetState) => {
      // Calculate avgDuration using the current value from event target and the current value of timer1Duration
      const timer2Duration = parseFloat(value) || 0;
      const timer1Duration =
        parseFloat(prevFlysheetState.postFlight.timer1Duration) || 0;
      const avgDuration = (timer1Duration + timer2Duration) / 2;

      // Create a new postFlight object and update its properties
      const updatedPostFlight = {
        ...prevFlysheetState.postFlight,
        timer2Duration,
        avgDuration,
        tarcScores: {
          ...prevFlysheetState.postFlight.tarcScores,
          durationScore: calculateDurationScore(avgDuration),
          totalScore:
            prevFlysheetState.postFlight.tarcScores.altitudeScore +
            calculateDurationScore(avgDuration),
        },
      };

      // Return the updated state
      return {
        ...prevFlysheetState,
        [name]: value,
        postFlight: updatedPostFlight,
      };
    });
  };

  const calculateDurationScore = (avgDuration) => {
    if (avgDuration >= 43 && avgDuration <= 46) {
      return 0;
    } else if (avgDuration < 43) {
      return (Math.round((43 - avgDuration) * 100) * 4) / 100;
    } else {
      return (Math.round((avgDuration - 46) * 100) * 4) / 100;
    }
  };

  const handleLaunchAdd = (e) => {
    e.preventDefault();
    console.log("handleAdd-teamId", flysheetState.teamId);
    console.log("handleAdd-flysheetState", flysheetState);

    // createFlysheet function to push the data to the backend
    createFlysheet(flysheetState).then((response) => {
      if (response.success) {
        console.log("API Response:", response); // Add this line to log the API response
        alert("Flysheet created successfully");
        localStorage.removeItem("flysheetState"); // Remove the flysheetState from local storage after successful submissio
        navigate("/flysheets"); // Redirect to the list of flysheets after successful submission
      }
    });
  };

  return (
    <div className="ml-4">
            <p className="text-xl font-bold mb-4">
        <span className="mr-2">Add Flysheet: Step 3 -</span>
        <span >
        Launch and Post-flight Information
        </span>
      </p>

      <Form onSubmit={handleLaunchAdd}>

        <div className="mb-4 border-t-1  border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="railLength"
          >
            Rail Length (m)
          </label>
          <Form.Group controlId="railLength">
            <Form.Control
              type="number"
              name="railLength"
              value={flysheetState.preFlight.launchInformation.railLength}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-4 border-t-1  border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="launchAngleDownwind"
          >
            Launch Angle Downwind (degrees)
          </label>
          <Form.Group controlId="launchAngleDownwind">
            <Form.Control
              type="number"
              name="launchAngleDownwind"
              value={
                flysheetState.preFlight.launchInformation.launchAngleDownwind
              }
              step={0.1}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-4 border-t-1  border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="launchAnglePerpendicular"
          >
            Launch Angle Perpendicular to Wind (degrees)
          </label>
          <Form.Group controlId="launchAnglePerpendicular">
            <Form.Control
              type="number"
              name="launchAnglePerpendicular"
              value={
                flysheetState.preFlight.launchInformation
                  .launchAnglePerpendicular
              }
              step={0.1}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-4 border-t-1  border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="contestAltimeterApogee"
          >
            Contest Altimeter Apogee
          </label>
          <Form.Group controlId="contestAltimeterApogee">
            <Form.Control
              type="number"
              name="contestAltimeterApogee"
              value={flysheetState.postFlight.contestAltimeterApogee}
              onChange={handleChangeContestAltimeterApogee}
            />
          </Form.Group>
        </div>

        <div className="mb-4 border-t-1  border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="timer1Duration"
          >
            Timer #1 Duration
          </label>
          <Form.Group controlId="timer1Duration">
            <Form.Control
              type="number"
              name="timer1Duration"
              value={flysheetState.postFlight.timer1Duration}
              step={0.01}
              onChange={handleChangeTimer1Duration}
            />
          </Form.Group>
        </div>

        <div className="mb-3 pb-4 border-t-1 border-b-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="timer2Duration"
          >
            Timer #2 Duration
          </label>

          <Form.Group controlId="timer2Duration">
            <Form.Control
              type="number"
              name="timer2Duration"
              value={flysheetState.postFlight.timer2Duration}
              step={0.01}
              onChange={handleChangeTimer2Duration}
            />
          </Form.Group>
        </div>

        <div className="mb-3 mr-5 flex justify-between">
          <Link to="/flysheets/weather/add">
            <Button
              color="white"
              bgColor={currentColor}
              text="Back-Add Weather"
              borderRadius="10px"
              width="1/3"
            />
          </Link>

          <ButtonComponent // Use Syncfusion ButtonComponent here
            content="Submit New Flysheet"
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
