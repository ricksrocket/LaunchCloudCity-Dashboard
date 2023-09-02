// ParachuteList.jsx
import React, { useEffect, useState } from "react";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
// import Parachute from "../../components/Rockets/Parachute";
import {
  Inject,
  Edit,
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Sort,
  Page,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons"; // Import Syncfusion button component
import { Link } from "react-router-dom";
import { getParachutes, deleteParachute } from "../../services/servParachutes";

export default function ParachuteListPage() {
  const [parachutes, setParachutes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  // table settings
  const editOptions = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
  };
  const toolbarOptions = ["Add", "Edit", "Delete", "Update", "Cancel"];

  // create new DataManager object
  // Configure the DataManager with the appropriate URLs
  const baseUrl = "http://localhost:8000/flights";
  const data = new DataManager({
    adaptor: new UrlAdaptor(),
    url: `${baseUrl}/parachutes`, // Change this to match your API endpoint
    insertUrl: `${baseUrl}/parachutes`, // Update this URL as per your API requirements
    removeUrl: (parachute) => `${baseUrl}/parachutes/${parachute._id}`, // Include _id in the URL
    updateUrl: (parachute) => `${baseUrl}/parachutes/${parachute._id}`, // Include _id in the URL
  });

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
      <GridComponent
        dataSource={data}
        cssClass="e-striped e-bordered e-hover"
        allowSorting={true}
        allowPaging={true}
        editSettings={editOptions}
        toolbar={toolbarOptions}
        pageSettings={{ pageSize: 5 }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="_id"
            headerText="ID"
            isPrimaryKey={true}
            visible={false}
          />
          <ColumnDirective field="shape" headerText="Shape" />
          <ColumnDirective field="area" headerText="Area" />
          <ColumnDirective field="reefed" headerText="Reefed" />
          <ColumnDirective field="spillHole" headerText="Spillhole" />
        </ColumnsDirective>
        <Inject services={[Sort, Edit, Page, Toolbar]} />{" "}
        {/* Inject the Sort and Page services */}
      </GridComponent>
      <div style={{ width: "25%", margin: "auto" }}>
        <Link to="/parachutes/add">
          <ButtonComponent
            variant="e-primary"
            cssClass="e-small"
            style={{ width: "100%" }}
          >
            Add Parachute
          </ButtonComponent>
        </Link>
      </div>
    </div>
  );
}
