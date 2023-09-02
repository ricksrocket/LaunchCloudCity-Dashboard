// servParachutes.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/flights"; // replace with your server's URL

export async function createParachute(parachuteData) {
  try {
    const response = await axios.post(`${BASE_URL}/parachutes/insert`, parachuteData);
    return response.data;
  } catch (error) {
    console.error("Error creating parachute:", error);
    throw error;
  }
}

export async function getParachutes() {
  try {
    const response = await axios.get(`${BASE_URL}/parachutes`);
    return response.data;
  } catch (error) {
    console.error("Error getting parachutes:", error);
    throw error;
  }
}

export async function getParachuteById(id) {
  try {
    console.log('receiving id', id)
    const response = await axios.get(`${BASE_URL}/parachutes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting parachute:", error);
    throw error;
  }
}

export async function updateParachute(id, parachuteData) {
  try {
    const response = await axios.put(
      `${BASE_URL}/parachutes/${id}`,
      parachuteData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating parachute:", error);
    throw error;
  }
}

export async function deleteParachute(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/parachutes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting parachute:", error);
    throw error;
  }
}

// ...add more functions for updating and deleting parachutes as needed
