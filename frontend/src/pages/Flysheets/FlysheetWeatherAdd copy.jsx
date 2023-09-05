// FlysheetWeatherAdd.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getWeather } from "../services/servFlysheets";
import FlysheetContext from '../contexts/FlysheetContext';
import { Row, Col } from "react-bootstrap";

export default function FlysheetWeatherAdd() {
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
      airDensity: "",
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

    const preFlightWeatherConditions = flysheetState?.preFlight?.weatherConditions || {};
    const temperature = preFlightWeatherConditions.temperature || temperatureFahrenheit.toFixed(2);
     airDensity = preFlightWeatherConditions.airDensity || airDensity.toFixed(3);
    const windSpeed = preFlightWeatherConditions.windSpeed || windSpeedMPH.toFixed(2);

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
    navigate("/flysheets/launch/add");
  };

  return (
    <div>
      <h4>Flysheet: Weather Information for {weatherInfo.extras.city} - Currently {weatherInfo.extras.description}</h4>
      <Button onClick={fetchWeatherData}>Fetch Weather Data</Button>

      <Form onSubmit={handleWeatherAdd}>
        
        <Form.Group controlId="date">
          <Form.Label className="bold-label">Time and Date</Form.Label>
          <Form.Control
            type="text"
            name="date"
            value={localDateTime}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="temperature">
          <Form.Label className="bold-label">Temperature (°F)</Form.Label>
          <Form.Control
            type="number"
            name="temperature"
            value={weatherInfo.weatherConditions.temperature}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="humidity">
          <Form.Label className="bold-label">Humidity (%)</Form.Label>
          <Form.Control
            type="number"
            name="humidity"
            value={weatherInfo.weatherConditions.humidity}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="atmosphericPressure">
          <Form.Label className="bold-label">
            Atmospheric Pressure (hPa)
          </Form.Label>
          <Form.Control
            type="number"
            name="atmosphericPressure"
            value={weatherInfo.weatherConditions.atmosphericPressure}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="airDensity">
          <Form.Label className="bold-label">Air Density (kg/m³)</Form.Label>
          <Form.Control
            type="number"
            name="airDensity"
            value={weatherInfo.weatherConditions.airDensity}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="windSpeed">
          <Form.Label className="bold-label">Wind Speed (MPH)</Form.Label>
          <Form.Control
            type="number"
            name="windSpeed"
            value={weatherInfo.weatherConditions.windSpeed}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="windSpeedDirection">
          <Form.Label className="bold-label">
            Wind Direction (Degrees) - Currently out of the{" "}
            {windDirectionCardinal}{" "}
          </Form.Label>
          <Form.Control
            type="number"
            name="windSpeedDirection"
            value={weatherInfo.weatherConditions.windSpeedDirection}
            onChange={handleChange}
          />
        </Form.Group>

        <Row className="justify-content-between">
          <Col xs={5} md={3}>
            <Link to="/flysheets/rocket/add">
              <Button variant="primary" style={{ width: "100%" }}>
                Back-Rocket Info
              </Button>
            </Link>
          </Col>
          <Col xs={5} md={3}>
            <Button type="submit" variant="primary" style={{ width: "100%" }}>
              Next-Launch Info
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
