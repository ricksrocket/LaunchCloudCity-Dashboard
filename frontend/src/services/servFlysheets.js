// servFlysheets.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/flysheets"; // replace with your server's URL

export async function createFlysheet(flysheetData) {
  try {
    const token = localStorage.getItem("Token"); // Replace with your actual token key name
    console.log('servAPI createFlysheet token', token)
    // Add the necessary headers, including the Authorization header with the token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(`${BASE_URL}/`, flysheetData, {
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating flysheet:", error.message);
    throw error;
  }
}

export async function getFlysheets() {
  try {
    const token = localStorage.getItem('Token'); // Assuming you store the token in localStorage
    console.log('servAPI token', token)
    const response = await axios.get(`${BASE_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('serv response', response.data)
    return response.data;
  } catch (error) {
    console.error("Error getting flysheets:", error);
    throw error;
  }
}

export async function getFlysheetById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting flysheet:", error);
    throw error;
  }
}

export async function updateFlysheet(id, flysheetData) {
  try {
    const token = localStorage.getItem("Token"); // Replace with your actual token key name
    console.log('servAPI createFlysheet token', token)
    // Add the necessary headers, including the Authorization header with the token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    
    const response = await axios.put(`${BASE_URL}/${id}`, flysheetData, {
      headers: headers, 
    });
    console.log('servAPI updateFlysheet response', response)
    return response.data;
  } catch (error) {
    console.error("Error updating flysheet:", error);
    throw error;
  }
}

export async function deleteFlysheet(id) {
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
    console.error("Error deleting flysheet:", error);
    throw error;
  }
}

// ...add more functions for updating and deleting flysheets as needed

// Weather API

export async function getWeather() {
  try {
    const token = localStorage.getItem('Token'); // Assuming you store the token in localStorage
    const response = await axios.get(`${BASE_URL}/weather/41.0076/-91.973419`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting weather:", error);
    throw error;
  }
}
