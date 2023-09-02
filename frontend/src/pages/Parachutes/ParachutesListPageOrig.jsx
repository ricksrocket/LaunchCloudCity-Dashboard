// ParachuteList.jsx
import React, { useEffect, useState } from "react";
import Parachute from "../../components/Rockets/Parachute";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { getParachutes, deleteParachute } from "../services/servParachutes";

export default function ParachuteList() {
  const [parachutes, setParachutes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  useEffect(() => {
    // Fetch parachutes from the server using the getParachutes service
    getParachutes()
      .then((response) => {
        if (response.success) {
          setParachutes(response.data);
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching the data.", error);
      });
  }, []);

  const handleDelete = (_id) => {
    // Delete parachute using the deleteParachute service
    deleteParachute(_id)
      .then(() => {
        setParachutes((prevParachutes) =>
          prevParachutes.filter((parachute) => parachute._id !== _id)
        );
      })
      .catch((error) => {
        console.error("An error occurred while deleting the parachute.", error);
      });
  };

  const handleSort = () => {
    const sortedParachutes = [...parachutes].sort((a, b) =>
      sortOrder === "asc" ? a.area - b.area : b.area - a.area
    );
    setParachutes(sortedParachutes);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  return (
    <div>
      <h1>Parachutes List</h1>
      <p>Total number of parachutes: {parachutes.length}</p> {/* Displaying the count here */}
      <Button onClick={handleSort}>
        Sort by Area {sortOrder === "asc" ? "Descending" : "Ascending"}
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Shape</th>
            <th>Area</th>
            <th>Reefed</th>
            <th>Spillhole</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {parachutes.map((parachute) => (
            <Parachute
              key={parachute._id}
              data={parachute}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </Table>
      <div style={{ width: "25%", margin: "auto" }}>
        <Link to="/parachutes/add">
          <Button variant="primary" style={{ width: "100%" }}>
            Add Parachute
          </Button>
        </Link>
      </div>
    </div>
  );
}
