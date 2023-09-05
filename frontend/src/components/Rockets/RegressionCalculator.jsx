// RegressionCalculator.jsx
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider"; // Import the context
// import Button from 'react-bootstrap/Button';
import Button from "../../components/Button"; // Import your Button component

import Form from "react-bootstrap/Form";
import { SLR } from "ml-regression";

// Services and Component Imports

import ScatterChart from "./ScatterChart";

export default function RegressionCalculator({ massApogeePairs }) {
  const { currentColor } = useStateContext();
  const [calculatedMass, setCalculatedMass] = useState("");
  const [targetApogee, setTargetApogee] = useState("");
  const [regressionResult, setRegressionResult] = useState(null);
  const [chartData, setChartData] = useState(null); // Add this line

  useEffect(() => {
    if (regressionResult) {
      renderChart();
    }
  }, [regressionResult]);

  const performLinearRegression = () => {
    const selectedMassApogeePairs = massApogeePairs();

    if (selectedMassApogeePairs.length < 2) {
      setRegressionResult(null);
      return;
    }

    const xData = selectedMassApogeePairs.map((pair) => pair[0]);
    const yData = selectedMassApogeePairs.map((pair) => pair[1]);

    const regressionModel = new SLR(xData, yData);

    const slope = regressionModel.coefficients[1];
    const intercept = regressionModel.coefficients[0];

    const predictedYData = regressionModel.predict(xData);
    const totalSumSquares = yData.reduce(
      (acc, y) =>
        acc + Math.pow(y - yData.reduce((a, b) => a + b) / yData.length, 2),
      0
    );
    const residualSumSquares = predictedYData.reduce(
      (acc, y, i) => acc + Math.pow(y - yData[i], 2),
      0
    );
    const rSquared = 1 - residualSumSquares / totalSumSquares;

    setRegressionResult({ slope, intercept, rSquared });
  };

  const handleCalculateMass = () => {
    const desiredApogee = parseFloat(targetApogee);

    if (isNaN(desiredApogee)) {
      setCalculatedMass(
        "Invalid input. Please enter a valid number for the target apogee."
      );
      return;
    }

    if (!regressionResult) {
      setCalculatedMass("Not enough data to perform regression.");
      return;
    }

    const { slope, intercept } = regressionResult;
    const calculatedMass = (desiredApogee - intercept) / slope;
    setCalculatedMass(
      `Recommended Mass for ${desiredApogee} ft: ${calculatedMass.toFixed(2)} g`
    );
  };

  const renderChart = () => {
    if (!regressionResult || !massApogeePairs) {
      return;
    }

    const selectedMassApogeePairs = massApogeePairs();
    const newChartData = {
      datasets: [
        {
          label: "Apogee vs. Mass",
          data: selectedMassApogeePairs.map((pair) => ({
            x: pair[0],
            y: pair[1],
          })),
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 7,
          pointStyle: "rectRot", // Rotated square
          pointBackgroundColor: "blue", // Blue color
        },
        {
          label: "Regression Line",
          data: regressionResult.slope
            ? selectedMassApogeePairs.map((pair) => ({
                x: pair[0],
                y:
                  regressionResult.intercept + regressionResult.slope * pair[0],
              }))
            : [],
          borderColor: "rgba(0, 128, 0, 1)", // Green color
          borderWidth: 4, // Thicker line
          borderDash: [], // Solid line
          pointRadius: 0,
          type: "line",
        },
      ],
    };

    setChartData(newChartData);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Mass (g)",
          font: {
            size: 16,
            weight: "bold", // Bold text
          },
        },
        ticks: {
          font: {
            size: 14,
            weight: "bold", // Bold labels
          },
        },
        // ...
      },
      y: {
        title: {
          display: true,
          text: "Apogee (ft)",
          font: {
            size: 16,
            weight: "bold", // Bold text
          },
        },
        ticks: {
          font: {
            size: 14,
            weight: "bold", // Bold labels
          },
        },
        // ...
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14, // Adjust the size as needed
            weight: "bold", // Optionally, set the font weight
          },
        },
      },
    },
  };

  function formatSlope(slope) {
    if (slope >= 0) {
      return slope.toFixed(2);
    } else {
      return `-${Math.abs(slope).toFixed(2)}`;
    }
  }

  return (
    <div className="mt-4">
      <h4>Apogee vs. Mass Regression Calculator</h4>
      <h5>(Select flysheets above to include in regression)</h5>
      {/* <Button onClick={performLinearRegression}>Calculate</Button> */}
      <div
        className="mt-5"
        style={{ width: "25%" }}
        onClick={performLinearRegression}
      >
        <Button
          color="white"
          bgColor={currentColor}
          text="Calculate"
          borderRadius="10px"
          width="full"
        />
      </div>
      {regressionResult && (
        <div>
          <h5>
            Equation of regression line: Y ={" "}
            {formatSlope(regressionResult.slope)}X{" "}
            {regressionResult.intercept >= 0 ? "+" : "-"}{" "}
            {Math.abs(regressionResult.intercept).toFixed(2)}
          </h5>

          <h4>Regression Statistics:</h4>
          <h5>R²: {regressionResult.rSquared.toFixed(2)}</h5>
        </div>
      )}
      <br />
      <div className="mt-4">
        <h4>Solve for New Mass</h4>
        <Form>
          <Form.Group controlId="targetApogee">
            <h5>Target Apogee</h5>
            <Form.Control
              type="number"
              placeholder="Enter target apogee"
              value={targetApogee}
              onChange={(e) => setTargetApogee(e.target.value)}
              style={{ maxWidth: "300px" }}
            />
          </Form.Group>
          {/* <Button onClick={handleCalculateMass}>Solve</Button> */}
          <div
            className="mt-5 max-w-xs"
            style={{ width: "25%" }}
            onClick={handleCalculateMass}
          >
            <Button
              color="white"
              bgColor={currentColor}
              text="Solve"
              borderRadius="10px"
              width="full"
            />
          </div>
        </Form>
        {calculatedMass && <h5>{calculatedMass}</h5>}
      </div>
      {/* Display the scatter chart using the ScatterChart component */}
      {regressionResult && chartData && (
        <div className="mt-4">
          <h4>Mass vs. Apogee Chart</h4>
          <h5>
            A = {formatSlope(regressionResult.slope)}m{" "}
            {regressionResult.intercept >= 0 ? "+" : "-"}{" "}
            {Math.abs(regressionResult.intercept).toFixed(2)}
          </h5>
          {/* <ScatterChart data={chartData} /> */}
          <ScatterChart data={chartData} chartOptions={chartOptions} />
        </div>
      )}
    </div>
  );
}
