// servChecklists.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/flights"; // Replace with your server's URL

export async function createChecklist(checklistData) {
  try {
    const token = localStorage.getItem("Token"); // Replace with your actual token key name

    // Add the necessary headers, including the Authorization header with the token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(`${BASE_URL}/checklists`, checklistData, {
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating checklist:", error);
    throw error;
  }
}

export async function getChecklists() {
  try {
    const token = localStorage.getItem("Token"); // Assuming you store the token in localStorage

    const response = await axios.get(`${BASE_URL}/checklists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting checklists:", error);
    throw error;
  }
}

export async function getChecklistById(id) {
  try {
    const token = localStorage.getItem("Token"); // Assuming you store the token in localStorage

    const response = await axios.get(`${BASE_URL}/checklists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting checklist:", error);
    throw error;
  }
}

export async function updateChecklistById(id, checklistData) {
  try {
    console.log ('updateChecklistById',id, checklistData)
    const token = localStorage.getItem("Token"); // Assuming you store the token in localStorage

    const response = await axios.put(`${BASE_URL}/checklists/${id}`, checklistData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating checklist:", error);
    throw error;
  }
}

export async function deleteChecklist(id) {
  try {
    const token = localStorage.getItem("Token"); // Assuming you store the token in localStorage

    const response = await axios.delete(`${BASE_URL}/checklists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting checklist:", error);
    throw error;
  }
}

// ...add more functions for updating and deleting checklists as needed
