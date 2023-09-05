// FlysheetLaunchAdd.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

// import Button from "react-bootstrap/Button";
import Button from "../../components/Button"; // Import your Button component
import { useStateContext } from "../../contexts/ContextProvider"; // Import the context

import FlysheetContext from "../../contexts/FlysheetContext";
import { Row, Col } from "react-bootstrap";
import { updateFlysheet } from "../../services/servFlysheets";

export default function FlysheetLaunchAdd() {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const { id } = useParams(); // extract the _id from the URL params

  const { flysheetState, setFlysheetState, flysheets, setFlysheets } =
    useContext(FlysheetContext);

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
    // Fetch the flysheet data with the given id
    const flysheet = flysheets.find((flysheet) => flysheet._id === id);
    console.log("flysheet:", flysheet);

    if (flysheet) {
      // Initialize the state with the current flysheet data
      setFlysheetState(flysheet);

      // Initialize other state variables with their corresponding flysheet properties
    }
  }, [flysheets, id]);

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

  const handleLaunchEdit = (e) => {
    e.preventDefault();
    console.log("handleAdd-teamId", flysheetState.teamId);
    console.log("handleAdd-flysheetState", flysheetState);

    // createFlysheet function to push the data to the backend
    updateFlysheet(id, flysheetState).then((response) => {
      if (response.success) {
        console.log("API Response:", response); // Add this line to log the API response
        alert("Flysheet created updated");
        // Remove the flysheetState from localStorage
        localStorage.removeItem("flysheetState");
        navigate("/flysheets"); // Redirect to the list of flysheets after successful submission
      }
    });
  };

  return (
    <div className="ml-4">
      <p className="text-xl font-bold mb-4">
        <span className="mr-2">Edit Flysheet: Step 3 -</span>
        <span>Launch and Post-flight Information</span>
      </p>

      <Form onSubmit={handleLaunchEdit}>
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
            htmlFor="railLength"
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
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-4 border-t-1  border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="railLength"
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
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-4 border-t-1  border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="railLength"
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
            htmlFor="railLength"
          >
            Timer #1 Duration
          </label>
          <Form.Group controlId="timer1Duration">
            <Form.Control
              type="number"
              name="timer1Duration"
              value={flysheetState.postFlight.timer1Duration}
              onChange={handleChangeTimer1Duration}
            />
          </Form.Group>
        </div>

        <div className="mb-4 border-t-1  border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="railLength"
          >
            Timer #2 Duration
          </label>
          <Form.Group controlId="timer2Duration">
            <Form.Control
              type="number"
              name="timer2Duration"
              value={flysheetState.postFlight.timer2Duration}
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
