// ParachuteList.jsx
import React, { useEffect, useState } from "react";
// import Parachute from "../../components/Rockets/Parachute";
import { Inject, GridComponent, ColumnDirective, ColumnsDirective, Sort, Page } from "@syncfusion/ej2-react-grids";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons"; // Import Syncfusion button component
import { Link } from "react-router-dom";
import { getParachutes, deleteParachute } from '../../services/servParachutes';

export default function ParachuteListPage() {
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
      <p>Total number of parachutes: {parachutes.length}</p>
      <ButtonComponent onClick={handleSort} cssClass="e-primary e-small">
        Sort by Area {sortOrder === "asc" ? "Descending" : "Ascending"}
      </ButtonComponent>
      <GridComponent dataSource={parachutes} cssClass="e-striped e-bordered e-hover"  allowSorting={true} allowPaging={true}>
        <ColumnsDirective>
          <ColumnDirective field="shape" headerText="Shape" />
          <ColumnDirective field="area" headerText="Area" />
          <ColumnDirective field="reefed" headerText="Reefed" />
          <ColumnDirective field="spillHole" headerText="Spillhole" />
          <ColumnDirective headerText="Edit" template="<button class='e-btn e-flat' onclick='handleEditClick(data._id)'>Edit</button>" />
          <ColumnDirective headerText="Delete" template="<button class='e-btn e-flat' onclick='handleDelete(data._id)'>Delete</button>" />
        </ColumnsDirective>
        <Inject services={[Sort, Page]} /> {/* Inject the Sort and Page services */}
      </GridComponent>
      <div style={{ width: "25%", margin: "auto" }}>
        <Link to="/parachutes/add">
          <ButtonComponent variant="e-primary" cssClass="e-small" style={{ width: "100%" }}>
            Add Parachute
          </ButtonComponent>
        </Link>
      </div>
    </div>
  );
}
