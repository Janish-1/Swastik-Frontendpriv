import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Badge, Row, Col } from "react-bootstrap";
import AgentForm from "./AgentForm";
import { FaEdit, FaTrash } from "react-icons/fa";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const User = () => {
  const [showModal, setShowModal] = useState(false);
  const [showeditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
    // status: "",
    image: null,
  });
  const [agentModalopen, setagentmodalopen] = useState(false);
  const [agentformdata, setagentForm] = useState({
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
  });

  const handleEditAgent = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all-users/${id}`);
      const agentdata = response.data;
  
      // Set the fetched data with image URLs into the state
      setagentForm({
        ...agentdata,
        // Assuming 'image' and 'photo' are fields containing image URLs
        image: agentdata.image || '', 
        photo: agentdata.photo || '', 
      });
  
      setagentmodalopen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Handle the error, such as displaying an error message to the user
    }
  };

  const agentmodalclose = () => {
    setagentmodalopen(false);
  };

  const handleagentSubmit = async () => {
    try {
      const formDataWithImages = new FormData();

      console.log(agentformdata);
  
      if (agentformdata.image) {
        formDataWithImages.append("images", agentformdata.image);
      }
  
      if (agentformdata.photo) {
        formDataWithImages.append("images", agentformdata.photo);
      }
  
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
  
      const responseUpload = await axios.post(
        `${API_BASE_URL}/uploadmultiple`,
        formDataWithImages,
        config
      );
  
      const imageUrls = {
        imageUrl1: responseUpload.data.urls[0], // Adjust index based on your response structure
        imageUrl2: responseUpload.data.urls[1], // Adjust index based on your response structure
      };
  
      const agentDataToUpdate = { ...agentformdata }; // Create a copy to modify
  
      // Update image URLs only if new images were uploaded
      if (agentformdata.image) {
        agentDataToUpdate.image = imageUrls.imageUrl1;
      }
  
      if (agentformdata.photo) {
        agentDataToUpdate.photo = imageUrls.imageUrl2;
      }
  
      await axios.put(`${API_BASE_URL}/updateagent/${agentId}`, agentDataToUpdate);
  
      // Reset form data and close modal
      setagentForm({
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
      });
      agentmodalclose();
    } catch (error) {
      // Handle Error
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

      setShowEditModal(true);
      setFormData({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Assuming you don't want to pre-fill password in the form for security reasons
        userType: userData.userType,
        // status: userData.status,
        image: userData.image, // Reset image in the form
      });
      fetchData();
    } catch (error) {
      // console.error('Error fetching user data for edit:', error);
      // Handle error or display an error message to the user
    }
  };

  const handleCloseeditModal = () => {
    setShowEditModal(false);
    // Reset formData when closing the modal
    setFormData({
      name: "",
      email: "",
      password: "",
      userType: "",
      // status: "",
      image: null,
    });
  };

  const [usersData, setUsersData] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const formDataForApi = new FormData();
      formDataForApi.append("name", formData.name);
      formDataForApi.append("email", formData.email);
      formDataForApi.append("password", formData.password);
      formDataForApi.append("userType", formData.userType);
      formDataForApi.append("image", formData.image);

      const response = await axios.put(
        `${API_BASE_URL}/updateintuser/${editUserId}`,
        formDataForApi,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(responseUser);
      if (response.status === 200) {
        const responseUser = await axios.put(
          `${API_BASE_URL}/update-user/${formData.email}`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            userType: formData.userType,
          }
        );
        // console.log("User updated successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          userType: "",
          image: null,
        });
        setShowEditModal(false);
        fetchData(); // Fetch updated data
      } else {
        // console.error("Failed to update user");
        // Handle failure - display an error message or perform necessary actions
      }
    } catch (error) {
      // console.error("Error updating user:", error);
      // Handle error - display an error message or perform necessary actions
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: imageFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataForApi = new FormData();
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
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        imageUrl: imageUrl, // Send the received image URL to the backend
      });

      // Clear form data and perform necessary actions after successful submission
      setFormData({
        name: "",
        email: "",
        password: "",
        userType: "",
        image: null,
      });
      handleCloseModal();
      fetchData();
    } catch (error) {
      // Handle error or display an error message to the user
      console.error("Error:", error);
    }
  };

  // Function to fetch user data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`); // Replace with your API endpoint
      setUsersData(response.data); // Update usersData state with the fetched data
    } catch (error) {
      // console.error('Error fetching users:', error);
      // Handle error or display an error message to the user
    }
  };

  useEffect(() => {
    // Call the function to fetch user data when the component mounts
    fetchData();
  }, []); // Run once on component mount

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/users/${userId}`
      );
      fetchData();
    } catch (error) {
      // console.error("Error:", error);
      // Handle error or display an error message to the user
    }
  };

  const handleFormUpdate = () => {
    fetchData(); // Toggling state to trigger a re-render
  };

  return (
    <div className="body-div">
      <div className="h-30 grid grid-cols-7 gap-3 content-start">
        <Button onClick={handleOpenModal}>Add User</Button>
        <AgentForm onFormSubmit={handleFormUpdate} />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
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
                <option value="user">User</option>
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

            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="file"
                onChange={handleImageChange}
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
                <option value="user">user</option>
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

            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="file"
                onChange={handleImageChange}
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
                    type="number"
                    name="mobile"
                    value={agentformdata.mobile}
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
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formAadhar">
                  <Form.Label>Aadhar</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadhar"
                    value={agentformdata.aadhar}
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
                  />
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
                {user.image ? (
                  <img src={user.image} alt="Profile" width="40" height="40" />
                ) : (
                  "No Image"
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
                    variant="warning"
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
