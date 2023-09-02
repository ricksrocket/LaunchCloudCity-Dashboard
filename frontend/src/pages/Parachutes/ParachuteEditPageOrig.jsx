// ParachuteEditPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getParachuteById, updateParachute } from "../services/servParachutes";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";

export default function ParachuteEditPage() {
  const { id } = useParams();
  console.log("routeId", id);
  const navigate = useNavigate();


  const location = useLocation();
  const parachuteFromState = location.state;

  const [parachute, setParachute] = useState(
    parachuteFromState || {
      shape: "",
      area: 0,
      reefed: false,
      spillHole: false,
    }
  );

  useEffect(() => {
    getParachuteById(id).then((response) => {
      if (response.success) {
        setParachute(response.data);
      }
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParachute({
      ...parachute,
      [name]: name === "area" ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateParachute(id, parachute).then((response) => {
      if (response.success) {
        navigate("/parachutes"); // Redirect to the list of parachutes
      }
    });
  };

  return (
    <div>
        <h2>Edit Parachute</h2>
            <Form onSubmit={handleSubmit}>
      <Form.Group controlId="shape">
        <Form.Label>Shape</Form.Label>
        <Form.Control
          type="text"
          name="shape"
          value={parachute.shape}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="area">
        <Form.Label>Area</Form.Label>
        <Form.Control
          type="number"
          name="area"
          value={parachute.area}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="reefed">
        <Form.Check
          type="checkbox"
          label="Reefed"
          name="reefed"
          checked={parachute.reefed}
          onChange={(e) =>
            setParachute({ ...parachute, reefed: e.target.checked })
          }
        />
      </Form.Group>
      <Form.Group controlId="spillHole">
        <Form.Check
          type="checkbox"
          label="Spill Hole"
          name="spillHole"
          checked={parachute.spillHole}
          onChange={(e) =>
            setParachute({ ...parachute, spillHole: e.target.checked })
          }
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Save Changes
      </Button>
    </Form>
    </div>

  );
}
