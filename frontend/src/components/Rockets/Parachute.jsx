// Parachute.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Parachute({ data, handleDelete }) {
  const navigate = useNavigate();
  const { _id, shape, area, reefed, spillHole } = data;

  return (
    <tr>
      <td>{shape}</td>
      <td>{area}</td>
      <td>{reefed ? 'Yes' : 'No'}</td>
      <td>{spillHole ? 'Yes' : 'No'}</td>
      <td>
        <button
          onClick={() => navigate(`/parachutes/edit/${_id}`, { state: data })}
          className="btn btn-primary"
        >
          Edit
        </button>
      </td>
      <td>
        <button onClick={() => handleDelete(_id)} className="btn btn-danger">
          Delete
        </button>
      </td>
    </tr>
  );
}
