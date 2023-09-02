// FlysheetProvider.jsx

import React, { useEffect, useState } from "react";
import FlysheetContext from "./FlysheetContext";

const FlysheetProvider = ({ children }) => {

  const [flysheets, setFlysheets] = useState([]);
  const [checklists, setChecklists] = useState([]); // Initialize checklists state as an empty array
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("User");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          name: "Login",
          email: "",
          role: "",
          team: "",
        };
  });

  const [flysheetState, setFlysheetState] = useState({
    rocketTeamName: "",
    flightNumber: 0,
    teamId: "",
    preFlight: {
      date: "",
      timeOfLaunch: "",
      location: "Fairfield, IA",
      elevationOfLaunchSite: 774,
      weatherConditions: {
        temperature: 0,
        humidity: 0,
        atmosphericPressure: 0,
        airDensity: 0,
        windSpeedDirection: 270,
        windSpeed: 0,
      },
      rocketInformation: {
        motorUsed: "F39-7",
        motorSerialNumber: "",
        motorTotalImpulse: 49.7,
        liftoffMass: 450,
        parachuteAreaPayload: null, // works with logic in the add page
        parachuteAreaBooster: 0,
        targetApogee: 820,
        staticStabilityMargin: 1.0,
      },
      launchInformation: {
        railLength: 2.4382,
        launchAngleDownwind: 1.0,
        launchAnglePerpendicular: 0.0,
        tarcAltimeterModel: "PNUT",
        tarcAltimeterSerialNumber: "",
      },
    },
    postFlight: {
      contestAltimeterApogee: 0,
      timer1Duration: 40,
      timer2Duration: 40,
      avgDuration: 0,
      tarcScores: {
        altitudeScore: 0,
        durationScore: 0,
        totalScore: 0,
      },
      flightComputerData: {
        initialTheta: 0,
        initialPhi: 0,
        maxSpeed: 0,
        maxGForce: 0,
        timeBurnout: 0,
        timeToApogee: 0,
        computerAltimeterApogee: 0,
      },
    },
    countdownChecklist: "64d21300ae223e790ff7fba0", // You can set this based on the specific implementation
  });

  // Load user data from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user data to localStorage whenever user state changes
  useEffect(() => {
    localStorage.setItem("User", JSON.stringify(user));
  }, [user]);

  // new functions
  const login = (newUser) => {
    setUser(newUser);
    localStorage.setItem("User", JSON.stringify(newUser));
    // Do any additional login actions here (like setting a Token, etc.)
  };

  const logout = () => {
    setUser({
      name: "Login",
      email: "",
      role: "",
      team: "",
    });
    localStorage.removeItem("User");
    localStorage.removeItem("Token");
    localStorage.removeItem("flysheetState");
    // Do any additional logout actions here
  };

  return (
    <FlysheetContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        flysheetState,
        setFlysheetState,
        checklists,
        setChecklists,
        flysheets,
        setFlysheets,
      }}
    >
      {children}
    </FlysheetContext.Provider>
  );
};

export default FlysheetProvider;
