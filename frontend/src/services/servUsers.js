// servUsers.js
import api from "./api";
import axios from "axios";

const BASE_URL = "http://localhost:8000/users"; // replace with your server's URL

export const servSignupStudent = async (studentData) => {
  const token = localStorage.getItem("Token"); // Assuming you store the token in localStorage
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

export async function getStudents() {
  try {
    const token = localStorage.getItem("Token"); // Assuming you store the token in localStorage
    console.log('servAPI getStudents token', token)

    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("getTeamById response", response.data);
    return response.data;
  } catch (error) {
    console.error("error getting students", error.message);
    throw error;
  }
}

// new services

export async function getStudentById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting student:", error);
    throw error;
  }
}

export async function updateStudent(id, updatedStudent) {
  try {
    const token = localStorage.getItem("Token"); // Replace with your actual token key name
    console.log('servAPI createFlysheet token', token)
    // Add the necessary headers, including the Authorization header with the token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    
    const response = await axios.put(`${BASE_URL}/${id}`, updatedStudent, {
      headers: headers, 
    });
    console.log('servAPI updateFlysheet response', response)
    return response.data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
}

export async function deleteStudent(id) {
  console.log('servAPI deleteStudent id', id)
  try {
    const token = localStorage.getItem("Token"); // Replace with your actual token key name
    console.log('servAPI createFlysheet token', token)
    // Add the necessary headers, including the Authorization header with the token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.delete(`${BASE_URL}/${id}`,{
      headers: headers,});
    return response.data;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}