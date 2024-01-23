import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ObjectionModal = ({ show, handleClose, handleObjectionSubmit }) => {
  const [reason, setReason] = useState("");

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = () => {
    handleObjectionSubmit(reason);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Objection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="reasonForObjection">
            <Form.Label>Reason for Loan Rejection</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter reason"
              value={reason}
              onChange={handleReasonChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          varient="secondry"
          style={{ color: "white" }}
          onClick={handleClose}
        >
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ObjectionModal;
