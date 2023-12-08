import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("Api URL:", API_BASE_URL);

const User = () => {
  const [showModal, setShowModal] = useState(false);
  const [showeditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
    status: "",
    image: null,
  });

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
        status: userData.status,
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
      status: "",
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
      formDataForApi.append("status", formData.status);
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
      const responseUser = await axios.put(
        `${API_BASE_URL}/update-user/${formData.email}`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        }
      );
      console.log(responseUser);
      if (response.status === 200) {
        console.log("User updated successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          userType: "",
          status: "",
          image: null,
        });
        setShowEditModal(false);
        fetchData(); // Fetch updated data
      } else {
        console.error("Failed to update user");
        // Handle failure - display an error message or perform necessary actions
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
    formDataForApi.append("status", formData.status);
    formDataForApi.append("image", formData.image);

    const responseUser = await axios.post(`${API_BASE_URL}/all-create`, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      userType: formData.userType,
    });
    console.log(responseUser);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users`,
        formDataForApi,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set proper headers for FormData
          },
        }
      );

      // console.log('User created:', response.data);
      // Clear the formDataForApi after successful submission
      formDataForApi.forEach((value, key) => {
        formDataForApi.delete(key);
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        userType: "",
        status: "",
        image: null,
      });
      handleCloseModal();
      fetchData();
    } catch (error) {
      // console.error('Error creating user:', error);
      // Handle error or display an error message to the user
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
      console.error("Error:", error);
      // Handle error or display an error message to the user
    }
  };

  return (
    <div className="body-div">
      <Button onClick={handleOpenModal}>Add User</Button>

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
                <option value="franchise">Franchise</option>
                <option value="agent">Agent</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
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
            </Form.Group>

            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="image"
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
                <option value="franchise">Franchise</option>
                <option value="agent">Agent</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
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
            </Form.Group>

            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
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
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user, index) => (
            <tr key={index}>
              <td>
                {user.image ? (
                  <img
                    src={`file:///${__dirname}/backend/${user.image}`} // Use forward slashes in the path
                    alt="Profile"
                    width="40"
                    height="40"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>
                <Badge
                  variant={user.status === "active" ? "success" : "danger"}
                >
                  {user.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEditModalOpen(user._id)}
                >
                  <FaEdit />
                </Button>{" "}
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
