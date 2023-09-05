// UsersListPage.jsx
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
  getStudents,
  servSignupStudent,
  updateStudent,
  deleteStudent,
} from "../services/servUsers";

const sampleStudent = {
  _id: "64c65d41289d63ae707e8dda",
  name: "richard",
  email: "richard@miu.edu",
  password: "$2b$08$4J/q9EFyNwYzqVWCFdF3LeI/gBlTilVFQ7Y40ToDueeWtyWio3arK",
  role: "admin",
  __v: 0,
};

export default function UsersListPage() {
  const [students, setStudents] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  // Fetch students from the server using the getStudents service
  useEffect(() => {
    getStudents()
      .then((response) => {
        if (response.success) {
          setStudents(response.data);
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
  function handleAddStudent(studentData) {
    // Create a new student using the servSignupStudent service
    servSignupStudent(studentData)
      .then((response) => {
        console.log("response", response);
        if (response.success) {
          setStudents((prevStudents) => [...prevStudents, response.data]);
        }
      })
      .catch((error) => {
        console.error("An error occurred while creating the student.", error);
      });
  }

  const handleUpdateStudent = (_id, newstudentData) => {
    // Update student using the updateStudent service
    updateStudent(_id, newstudentData)
      .then((response) => {
        if (response.success) {
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === response.data._id ? response.data : student
            )
          );
        }
      })
      .catch((error) => {
        console.error("An error occurred while updating the student.", error);
      });
  };

  const handleDeleteStudent = (_id) => {
    // Delete student using the deleteStudent service
    deleteStudent(_id)
      .then((response) => {
        console.log("delete response", response);
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== _id)
        );
      })
      .catch((error) => {
        console.error("An error occurred while deleting the student.", error);
      });
  };

  const handleSort = () => {
    const sortedstudents = [...students].sort((a, b) =>
      sortOrder === "asc" ? a.area - b.area : b.area - a.area
    );
    setStudents(sortedstudents);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  // handle changes performed on the table
  function handleActionComplete(args) {
    if (args.action === "add") {
      handleAddStudent(args.data);
    } else if (args.action === "edit") {
      handleUpdateStudent(args.data._id, args.data);
    } else if (args.requestType === "delete") {
      handleDeleteStudent(args.data[0]._id);
    }
  }

  return (
    <div>
      <h1>students List</h1>
      <p>Total number of students: {students.length}</p>
      <GridComponent
        dataSource={students}
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
          <ColumnDirective field="name" headerText="Name" />
          <ColumnDirective field="email" headerText="email" />
          <ColumnDirective field="password" headerText="password" />
          <ColumnDirective field="role" headerText="role" />
          <ColumnDirective field="team" headerText="team" />
        </ColumnsDirective>
        <Inject services={[Sort, Edit, Page, Toolbar]} />{" "}
        {/* Inject the Sort and Page services */}
      </GridComponent>
      <div style={{ width: "25%", margin: "auto" }}>
        <Link to="/students/add">
          <ButtonComponent
            variant="e-primary"
            cssClass="e-small"
            style={{ width: "100%" }}
          >
            Add Student
          </ButtonComponent>
        </Link>
      </div>
    </div>
  );
}
