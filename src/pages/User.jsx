import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Badge, Row, Col } from "react-bootstrap";
import AgentForm from "./AgentForm";
import { FaEdit, FaTrash } from "react-icons/fa";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// // console.log("Api URL:", API_BASE_URL);

const User = () => {
  const [showModal, setShowModal] = useState(false);
  const [userRoleu, setUserRole] = useState("");
  const [memberNumbers, setmemberNumbers] = useState([]);
  const [showeditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [branchNames, setBranchNames] = useState([]);
  const [formData, setFormData] = useState({
    memberNo: 0,
    name: "",
    email: "",
    password: "",
    userType: "",
    // status: "",
    image: null,
  });
  const [updated, setupdatedFormData] = useState({
    memberNo: 0,
    name: "",
    email: "",
    password: "",
    userType: "",
    // status: "",
    image: null,
  });
  const [agentModalopen, setagentmodalopen] = useState(false);
  const [agentformdata, setagentForm] = useState({
    agentId: 0,
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

  const handleEditAgent = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all-users/${id}`);
      const agentdata = response.data;
      // console.log(agentdata);
      // Set the fetched data with image URLs into the state
      setagentForm({
        ...agentdata,
        // Assuming 'image' and 'photo' are fields containing image URLs
        agentId: id,
        image: null,
        photo: null,
      });

      setagentmodalopen(true);
    } catch (error) {
      // console.error("Error fetching user details:", error);
      // Handle the error, such as displaying an error message to the user
    }
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setagentForm({
      ...agentformdata,
      [name]: files[0],
    });
  };

  const handleFileChangeu = (event) => {
    const { name, files } = event.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const agentmodalclose = () => {
    // Reset form data and close modal
    setagentForm({
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
    setagentmodalopen(false);
  };

  const handleagentSubmit = async () => {
    try {
      let updatedAgentData = { ...agentformdata }; // Create a copy of agentformdata

      if (agentformdata.image) {
        const imageFormData = new FormData();
        imageFormData.append("imageone", agentformdata.image);

        const responseImage = await axios.post(
          `${API_BASE_URL}/uploadimage`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (responseImage.status === 200) {
          updatedAgentData.image = responseImage.data.url; // Update the URL in updatedAgentData
        } else {
          throw new Error("Image upload failed");
        }
      }

      if (agentformdata.photo) {
        const photoFormData = new FormData();
        photoFormData.append("imageone", agentformdata.photo);

        const responsePhoto = await axios.post(
          `${API_BASE_URL}/uploadimage`,
          photoFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (responsePhoto.status === 200) {
          updatedAgentData.photo = responsePhoto.data.url; // Update the URL in updatedAgentData
        } else {
          throw new Error("Photo upload failed");
        }
      }

      const agentId = agentformdata.agentId;
      // Data Correctly Coming
      // console.log("Agent Data: ", updatedAgentData);
      const updateResponse = await axios.put(
        `${API_BASE_URL}/updateagent/${agentId}`,
        updatedAgentData // Send updatedAgentData to update the agent details
      );

      if (updateResponse.status === 200) {
        // Update successful, perform any necessary actions
        fetchData(); // Refresh data or update UI after successful update
        agentmodalclose(); // Close the modal or perform relevant action
        window.alert("Agent updated successfully");
      } else {
        throw new Error("Agent update failed");
      }
    } catch (error) {
      // Handle Error
      console.error("Error:", error);
      window.alert("Failed to update agent. Please try again.");
      // Perform error handling like displaying an error message
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setagentForm((prevData) => {
      const updatedData = { ...prevData };

      if (name === "image" || name === "photo") {
        // Check if files array is not empty and update the image/photo property
        updatedData[name] = files.length > 0 ? files[0] : null;
      } else {
        updatedData[name] = value;
      }

      return updatedData;
    });
  };

  const handleEditModalOpen = async (userId) => {
    setEditUserId(userId);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/usersdetails/${userId}`
      );
      const userData = response.data;

      setupdatedFormData({
        memberNo: userData.memberNo,
        name: userData.name,
        email: userData.email,
        password: userData.password, // Assuming you don't want to pre-fill password in the form for security reasons
        userType: userData.userType,
        // status: userData.status,
        image: null, // Reset image in the form
      });
      setShowEditModal(true);
    } catch (error) {
      // // console.error('Error fetching user data for edit:', error);
      // Handle error or display an error message to the user
    }
  };

  const handleCloseeditModal = () => {
    setShowEditModal(false);
    // Reset formData when closing the modal
    setFormData({
      memberNo: "",
      name: "",
      email: "",
      password: "",
      userType: "",
      // status: "",
      image: null,
      memberNo: 0,
    });
  };

  const [usersData, setUsersData] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      let updatedForm = { ...updated };

      if (updated.image) {
        const imageFormData = new FormData();
        imageFormData.append("imageone", updated.image);

        try {
          const responseImage = await axios.post(
            `${API_BASE_URL}/uploadimage`,
            imageFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (responseImage.status === 200) {
            updatedForm = {
              ...updatedForm,
              image: responseImage.data.url,
            };
          } else {
            // Handle image upload failure
            window.alert("Failed to upload image. Please try again.");
            return; // Stop execution if image upload fails
          }
        } catch (imageUploadError) {
          // Handle image upload error
          window.alert("Failed to upload image. Please try again.");
          return; // Stop execution if image upload errors
        }
      }

      const response = await axios.put(
        `${API_BASE_URL}/updateintuser/${editUserId}`,
        updatedForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success or failure using alerts
      if (response.data.success) {
        window.alert("User profile updated successfully");
      } else {
        window.alert("Failed to update user profile. Please try again.");
      }

      handleCloseeditModal();
      fetchData();
    } catch (error) {
      // Handle error
      console.error("Error:", error);
      window.alert("An error occurred. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setupdatedFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setupdatedFormData((prevData) => ({
      ...prevData,
      image: imageFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataForApi = new FormData();
    formDataForApi.append("memberNo", formData.memberNo);
    formDataForApi.append("name", formData.name);
    formDataForApi.append("email", formData.email);
    formDataForApi.append("password", formData.password);
    formDataForApi.append("userType", formData.userType);
    formDataForApi.append("image", formData.image);

    try {
      const responseUpload = await axios.post(
        `${API_BASE_URL}/upload`,
        formDataForApi,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = responseUpload.data.url;

      const responseCreateUser = await axios.post(`${API_BASE_URL}/users`, {
        memberNo: formData.memberNo,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        imageUrl: imageUrl, // Send the received image URL to the backend
      });

      // Show success alert
      window.alert("User created successfully");

      // Clear form data and perform necessary actions after successful submission
      setFormData({
        memberNo: "",
        name: "",
        email: "",
        password: "",
        userType: "",
        image: null,
      });
      handleCloseModal();
      fetchData();
    } catch (error) {
      // Show error alert
      window.alert("Failed to create user. Please try again.");

      // Handle error or display an error message to the user
      // console.error("Error:", error);
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const tokenParts = token.split(".");
      const encodedPayload = tokenParts[1];
      const decodedPayload = atob(encodedPayload);
      const payload = JSON.parse(decodedPayload);
      const urole = payload.role; // Extract user role from the token payload
      setUserRole(urole);

      try {
        if (urole === "admin") {
          const response = await axios.get(`${API_BASE_URL}/api/users`);
          const filteredUsers = response.data.filter((user) =>
            ["user", "agent", "admin"].includes(user.userType)
          );
          setUsersData(filteredUsers);
        } else if (urole === "manager") {
          const x = payload.db;
          const parts = x.split("_");
          if (parts.length > 1) {
            const objectIdPart = parts[1];
            const response = await axios.get(
              `${API_BASE_URL}/branch-users/${objectIdPart}`
            );
            setUsersData(response.data.users);
          }
        }

        const branchNamesResponse = await axios.get(
          `${API_BASE_URL}/branches/names`
        );
        setBranchNames(branchNamesResponse.data.data);

        const membersResponse = await axios.get(`${API_BASE_URL}/loanmembers`);
        const memberNumbers = membersResponse.data.data;
        setmemberNumbers(memberNumbers);
      } catch (error) {
        // Handle error or display an error message to the user
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once on component mount

  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/users/${userId}`
        );

        // Show success alert for delete
        window.alert("User successfully deleted");

        fetchData();
      } catch (error) {
        // Handle error
        console.error("Error:", error);

        // Show error alert for delete
        window.alert("Failed to delete user. Please try again.");
      }
    } else {
      // User canceled the deletion
      // Optionally provide feedback to the user
      window.alert("Deletion canceled");
    }
  };

  return (
    <div className="body-div">
      <div className="h-30 grid grid-cols-7 gap-3 content-start">
        <Button onClick={handleOpenModal}>Add User</Button>
        <AgentForm onFormSubmit={fetchData} />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formMemberNo">
              <Form.Label>Member No</Form.Label>
              <Form.Control
                as="select"
                name="memberNo"
                value={formData.memberNo}
                onChange={handleInputChange}
              >
                <option value="">Select Member No</option>
                {memberNumbers.map((memberNo) => (
                  <option key={memberNo} value={memberNo}>
                    {memberNo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserType">
              <Form.Label>User Type</Form.Label>
              <Form.Control
                as="select"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select User Type</option>
                {/* <option value="user">User</option> */}
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            {/* <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Control>
            </Form.Group> */}

            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChangeu}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showeditModal} onHide={handleCloseeditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group controlId="formMemberNo">
              <Form.Label>Member No</Form.Label>
              <Form.Control
                name="memberNo"
                value={updated.memberNo}
                onChange={handleUpdateChange}
                readOnly
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={updated.name}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={updated.email}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={updated.password}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserType">
              <Form.Label>User Type</Form.Label>
              <Form.Control
                as="select"
                name="userType"
                value={updated.userType}
                onChange={handleUpdateChange}
                required
              >
                <option value="">Select User Type</option>
                {/* <option value="user">user</option> */}
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            {/* <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Control>
            </Form.Group> */}

            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChangeu}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={agentModalopen} onHide={agentmodalclose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleagentSubmit}>
            {/* Form Fields */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formMemberNo">
                  <Form.Label>Member No</Form.Label>
                  <Form.Control
                    name="memberNo"
                    value={agentformdata.memberNo}
                    onChange={handleInputChange}
                    readOnly
                  ></Form.Control>
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
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formname">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={agentformdata.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    value={agentformdata.mobile}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={10}
                  />
                  {agentformdata.mobile &&
                    agentformdata.mobile.length !== 10 && (
                      <Form.Text className="text-danger">
                        Phone number must be 10 digits.
                      </Form.Text>
                    )}
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
                    value={agentformdata.qualification}
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
                    onChange={handleFileChange}
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
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formFatherName">
                  <Form.Label>Father's Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fatherName"
                    value={agentformdata.fatherName}
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
                    value={agentformdata.maritalStatus}
                    onChange={handleChange}
                  >
                    <option value="">Please Select an Option</option>
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
                    value={agentformdata.dob}
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
                    value={agentformdata.age}
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
                    value={agentformdata.panCard}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={10}
                  />
                  {agentformdata.panCard &&
                    agentformdata.panCard.length !== 10 && (
                      <Form.Text className="text-danger">
                        PAN Card must be 10 digits.
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formAadhar">
                  <Form.Label>Aadhar</Form.Label>
                  <Form.Control
                    type="integer"
                    name="aadhar"
                    value={agentformdata.aadhar}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={10}
                  />
                  {agentformdata.aadhar &&
                    agentformdata.aadhar.length !== 12 && (
                      <Form.Text className="text-danger">
                        Aadhar Card Number must be 12 digits.
                      </Form.Text>
                    )}
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
                    value={agentformdata.address}
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
                    value={agentformdata.permanentAddress}
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
                    value={agentformdata.email}
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
                    value={agentformdata.password}
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
                    value={agentformdata.nomineeName}
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
                    value={agentformdata.nomineeRelationship}
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
                    value={agentformdata.nomineeDob}
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
                    value={agentformdata.nomineeMobile}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={10}
                  />
                  {agentformdata.nomineeMobile &&
                    agentformdata.nomineeMobile.length !== 10 && (
                      <Form.Text className="text-danger">
                        Nominee's phone number must be 10 digits.
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>
            </Row>

            {/* Buttons */}
            <Button variant="primary" onClick={handleagentSubmit}>
              Submit
            </Button>
            <Button className="mx-2" variant="info" onClick={agentmodalclose}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Table striped bordered hover className="mt-4 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            {/* <th>Status</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user, index) => (
            <tr key={index}>
              <td>
                {user.userType === "user" || user.userType === "admin" ? (
                  // Display user or admin photo
                  <>
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        width="40"
                        height="40"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite fallback loop
                          // You can also handle error messages or styling here
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </>
                ) : (
                  // Display a default image for other roles
                  <img
                    src={user.photo} // Replace with the path to your default image
                    alt="Default"
                    width="40"
                    height="40"
                  />
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              {/* <td>
                <Badge
                  variant={user.status === "active" ? "success" : "danger"}
                >
                  {user.status}
                </Badge>
              </td> */}
              <td>
                {user.userType === "agent" ? (
                  <Button
                    variant="primary"
                    onClick={() => handleEditAgent(user._id)}
                  >
                    <FaEdit />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => handleEditModalOpen(user._id)}
                  >
                    <FaEdit />
                  </Button>
                )}
                <Button variant="danger" onClick={() => handleDelete(user._id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default User;
