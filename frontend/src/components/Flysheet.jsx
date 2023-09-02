// Flysheet.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


export default function Flysheet({ data, handleDelete, onCheckboxChange, showCalculateModal }) {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const {
    _id,
    rocketTeamName,
    flightNumber,
    tarcTeamNumber,
    preFlight,
    postFlight,
  } = data;

  const { date, rocketInformation } = preFlight;
  const { liftoffMass, parachuteAreaBooster } = rocketInformation;
  const { contestAltimeterApogee, avgDuration, tarcScores } = postFlight;
  const { totalScore } = tarcScores;

  // Format the avgDuration and totalScore to display two digits after the decimal point
  const formattedAvgDuration = avgDuration.toFixed(2);
  const formattedTotalScore = totalScore.toFixed(2);

  // Helper function to format date to a user-friendly string
  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed, ensure two digits
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };

  // Format the date to a user-friendly string
  const formattedDate = formatDate(date);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    console.log(
      "Checkbox changed:",
      data._id,
      e.target.checked,
      liftoffMass,
      contestAltimeterApogee,
      parachuteAreaBooster,
      avgDuration
    );
    onCheckboxChange(
      data._id,
      e.target.checked,
      liftoffMass,
      contestAltimeterApogee
    ); // Inform the parent component (FlysheetListPage) about the checkbox change
  };

  return (
    <tr>
      <th>{flightNumber}</th>
      <th>{formattedDate}</th>
      <th>{liftoffMass}</th>
      <th>{contestAltimeterApogee}</th>
      <th>{formattedAvgDuration}</th>
      <th>{parachuteAreaBooster}</th>
      <th>{formattedTotalScore}</th>
      <th className="checkbox-cell">
        <Form.Check
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </th>
      <th>
        {/* <button
          onClick={() => navigate(`/flysheets/parachute/${_id}`, { state: data })}
          className="btn btn-primary"
        >
          Calculate
        </button> */}
        <Button onClick={() => showCalculateModal(_id)}>
          Calculate
        </Button>
      </th>
      <td>
        <button
          onClick={() =>
            navigate(`/flysheets/rocket/edit/${_id}`, { state: data })
          }
          className="btn btn-primary"
        >
          Edit
        </button>
      </td>
      <td>
        <button onClick={() => handleDelete(_id)} className="btn btn-danger">
          Delete
        </button>
      </td>
    </tr>
  );
}
