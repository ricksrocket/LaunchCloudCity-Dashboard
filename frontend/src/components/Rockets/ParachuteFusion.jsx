import React from "react";
import { useNavigate } from "react-router-dom";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons"; // Import Syncfusion button component

export default function Parachute({ data, handleDelete }) {
  const navigate = useNavigate();
  const { _id, shape, area, reefed, spillHole } = data;

  const handleEditClick = () => {
    navigate(`/parachutes/edit/${_id}`, { state: data });
  };

  return (
    <tr>
      <td>{shape}</td>
      <td>{area}</td>
      <td>{reefed ? "Yes" : "No"}</td>
      <td>{spillHole ? "Yes" : "No"}</td>
      <td>
        <ButtonComponent
          onClick={handleEditClick}
          cssClass="e-small e-round e-primary"
        >
          Edit
        </ButtonComponent>
      </td>
      <td>
        <ButtonComponent
          onClick={() => handleDelete(_id)}
          cssClass="e-small e-round e-danger"
        >
          Delete
        </ButtonComponent>
      </td>
    </tr>
  );
}
