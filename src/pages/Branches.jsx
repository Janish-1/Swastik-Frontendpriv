import React, { useState, useEffect } from "react";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    branchName: "",
    managerName: "",
    contactemail: "",
    password: "",
    contactphone: "",
    branchaddress: "",
  });
  const [membersData, setMembersData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success"); // or 'danger' for an error alert
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [filteredMembers, setFilteredMembers] = useState([]); // State to hold filtered members
  const [presetemail, setEmail] = useState("");
  const [presetpassword, setPassword] = useState("");

  // useEffect(async () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     (response = await axios.post(
  //       "http://localhost:3001/getuseremailpassword"
  //     )),
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           token,
  //         }),
  //       }
  //         .then((response) => response.json())
  //         .then((data) => {
  //           console.log("Username:", data.username);
  //           setEmail(data.email);
  //           setPassword(data.password);
  //         })
  //         .catch((error) => {
  //           console.error("Error:", error);
  //           // Handle errors that occurred during the request
  //         });
  //   }
  // }, []);

  const handleOpenModal = () => {
    setShowModal(true);
    // Reset alert when modal is opened
    setShowAlert(false);
    // Clear selected member index when opening the modal
    setSelectedMemberIndex(null);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleOpenEditModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/getbranch/${id}`);
      const selectedMemberData = response.data; // Assuming response.data contains the member data
      // console.log(selectedMemberData);
      // Set the form data to the retrieved member's data
      // Set the form data to the retrieved member's data
      setFormData({
        ...selectedMemberData,
        branchId: selectedMemberData._id, // Assigning the ID to the correct field in the form
      });
      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      console.error("Error fetching member data:", error);
      // Handle error or display an error message to the user
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMemberIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/createbranch",
        formData
      );
      fetchData();
    } catch (error) {
      setShowAlert(true);
    }
    // Create a manager user associated with the branch
    const responseUser = await axios.post("http://localhost:3001/all-create", {
      name: formData.managerName,
      email: formData.contactemail,
      password: formData.password,
      userType: "manager",
    });

    // Handle success of user creation
    console.log("Manager User Created:", responseUser.data);
    setFormData({
      branchName: "",
      managerName: "",
      contactemail: "",
      password: "",
      contactphone: "",
      branchaddress: "",
    });

    // Close modal after a delay (you can adjust the delay as needed)
    setTimeout(() => {
      handleCloseModal();
    }, 500);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    console.log(id);
    try {
      // Update member
      // console.log(formData);
      const response = await axios.put(
        `http://localhost:3001/updatebranch/${formData._id}`,
        formData
      );
      // console.log(response.data);
      // Close the edit modal
      handleCloseEditModal();

      const response1 = await axios.put(`http://localhost:3001/update-user/${formData.contactemail}`,
        {
          name: formData.managerName,
          email: formData.contactemail,
          password: formData.password,
          userType: "manager",
        }
      )

      // Reset form data
      setFormData({
        branchName: "",
        managerName: "",
        contactemail: "",
        password: "",
        contactphone: "",
        branchaddress: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      // Show failure alert for update
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/deletebranch/${id}`
      );
      // console.log(response.data);
      // Show success alert for delete
      fetchData();
    } catch (error) {
      console.error("Error in deleting data:", error);

      // Show error alert for delete
      alert("failed");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/readbranch");
      const { data } = response.data; // Extract 'data' array from the response

      // Filter the 'data' array based on searchTerm
      const filteredData = data.filter((member) =>
        member.branchName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Update filteredMembers state with the filtered data
      setFilteredMembers(filteredData);

    } catch (error) {
      // console.error("Error while fetching data:", error);
      // Handle the error or show an error message to the user
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData initially when the component mounts
  }, [searchTerm]);

  return (
    <div className="body-div">
      {/* <Button onClick={handleOpenModal}>Add New</Button>
        <FormControl
        className='custom-search-bar'
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={handleSearch}
        /> */}

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
                name="managerName"
                value={formData.managerName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="contactemail"
                value={formData.contactemail}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formpassword">
              <Form.Label>Password </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter phone number"
                name="contactphone"
                value={formData.contactphone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
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
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="integer"
                placeholder="Enter Id"
                name="branchId"
                value={formData.branchId}
                onChange={handleInputChange}
                readOnly
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
                name="managerName"
                value={formData.managerName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="contactemail"
                value={formData.contactemail}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formpassword">
              <Form.Label>Password </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter phone number"
                name="contactphone"
                value={formData.contactphone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
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
              <td>{member.branchName}</td>
              <td>{member.managerName}</td>
              <td>{member.contactemail}</td>
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
