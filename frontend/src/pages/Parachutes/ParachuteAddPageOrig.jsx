import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createParachute } from "../services/servParachutes";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ParachuteAddPage() {
  const navigate = useNavigate();
  const [parachute, setParachute] = useState({
    shape: "",
    area: 0,
    reefed: false,
    spillHole: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParachute({
      ...parachute,
      [name]: name === "area" ? Number(value) : value,
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    createParachute(parachute).then((response) => {
      if (response.success) {
        navigate("/parachutes"); // Redirect to the list of parachutes
      }
    });
  };

  return (
    <div>
      <h2>Add a Parachute</h2>
      <Form onSubmit={handleAdd}>
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
          Add Parachute
        </Button>
      </Form>
    </div>
  );
}
