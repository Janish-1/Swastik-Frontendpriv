import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function AgentForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [memberNumbers, setmemberNumbers] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [formData, setFormData] = useState({
    memberNo: 0,
    name: "",
    qualification: "",
    image: null,
    photo: null,
    fatherName: "",
    maritalStatus: "",
    dob: "",
    age: "",
    aadhar: "",
    panCard: "",
    address: "",
    permanentAddress: "",
    email: "",
    mobile: "",
    nomineeName: "",
    nomineeRelationship: "",
    nomineeDob: "",
    nomineeMobile: "",
    password: "",
    branchName: "",
  });

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "image" || name === "photo" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    // Handle form submission logic here
    // console.log(formData);

    e.preventDefault();
    try {
      const formDataWithImages = new FormData();
      formDataWithImages.append("images", formData.image);
      formDataWithImages.append("images", formData.photo);

      const responseUpload = await axios.post(
        `${API_BASE_URL}/uploadmultiple`,
        formDataWithImages,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrls = {
        imageUrl1: responseUpload.data.urls[0], // Adjust index based on your response structure
        imageUrl2: responseUpload.data.urls[1], // Adjust index based on your response structure
      };

      await axios.post(`${API_BASE_URL}/createagent`, {
        ...formData,
        image: imageUrls.imageUrl1,
        photo: imageUrls.imageUrl2,
      });

      // Reset form data and close modal
      setFormData({
        memberNo: 0,
        name: "",
        qualification: "",
        image: null,
        photo: null,
        fatherName: "",
        maritalStatus: "",
        dob: "",
        age: "",
        aadhar: "",
        panCard: "",
        address: "",
        permanentAddress: "",
        email: "",
        mobile: "",
        nomineeName: "",
        nomineeRelationship: "",
        nomineeDob: "",
        nomineeMobile: "",
        password: "",
        branchName: "",
      });
      handleCloseModal();
    } catch (error) {
      // Handle Error
    }
  };

    // Function to fetch user data from the backend
    const fetchData = async () => {
      try {  
        const membersResponse = await axios.get(`${API_BASE_URL}/loanmembers`);
        const memberNumbers = membersResponse.data.data;
        setmemberNumbers(memberNumbers);
        const branchNamesResponse = await axios.get(
          `${API_BASE_URL}/branches/names`
        );
        setBranchNames(branchNamesResponse.data.data);  
        } catch (error) {
        // // console.error('Error fetching users:', error);
        // Handle error or display an error message to the user
      }
    };
  
    useEffect(() => {
      // Call the function to fetch user data when the component mounts
      fetchData();
    }, []); // Run once on component mount  

  return (
    <div>
      <Button onClick={handleOpenModal}>Add Agent</Button>

      <Modal show={modalOpen} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Row className="mb-3">
            <Col md={6}>
            <Form.Group controlId="formMemberNo">
              <Form.Label>Member No</Form.Label>
              <Form.Control
                as="select"
                name="memberNo"
                value={formData.memberNo}
                onChange={handleChange}
              >
                <option value="">Select Member No</option>
                {memberNumbers.map((memberNo) => (
                  <option key={memberNo} value={memberNo}>
                    {memberNo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group controlId="formBranch">
                  <Form.Label>Branch</Form.Label>
                  <Form.Control
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    as="select"
                  >
                    <option value="">Select Branch</option>
                    {branchNames.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>{" "}
              </Col>
            </Row>
            {/* Form Fields */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formname">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formQualification">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formImage">
                  <Form.Label>Upload Marksheet</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formPhoto">
                  <Form.Label>Choose Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formFatherName">
                  <Form.Label>Father's Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="formMaritalStatus">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                  ><option value="">Please Select an Option</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="married">Widowed</option>
                    <option value="married">Divorced</option>
                    {/* Add other options as needed */}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="formDob">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="formAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formPanCard">
                  <Form.Label>Pan Card</Form.Label>
                  <Form.Control
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formAadhar">
                  <Form.Label>Aadhar</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3"></Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formPermanentAddress">
                  <Form.Label>Permanent Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formpassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <br></br>
            <hr />
            <hr />
            {/* Nominee Details */}
            <br></br>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNomineeName">
                  <Form.Label>Nominee Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="nomineeName"
                    value={formData.nomineeName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formNomineeRelationship">
                  <Form.Label>Nominee Relationship</Form.Label>
                  <Form.Control
                    type="text"
                    name="nomineeRelationship"
                    value={formData.nomineeRelationship}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNomineeDob">
                  <Form.Label>Nominee Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="nomineeDob"
                    value={formData.nomineeDob}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formNomineeMobile">
                  <Form.Label>Nominee Mobile</Form.Label>
                  <Form.Control
                    type="tel"
                    name="nomineeMobile"
                    value={formData.nomineeMobile}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Buttons */}
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button className="mx-2" variant="info" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}