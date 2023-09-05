// FlysheetListPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Modal, Row, Col } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap imports
// import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";

// Services and Component Imports
import { getFlysheets, deleteFlysheet } from "../../services/servFlysheets";
import Flysheet from "../../components/Rockets/Flysheet";
import FlysheetContext from "../../contexts/FlysheetContext";
import RegressionCalculator from "../../components/Rockets/RegressionCalculator";
import CalculateModal from "../../components/Rockets/CalculateModal";
import Button from "../../components/Button"; // Import your Button component
// new
import { useStateContext } from "../../contexts/ContextProvider"; // Import the context
import { initialFlysheetState } from "../../contexts/FlysheetProvider";

export default function FlysheetListPage() {
  const { currentColor } = useStateContext();
  const [sortButtonText, setSortButtonText] = useState(
    "Sort by Flight Number Ascending"
  );
  const [calculateModalVisible, setCalculateModalVisible] = useState(false);
  const [currentFlysheetId, setCurrentFlysheetId] = useState(null);
  const showCalculateModal = (flysheetId) => {
    setCurrentFlysheetId(flysheetId);
    setCalculateModalVisible(true);
  };
  const closeCalculateModal = () => {
    setCurrentFlysheetId(null);
    setCalculateModalVisible(false);
  };

  const navigate = useNavigate();
  // const [flysheets, setFlysheets] = useState([]); // datam array for the list
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const { flysheetState, setFlysheetState, flysheets, setFlysheets } =
    useContext(FlysheetContext);
  const [selectedFlysheets, setSelectedFlysheets] = useState([]);
  const [mapX, setMapX] = useState([]);
  const [mapY, setMapY] = useState([]);

  useEffect(() => {
    getFlysheets()
      .then((response) => {
        if (response.success) {
          setFlysheets(response.data);
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching the data.", error);
      });
  }, []);

  // get and store rocket team name
  const teamName =
    flysheets.length > 0 ? flysheets[0].rocketTeamName : "Unknown Team";

  useEffect(() => {
    setFlysheetState((prevState) => ({
      ...prevState,
      rocketTeamName: teamName,
    }));
  }, [teamName]);

  // development aids
  useEffect(() => {
    console.log("selectedFlysheets:", selectedFlysheets);
  }, [selectedFlysheets]);

  useEffect(() => {
    console.log("mapX:", mapX);
  }, [mapX]);

  // Create a Map to store the flysheets for faster search
  const [flysheetMap, setFlysheetMap] = useState(new Map());

  useEffect(() => {
    // Populate the flysheetMap when the flysheets state changes
    const newFlysheetMap = new Map();
    flysheets.forEach((flysheet) => newFlysheetMap.set(flysheet._id, flysheet));
    setFlysheetMap(newFlysheetMap);
  }, [flysheets]);

  // FlysheetListPage.jsx
  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      setFlysheets([]);
    }
  }, []);

  const handleDelete = (_id) => {
    // Delete flysheet using the deleteFlysheet service
    deleteFlysheet(_id)
      .then(() => {
        setFlysheets((prevFlysheets) =>
          prevFlysheets.filter((flysheet) => flysheet._id !== _id)
        );
      })
      .catch((error) => {
        console.error("An error occurred while deleting the flysheet.", error);
      });
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const newText = `Sort by Flight Number ${
      newSortOrder === "asc" ? "Descending" : "Ascending"
    }`;
    setSortButtonText(newText);
    const sortedFlysheets = [...flysheets].sort((a, b) =>
      sortOrder === "asc"
        ? a.flightNumber - b.flightNumber
        : b.flightNumber - a.flightNumber
    );
    setFlysheets(sortedFlysheets);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  const handleAdd = () => {
    // setFlysheetState(initialFlysheetState)
    // if local storage item called flysheetState exits delete it before next step
    if (localStorage.getItem("flysheetState")) {
      localStorage.removeItem("flysheetState");
    }
    const maxFlightNumber = Math.max(
      ...flysheets.map((flysheet) => flysheet.flightNumber),
      0
    );
    setFlysheetState((prevFlysheetState) => ({
      ...prevFlysheetState,
      flightNumber: maxFlightNumber + 1,
    }));
    navigate("/flysheets/rocket/add");
  };
  // flysheetMap
  const handleCheckboxChange = (
    flysheetId,
    isChecked,
    mass,
    apogee,
    chuteArea,
    avgDuration
  ) => {
    if (isChecked) {
      setSelectedFlysheets((prevSelectedFlysheets) =>
        prevSelectedFlysheets.concat(flysheetId)
      );
      // map handling
      setMapX((prevMapX) => prevMapX.concat(flysheetId, mass));
      setMapY((prevMapY) => prevMapY.concat(flysheetId, apogee));
    } else {
      setSelectedFlysheets((prevSelectedFlysheets) =>
        prevSelectedFlysheets.filter((id) => id !== flysheetId)
      );
      // map handling removal of map item pair for X and Y
      const indexX = mapX.indexOf(flysheetId);
      const indexY = mapY.indexOf(flysheetId);
      if (indexX !== -1) {
        const updatedMapX = [...mapX];
        updatedMapX.splice(indexX, 2); // Remove flysheetId and its associated mass from mapX
        setMapX(updatedMapX);
      }
      if (indexY !== -1) {
        const updatedMapY = [...mapY];
        updatedMapY.splice(indexY, 2); // Remove flysheetId and its associated apogee from mapY
        setMapY(updatedMapY);
      }
    }
  };

  const getMassApogeePairs = () => {
    const massApogeePairs = [];
    for (let i = 0; i < mapX.length; i += 2) {
      const flysheetId = mapX[i];
      const mass = mapX[i + 1];
      const apogee = mapY[i + 1];
      if (mass !== undefined && apogee !== undefined) {
        massApogeePairs.push([mass, apogee]);
      }
    }
    console.log("massApogeePairs:", massApogeePairs);
    return massApogeePairs;
  };

  return (
    // <Container>
      <div className="ml-5 mr-5">
        {calculateModalVisible && (
          <CalculateModal
            flysheetId={currentFlysheetId}
            onClose={closeCalculateModal}
          />
        )}
        <h4>Flysheet List for: {teamName}</h4>
        <p>Total number of flysheets: {flysheets.length}</p>{" "}
        {/* Displaying the count here */}
        <div className="mt-15" style={{ width: "25%" }} onClick={handleSort}>
          <Button
            color="white"
            bgColor={currentColor}
            text={sortButtonText}
            borderRadius="10px"
            width="full"
          />
        </div>
        <table className="w-full text-gray-700  bg-white dark:bg-gray-800" >
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th>Flight #</th>
              <th>Date</th>
              <th>Mass (g)</th>
              <th>Apogee (ft)</th>
              <th>Duration (s)</th>
              <th>
                Parachute
                <br />
                size (in²)
              </th>
              <th>
                ARC
                <br /> Score
              </th>
              <th className="checkbox-cell">
                  Include in
                  <br />Regression
              </th>
              <th>
                New
                <br />
                Parachute
                <br />
                Size
              </th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody
            className="border border-gray-300 bg-white divide-y  divide-gray-300 dark:bg-gray-800 dark:divide-gray-700 font-normal !important">
            {flysheets.map((flysheet) => (
              <Flysheet
                key={flysheet._id}
                data={flysheet}
                handleDelete={handleDelete}
                onCheckboxChange={handleCheckboxChange} // Pass the handler to the Flysheet component
                showCalculateModal={showCalculateModal}
              />
            ))}
          </tbody>
        </table>
        <div
          className="mt-15"
          style={{ width: "25%", margin: "auto" }}
          onClick={handleAdd}
        >
          <Button
            color="white"
            bgColor={currentColor}
            text="Add Flysheet"
            borderRadius="10px"
            width="full"
          />
        </div>
        <div className="mt-4">
          {/* Add the RegressionCalculator component here */}
          <RegressionCalculator massApogeePairs={getMassApogeePairs} />
        </div>
      </div>
    // </Container>
  );
}
