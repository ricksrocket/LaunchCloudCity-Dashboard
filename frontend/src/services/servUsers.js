// servUsers.js
import api from "./api";
import axios from "axios";

const BASE_URL = "http://localhost:8000/users"; // replace with your server's URL

export const servSignupStudent = async (studentData, token) => {
  const response = await api.post("/users/signup", studentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const servLogin = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    if (response.status === 200) {
      return {
        success: true,
        data: response.data, // Assuming the token is in the response data
      };
    } else {
      return {
        success: false,
        message: "Login failed, please check your credentials.",
      };
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
    return {
      success: false,
      message: error.message || "An unknown error occurred.",
    };
  }
};

export async function getTeamById(id) {
  try {
    const token = localStorage.getItem("Token"); // Assuming you store the token in localStorage

    const response = await axios.get(`${BASE_URL}/teams/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("getTeamById response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting team:", error);
    throw error;
  }
}
