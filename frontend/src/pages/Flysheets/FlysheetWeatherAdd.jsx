// FlysheetWeatherAdd.jsx

// React Imports
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Services and Component Imports
import { getWeather } from "../../services/servFlysheets";
import FlysheetContext from "../../contexts/FlysheetContext";

// Bootstrap Imports
import Form from "react-bootstrap/Form";
import Button from "../../components/Button"; // Import your Button component
import { useStateContext } from "../../contexts/ContextProvider";
import {
  NumericTextBoxComponent,
  TextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
// import { Row, Col } from "react-bootstrap";

export default function FlysheetWeatherAdd() {
  const { currentColor } = useStateContext();

  const defaultWeatherData = {
    main: {
      pressure: "",
      humidity: "",
      temp: 273.15, // Kelvin
    },
    wind: {
      speed: "",
      deg: "",
    },
    dt: 0,
  };

  const [weatherData, setWeatherData] = useState(defaultWeatherData);
  // new state object for weather conditions
  const [weatherInfo, setWeatherInfo] = useState({
    weatherConditions: {
      temperature: "",
      humidity: "",
      atmosphericPressure: "",
      airDensity: 1.225,
      windSpeedDirection: "",
      windSpeed: "",
    },
    extras: {
      description: "",
      city: "",
    },
  });

  const { flysheetState, setFlysheetState } = useContext(FlysheetContext);

  const navigate = useNavigate();

  const fetchWeatherData = () => {
    console.log("fetchWeatherData() called");
    getWeather()
      .then((response) => {
        if (response.success) {
          console.log("response.data:", response.data);

          setWeatherData(response.data);
          initializeWeatherInfo(response.data);
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching the data.", error);
      });
  };

  // Trigger this function inside your existing useEffect:
  useEffect(() => {
    fetchWeatherData();
  }, []);

  useEffect(() => {
    console.log("flysheetState:", flysheetState);
    localStorage.setItem("flysheetState", JSON.stringify(flysheetState));
  }, [flysheetState]);

  const initializeWeatherInfo = (data) => {
    const description = data.weather[0]?.description || "";
    const city = data.name || "";
    const temperatureK = data.main?.temp || 273.15;
    const temperatureFahrenheit = ((temperatureK - 273.15) * 9) / 5 + 32;
    const temperatureCelsius = temperatureK - 273.15;
    const humidity = data.main?.humidity || "";
    const pressure = data.main?.pressure || "";
    const windSpeedMPH = (data.wind?.speed || 0) * 2.237;
    const windDirectionDeg = data.wind?.deg || "";
    let airDensity = calculateAirDensity(
      temperatureCelsius,
      pressure,
      humidity,
      235.92
    );

    const preFlightWeatherConditions =
      flysheetState?.preFlight?.weatherConditions || {};
    const temperature =
      preFlightWeatherConditions.temperature ||
      temperatureFahrenheit.toFixed(2);
    airDensity = preFlightWeatherConditions.airDensity || airDensity.toFixed(3);
    const windSpeed =
      preFlightWeatherConditions.windSpeed || windSpeedMPH.toFixed(2);

    setWeatherInfo({
      weatherConditions: {
        temperature,
        humidity,
        atmosphericPressure: pressure,
        airDensity,
        windSpeedDirection: windDirectionDeg,
        windSpeed,
      },
      extras: {
        description: description,
        city: city,
      },
    });
  };

  const pressure =
    weatherData && weatherData.main ? weatherData.main.pressure : null;

  const humidity =
    weatherData && weatherData.main ? weatherData.main.humidity : null;

  // Convert Unix timestamp and timezone offset to local date and time
  const localDateTime = weatherData
    ? new Date(weatherData.dt * 1000).toLocaleString()
    : null;

  // elevation = 774ft = 235.92m for default latitude and longitude
  function calculateAirDensity(
    temperature,
    pressure,
    humidity,
    elevation = 235.92
  ) {
    // Saturation Vapor Pressure (SVP)
    const Es = 6.11 * Math.pow(10, (7.5 * temperature) / (237.3 + temperature));

    // Actual Vapor Pressure (AVP)
    const E = (humidity * Es) / 100;

    // Adjust pressure for elevation if provided
    const P = 100 * pressure - elevation / 8.3; // Rough approximation

    // Specific gas constants
    const Rd = 287.05; // J/(kg·K) for dry air
    const Rv = 461.495; // J/(kg·K) for water vapor

    // Virtual temperature in Kelvin
    const Tv = (temperature + 273.15) * (1 + 0.608 * (E / P));

    // Air Density (kg/m³)
    const density = (P - E) / (Rd * Tv) + E / (Rv * Tv);

    return density;
  }

  // Convert wind direction from degrees to cardinal direction
  const windDirectionCardinal = weatherData
    ? windDirectionToCardinal(weatherData.wind.deg)
    : null;

  // Convert wind direction from degrees to cardinal direction

  function windDirectionToCardinal(direction) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const degree = (direction + 22.5) % 360;
    const index = Math.floor(degree / 45);
    return directions[index];
  }

  // functions to handle form input and submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setWeatherInfo((prevWeatherInfo) => ({
      weatherConditions: {
        ...prevWeatherInfo.weatherConditions,
        [name]: value,
      },
      extras: { ...prevWeatherInfo.extras },
    }));
  };

  const handleWeatherAdd = (e) => {
    e.preventDefault();
    console.log("Weather Info:", weatherInfo);

    setFlysheetState((prevFlysheetState) => {
      return {
        ...prevFlysheetState,
        preFlight: {
          ...prevFlysheetState.preFlight,
          date: localDateTime,
          timeOfLaunch: localDateTime,
          weatherConditions: weatherInfo.weatherConditions,
        },
      };
    });

    localStorage.setItem("flysheetState", JSON.stringify(flysheetState));
    navigate("/flysheets/launch/add");
  };

  return (
    <div className="ml-5">
      <p className="text-xl font-bold mb-4">
        <span className="mr-2">Add Flysheet: Step 2 -</span>
        <span >
          Weather Information for {weatherInfo.extras.city} - Currently{" "}
          {weatherInfo.extras.description}
        </span>
      </p>
      {/* <Button onClick={fetchWeatherData}>Fetch Weather Data</Button> */}
      <Form onSubmit={handleWeatherAdd} className="mt-6">
        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="date"
          >
            Time and Date
          </label>
          <Form.Group controlId="date">
            {/* <Form.Label className="bold-label">Time and Date</Form.Label> */}
            <Form.Control
              type="text"
              name="date"
              value={localDateTime}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="temperature"
          >
            Temperature (°F)
          </label>
          <Form.Group controlId="temperature">
            {/* <Form.Label className="bold-label">Temperature (°F)</Form.Label> */}
            <Form.Control
              type="number"
              name="temperature"
              value={weatherInfo.weatherConditions.temperature}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="humidity"
          >
            Humidity (%)
          </label>
          <Form.Group controlId="humidity">
            {/* <Form.Label className="bold-label">Humidity (%)</Form.Label> */}
            <Form.Control
              type="number"
              name="humidity"
              value={weatherInfo.weatherConditions.humidity}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="atmosphericPressure"
          >
            Atmospheric Pressure (hPa)
          </label>
          <Form.Group controlId="atmosphericPressure">
            {/* <Form.Label className="bold-label">
              Atmospheric Pressure (hPa)
            </Form.Label> */}
            <Form.Control
              type="number"
              name="atmosphericPressure"
              value={weatherInfo.weatherConditions.atmosphericPressure}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="airDensity"
          >
            Air Density (kg/m³)
          </label>
          <Form.Group controlId="airDensity">
            {/* <Form.Label className="bold-label">Air Density (kg/m³)</Form.Label> */}
            <Form.Control
              type="number"
              name="airDensity"
              value={weatherInfo.weatherConditions.airDensity}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="windSpeed"
          >
            Wind Speed (MPH)
          </label>
          <Form.Group controlId="windSpeed">
            {/* <Form.Label className="bold-label">Wind Speed (MPH)</Form.Label> */}
            <Form.Control
              type="number"
              name="windSpeed"
              value={weatherInfo.weatherConditions.windSpeed}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-4 border-t-1 border-b-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="windSpeedDirection"
          >
            Wind Direction (Degrees) - Currently out of the{" "}
            {windDirectionCardinal}{" "}
          </label>
          <Form.Group controlId="windSpeedDirection">
            {/* <Form.Label className="bold-label">
            Wind Direction (Degrees) - Currently out of the{" "}
            {windDirectionCardinal}{" "}
          </Form.Label> */}
            <Form.Control
              type="number"
              name="windSpeedDirection"
              value={weatherInfo.weatherConditions.windSpeedDirection}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3 mr-5 flex justify-between">
          <Link to="/flysheets/rocket/add">
            <Button
              color="white"
              bgColor={currentColor}
              text="Back-Flysheet List"
              borderRadius="10px"
              width="1/3"
            />
          </Link>

          <ButtonComponent // Use Syncfusion ButtonComponent here
            content="Next-Edit Launch Info"
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
