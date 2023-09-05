// CalculateModal.jsx
import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Services and Component Imports
import FlysheetContext from "../../contexts/FlysheetContext";

export default function CalculateModal({ flysheetId, onClose }) {
  const { flysheets, setFlysheets } = useContext(FlysheetContext);

  const selectedFlysheet = flysheets.find((fs) => fs._id === flysheetId);
  const prevMass = selectedFlysheet.preFlight.rocketInformation.liftoffMass;

  // Initial state for newMass
  const [newMass, setNewMass] = useState(prevMass);
  const [calculatedSize, setCalculatedSize] = useState(null);

  const prevParachuteSize =
    selectedFlysheet.preFlight.rocketInformation.parachuteAreaBooster;
  const duration = selectedFlysheet.postFlight.avgDuration;
  const apogee = selectedFlysheet.postFlight.contestAltimeterApogee;

  const handleCalculate = () => {
    const newParachuteSize =
      (prevParachuteSize *
        ((newMass / prevMass) * (apogee / (duration - 8.3)) ** 2)) /
      22.652 ** 2;
    console.log("newParachuteSize", newParachuteSize);

    setCalculatedSize(newParachuteSize);
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          New Parachute Size
          {calculatedSize ? `: ${calculatedSize.toFixed(1)} (in²)` : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="newMass">
            <Form.Label>New Mass</Form.Label>
            <Form.Control
              type="text"
              value={newMass}
              onChange={(e) => setNewMass(e.target.value)}
              placeholder="Enter new mass"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCalculate}>
          Calculate
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
