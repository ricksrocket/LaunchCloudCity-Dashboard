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
import { NumericTextBoxComponent, TextBoxComponent } from "@syncfusion/ej2-react-inputs";
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

  const handleChange = (name, value) => {
    console.log("name", name);
    console.log("value", value);

    // console.log("name", args);

    // const { name, value } = args.target;
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
      <h4>
        Flysheet: Weather Information for {weatherInfo.extras.city} - Currently{" "}
        {weatherInfo.extras.description}
      </h4>
      <Button onClick={fetchWeatherData}>Fetch Weather Data</Button>
      <form onSubmit={handleWeatherAdd} className="mt-6">
        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="date"
          >
            Time and Date
          </label>
          <TextBoxComponent
            type="text"
            name="date"
            id="date"
            value={localDateTime}
            floatLabelType="Auto"
            change={(args) => handleChange("date", args.value)} 
            
            required
            decimals={2} // Set to two decimal places
            step={0.01} // Set a small step increment for decimal values
          />
        </div>

        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="temperature"
          >
            Temperature (°F)
          </label>
          <NumericTextBoxComponent
            type="text"
            name="temperature"
            id="temperature"
            value={weatherInfo.weatherConditions.temperature}
            floatLabelType="Auto"
            decimals={2} // Set to two decimal places
            step={0.01} // Set a small step increment for decimal values
            change={(args) => handleChange("temperature", args.value)} 
            required
          />
        </div>

        <div className="mb-3 border-t-1 border-gray-400">

          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="humidity"
          >
            Humidity (%)
          </label>
          <NumericTextBoxComponent
            type="text"
            name="humidity"
            id="humidity"
            value={weatherInfo.weatherConditions.humidity}
            floatLabelType="Auto"
            decimals={2} // Set to two decimal places
            step={0.01} // Set a small step increment for decimal values
            change={(args) => handleChange("humidity", args.value)} 
            required
          />
        </div>

        <div className="mb-3 border-t-1 border-gray-400">

          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="atmosphericPressure"
          >
            Atmospheric Pressure (hPa)
          </label>
          <NumericTextBoxComponent
            name="atmosphericPressure"
            id="atmosphericPressure"
            value={weatherInfo.weatherConditions.atmosphericPressure}
            floatLabelType="Auto"
            change={(args) => handleChange("atmosphericPressure", args.value)} 
            
            required
          />
        </div>

        <div className="mb-3 border-t-1 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="airDensity"
          >
            Air Density (kg/m³)
          </label>
          <TextBoxComponent
            name="airDensity"
            id="airDensity"
            value={
              weatherInfo.weatherConditions.airDensity
            }
            floatLabelType="Auto"
            showSpinButton={false}
            decimals={3} // Set to two decimal places
            step={0.001} // Set a small step increment for decimal values
            change={(args) => handleChange("airDensity", args.value)} 
            
            required
          />
        </div>

        <div className="mb-3 border-gray-400">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="windSpeed"
          >
            Wind Speed (MPH)
          </label>
          <NumericTextBoxComponent
            name="windSpeed"
            id="windSpeed"
            value={weatherInfo.weatherConditions.windSpeed}
            floatLabelType="Auto"
            showSpinButton={false}
            decimals={2} // Set to two decimal places
            step={0.01} // Set a small step increment for decimal values
            change={(args) => handleChange("windSpeed", args.value)} 
            
            required
          />
        </div>

        <div className="mb-3 border-t-1 border-b-1 border-gray-400">

          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="windSpeedDirection"
          >
            Wind Direction (Degrees) - Currently out of the{" "}
            {windDirectionCardinal}{" "}
          </label>
          <NumericTextBoxComponent
            type="number"
            name="windSpeedDirection"
            id="windSpeedDirection"
            value={weatherInfo.weatherConditions.windSpeedDirection}
            floatLabelType="Auto"
            decimals={2} // Set to two decimal places
            step={0.01} // Set a small step increment for decimal values
            change={(args) => handleChange("windSpeedDirection", args.value)} 
            
            required
          />
        </div>
        <div className="mb-3 flex justify-between">
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
            content="Next-Launch Info"
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
