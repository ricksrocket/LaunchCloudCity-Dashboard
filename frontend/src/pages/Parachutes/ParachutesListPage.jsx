// ParachuteList.jsx
import React, { useEffect, useState } from "react";
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
import {
  getParachutes,
  createParachute,
  updateParachute,
  deleteParachute,
} from "../../services/servParachutes";

export default function ParachuteListPage() {
  const [parachutes, setParachutes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  // Fetch parachutes from the server using the getParachutes service
  useEffect(() => {
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

  // table settings
  const editOptions = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
  };
  const toolbarOptions = ["Add", "Edit", "Delete", "Update", "Cancel"];

  // Functions to handle the actions performed on the table
  function handleAddParachute(parachuteData) {
    // Create a new parachute using the createParachute service
    createParachute(parachuteData)
      .then((response) => {
        if (response.success) {
          setParachutes((prevParachutes) => [...prevParachutes, response.data]);
        }
      })
      .catch((error) => {
        console.error("An error occurred while creating the parachute.", error);
      });
  }

  const handleUpdateParachute = (_id, newParachuteData) => {
    // Update parachute using the updateParachute service
    updateParachute(_id, newParachuteData)
      .then((response) => {
        if (response.success) {
          setParachutes((prevParachutes) =>
            prevParachutes.map((parachute) =>
              parachute._id === response.data._id ? response.data : parachute
            )
          );
        }
      })
      .catch((error) => {
        console.error("An error occurred while updating the parachute.", error);
      });
  };

  const handleDeleteParachute = (_id) => {
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

  // handle changes performed on the table
  function handleActionComplete(args) {
    if (args.action === "add") {
      handleAddParachute(args.data);
    } else if (args.action === "edit") {
      handleUpdateParachute(args.data._id, args.data);
    } else if (args.requestType === "delete") {
      handleDeleteParachute(args.data[0]._id);
    }
  }

  return (
    <div>
      <h1>Parachutes List</h1>
      <p>Total number of parachutes: {parachutes.length}</p>
      <ButtonComponent onClick={handleSort} cssClass="e-primary e-small">
        Sort by Area {sortOrder === "asc" ? "Descending" : "Ascending"}
      </ButtonComponent>
      <GridComponent
        dataSource={parachutes}
        actionComplete={handleActionComplete}
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
