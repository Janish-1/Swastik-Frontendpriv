import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "tailwindcss/tailwind.css"; // Import Tailwind CSS styles


export default function NewMember() {
  const [showModal, setShowModal] = useState(false);

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle form submission here
    handleModalClose();
  };

  return (
    <>
      <Button onClick={handleModalShow}>Add New Member</Button>

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>New Member Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formBranch">
                  <Form.Label>Branch</Form.Label>
                  <Form.Control type="text" placeholder="Enter branch" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formPhoto">
                  <Form.Label>Photo (Browse file)</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formFullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter full name" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formFatherName">
                  <Form.Label>Father Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter father's name" />
                </Form.Group>
              </Col>
            </Row>

            {/* Gender and Marital Status */}
            <Row className="mb-3">
              <Form.Label column md={3}>
                Gender
              </Form.Label>
              <Form.Group as={Row} controlId="formGender">
                <Col md={9}>
                  <div className="d-flex md:space-x-10">
                    <Form.Check
                      type="radio"
                      label="Male"
                      name="formGender"
                      id="genderMale"
                    />
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="formGender"
                      id="genderFemale"
                    />
                    <Form.Check
                      type="radio"
                      label="Others"
                      name="formGender"
                      id="genderOthers"
                    />
                  </div>
                </Col>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formMaritalStatus">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Control as="select">
                    <option>Select Marital Status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDOB">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>

            {/* Date of Birth and Address */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Current Address</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formPermanentAddress">
                  <Form.Label>Permanent Address</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
              </Col>
            </Row>

            {/* Permanent Address and WhatsApp Number */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formWhatsappNo">
                  <Form.Label>WhatsApp No.</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter WhatsApp number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formIdProof">
                  <Form.Label>
                    ID Proof (Aadhar, Passport, Electricity Bill)
                  </Form.Label>
                  <Form.Control type="file" multiple />
                </Form.Group>
              </Col>
            </Row>

            <br></br>
            {/* HR Section */}
            <hr />

            {/* Nominee Details */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNomineeName">
                  <Form.Label>Nominee Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter nominee name" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formRelationship">
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control type="text" placeholder="Enter relationship" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNomineeMobile">
                  <Form.Label>Nominee Mobile No.</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter nominee mobile number"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formNomineeDOB">
                  <Form.Label>Nominee Date of Birth</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>
            <br></br>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
