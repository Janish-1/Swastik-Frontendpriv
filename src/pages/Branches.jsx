import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Table,
  Alert,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const Branches = () => {
  const [showModal, setShowModal] = useState(false);
  const [branchCodeunique, setbranchcodeunique] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    branchCode: 0,
    branchName: "",
    name: "",
    email: "",
    password: "",
    contactphone: "",
    branchaddress: "",
    branchCode: 0,
  });

  const [updatedformdata, setupdateformdata] = useState({
    branchCode: 0,
    branchName: "",
    name: "",
    email: "",
    password: "",
    contactphone: "",
    branchaddress: "",
    branchCode: branchCodeunique,
  });

  const [membersData, setMembersData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success"); // or 'danger' for an error alert
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [filteredMembers, setFilteredMembers] = useState([]); // State to hold filtered members
  const [presetemail, setEmail] = useState("");
  const [presetpassword, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleOpenModal = () => {
    fetchData();
    setShowModal(true);
    // Reset alert when modal is opened
    setShowAlert(false);
    // Clear selected member index when opening the modal
    setSelectedMemberIndex(null);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleOpenEditModal = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getbranch/${id}`);
      const selectedMemberData = response.data; // Assuming response.data contains the member data
      // // console.log(selectedMemberData);
      // Set the form data to the retrieved member's data
      setFormData({
        ...selectedMemberData,
        branchId: selectedMemberData._id, // Assigning the ID to the correct field in the form
      });
      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      // // console.error("Error fetching member data:", error);
      // Handle error or display an error message to the user
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMemberIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validate only for the contactphone field
    if (name === 'contactphone') {
      // Ensure that only numeric characters are allowed
      const numericValue = value.replace(/\D/g, '');

      // Limit the value to 10 characters
      const limitedValue = numericValue.slice(0, 10);

      // Update the state
      setFormData({
        ...formData,
        [name]: limitedValue,
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchData = async () => {
    try {
      // const resp = await axios.get(`${API_BASE_URL}/randomgenbranchCode`);
      // setbranchcodeunique(resp.data.uniqueid);

      const response = await axios.get(`${API_BASE_URL}/readbranch`);
      const { data } = response.data; // Extract 'data' array from the response

      // Filter the 'data' array based on searchTerm
      const filteredData = data.filter((member) =>
        member.branchName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Update filteredMembers state with the filtered data
      setFilteredMembers(filteredData);
    } catch (error) {
      // // console.error("Error while fetching data:", error);
      // Handle the error or show an error message to the user
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData initially when the component mounts
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (
      !formData.branchCode ||
      !formData.branchName ||
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.contactphone
    ) {
      window.alert("Please fill in all fields.");
      return;
    }

    // Branch code validation
    const branchCodeRegex = /^\d+$/;
    if (!branchCodeRegex.test(formData.branchCode) || parseInt(formData.branchCode) === 0) {
      window.alert("Branch code must contain only digits.");
      return;
    }

    // Name validation (assuming it should contain only alphabetic characters)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.branchName) || !nameRegex.test(formData.name)) {
      window.alert("Name fields must contain only alphabetic characters.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      window.alert("Please enter a valid email address.");
      return;
    }

    // Password validation (assuming "Strong" means it must contain at least 8 characters with at least one uppercase letter, one lowercase letter, one number, and one special character)
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      window.alert("Password must be strong (at least 8 characters including at least one uppercase letter, one lowercase letter, one number, and one special character).");
      return;
    }

    // Contact phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contactphone)) {
      window.alert("Phone number must be 10 digits.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/createbranch`, formData);
      fetchData();
      setValidationErrors([]);
      setFormData({
        branchName: "",
        name: "",
        email: "",
        password: "",
        contactphone: "",
        branchaddress: "",
        branchCode: 0,
      });
      handleCloseModal();

      // Show success alert for create
      window.alert("Successfully created branch");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error("Error saving user data:", error);
        setErrorMessage("Error saving user data");
      }
    }
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();

    // Validation checks
    if (
      !formData.branchCode ||
      !formData.branchName ||
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.contactphone
    ) {
      window.alert("Please fill in all fields.");
      return;
    }

    // Branch code validation
    const branchCodeRegex = /^\d+$/;
    if (!branchCodeRegex.test(formData.branchCode) || parseInt(formData.branchCode) === 0) {
      window.alert("Branch code must contain only digits.");
      return;
    }

    // Name validation (assuming it should contain only alphabetic characters)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.branchName) || !nameRegex.test(formData.name)) {
      window.alert("Name fields must contain only alphabetic characters.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      window.alert("Please enter a valid email address.");
      return;
    }

    // Password validation (assuming "Strong" means it must contain at least 8 characters with at least one uppercase letter, one lowercase letter, one number, and one special character)
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      window.alert("Password must be strong (at least 8 characters including at least one uppercase letter, one lowercase letter, one number, and one special character).");
      return;
    }

    // Contact phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contactphone)) {
      window.alert("Phone number must be 10 digits.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/updatebranch/${formData.branchId}`,
        formData
      );
      handleCloseEditModal();
      setFormData({
        branchName: "",
        name: "",
        email: "",
        password: "",
        contactphone: "",
        branchaddress: "",
        branchCode: 0,
      });
      fetchData();

      // Show success alert for update
      window.alert("Successfully updated branch");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error("Error updating data:", error);
        setErrorMessage("Error updating data");
      }

      // Show error alert for create
      window.alert("Failed to create branch. Please Check Input Fields");
      window.alert("Ensure the Email is Unique")
    }
  };

  const handleDelete = async (id) => {
    try {
      // Show a confirmation dialog
      const confirmed = window.confirm("Are you sure you want to delete?");

      if (confirmed) {
        const response = await axios.post(`${API_BASE_URL}/deletebranch/${id}`);
        // Show success alert for delete
        fetchData();
      } else {
        // User cancelled the deletion
        alert("Deletion cancelled");
      }
    } catch (error) {
      // Show error alert for delete
      alert("Failed to delete");
    }
  };

  return (
    <div className="body-div">
      <div className="d-flex mb-2">
        <Button
          className="mr-2"
          onClick={() => {
            setFormData({});
            handleOpenModal();
          }}
        >
          Add Branch
        </Button>
        <FormControl
          className="custom-search-bar"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedMemberIndex !== null ? "Edit" : "Add"} New
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="branchCode">
              <Form.Label>Branch Code</Form.Label>
              <Form.Control
                type="integer"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleInputChange}
                inputMode="numeric"  // Add this line to remove up and down arrows
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formmanagerName">
              <Form.Label>Manager Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Manager Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formpassword">
              <Form.Label>Password</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleTogglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </div>
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label>Phone </Form.Label>
              <Form.Control
                type="tel"  // Use type="tel" for phone numbers
                placeholder="Enter phone number"
                name="contactphone"
                value={formData.contactphone}
                onChange={handleInputChange}
                maxLength={10}
                minLength={10}
              />
              {formData.contactphone && formData.contactphone.length !== 10 && (<Form.Text className="text-danger">
                Phone number must be 10 digits.
              </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label> Address</Form.Label>
              <Form.Control
                type="textarea"
                placeholder="Enter address"
                name="branchaddress"
                value={formData.branchaddress}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {selectedMemberIndex !== null ? "Edit" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Branch Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formID">
              {/* <Form.Label>ID</Form.Label> */}
              <Form.Control
                type="integer"
                placeholder="Enter Id"
                name="branchId"
                value={formData.branchId}
                onChange={handleInputChange}
                readOnly
                style={{ display: "none" }}
              />
            </Form.Group>
            <Form.Group controlId="branchCode">
              <Form.Label>Branch Code</Form.Label>
              <Form.Control
                type="integer"
                placeholder="Enter name"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleInputChange}
                inputMode="numeric"  // Add this line to remove up and down arrows
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formmanagerName">
              <Form.Label>Manager Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Manager Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formpassword">
              <Form.Label>Password</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleTogglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </div>
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone </Form.Label>
              <Form.Control
                type="tel"  // Use type="tel" for phone numbers
                placeholder="Enter phone number"
                name="contactphone"
                value={formData.contactphone}
                onChange={handleInputChange}
                maxLength={10}
                minLength={10}
              />
              {formData.contactphone && formData.contactphone.length !== 10 && (<Form.Text className="text-danger">
                Phone number must be 10 digits.
              </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label> Address</Form.Label>
              <Form.Control
                type="textarea"
                placeholder="Enter address"
                name="branchaddress"
                value={formData.branchaddress}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Alert
        show={showAlert}
        variant={alertVariant}
        onClose={() => setShowAlert(false)}
        dismissible
      >
        {alertVariant === "success"
          ? "Success! Operation completed."
          : "Error! Something went wrong."}
      </Alert>

      <Table
        responsive
        striped
        bordered
        hover
        className="mt-4 rounded-lg overflow-hidden"
      >
        <thead>
          <tr>
            <th>Branch Code</th>
            <th>Name</th>
            <th>Manager Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member) => (
            <tr>
              <td>{member.branchCode}</td>
              <td>{member.branchName}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.contactphone}</td>
              <td>{member.branchaddress}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleOpenEditModal(member._id)}
                >
                  <FaEdit />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(member._id)}
                >
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

export default Branches;
