import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios";
// import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

import { Dropdown } from 'react-bootstrap'

const Members = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    memberNo: "",
    firstName: "",
    lastName: "",
    email: "",
    branchName: "",
  });
  const [updateData, setUpdateData] = useState({
    id: "",
    memberNo: "",
    firstName: "",
    lastName: "",
    email: "",
    branchName: "",
  });
  const [membersData, setMembersData] = useState([]);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [branchNames, setBranchNames] = useState([]);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;

    // Update the state based on the input field name
    setUpdateData({
      ...updateData,
      [name]: value,
    });
  };



    const [showAccountModal, setShowAccountModal] = useState(false);
    const [accountFormData, setAccountFormData] = useState({
      accountNo: "",
      accountType: "",
      openingBalance: "",
    });
  
    const handleOpenAccountModal = () => setShowAccountModal(true);
    const handleCloseAccountModal = () => setShowAccountModal(false);
  
    const handleAccountInputChange = (e) => {
      const { name, value } = e.target;
      setAccountFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
const handleAccountSubmit=()=> {

}


  const handleOpenEditModal = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(`http://localhost:3001/getmember/${id}`);
      const memberData = response.data; // Assuming response.data contains the member data
      // console.log(memberData);
      // Assuming memberData has fields like firstName, lastName, email, etc.
      setUpdateData({
        id: memberData._id,
        memberNo: memberData.memberNo,
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        branchName: memberData.branchName,
        // ... Add other fields as necessary based on your form structure
      });

      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      // console.error('Error fetching member data:', error);
      // Handle error or display an error message to the user
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMemberIndex(null);
  };

  const fetchData = async () => {
    try {
      const branchNamesResponse = await axios.get(
        "http://localhost:3001/branches/names"
      );
      setBranchNames(branchNamesResponse.data.data);

      const membersResponse = await axios.get(
        "http://localhost:3001/readmembers"
      );
      const { data } = membersResponse.data;

      if (Array.isArray(data)) {
        setMembersData(data);
      } else if (typeof data === "object") {
        const dataArray = [data];
        setMembersData(dataArray);
      } else {
        // console.error('Invalid format for members data:', data);
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add new member
      await axios.post("http://localhost:3001/createmember", formData);
      // Close modal and reset form data and selected index
      handleCloseModal();
      setFormData({
        memberNo: "",
        firstName: "",
        lastName: "",
        email: "",
        branchName: "",
      });
      // alert('Data Entered Successfully');
      fetchData();
    } catch (error) {
      // alert('Check Data Fields for no duplicates');
      // console.error('Error:', error);
      // Handle error or display an error message to the user
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update member
      // console.log(updateData);
      const response = await axios.put(
        `http://localhost:3001/updatemember/${updateData.id}`,
        updateData
      );
      // console.log(response.data);
      // alert('Successfully Updated');
      // Close the edit modal
      handleCloseEditModal();
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      // Show failure alert for update
      // alert('Update Failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = axios.post(`http://localhost:3001/deletemember/${id}`);
      console.log(response);
      // alert('Delete Success');
      fetchData();
    } catch (error) {
      // console.log('Failed Delete');
      // alert('Delete Failed');
    }
  };

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMemberData, setViewMemberData] = useState(null);

  const handleOpenViewModal = (id) => {
    const selectedMember = membersData.find((member) => member._id === id);
    setViewMemberData(selectedMember);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewMemberData(null);
  };

  return (
    <div className="body-div">
      <Button onClick={handleOpenModal}>Add Member</Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formMemberNo">
              <Form.Label>Member No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter member number"
                name="memberNo"
                value={formData.memberNo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
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
              />
            </Form.Group>
            <Form.Group controlId="formBranch">
              <Form.Label>Branch</Form.Label>
              <Form.Select
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
              >
                <option value="">Select a branch</option>
                {branchNames.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="TableId">
              {/* <Form.Label></Form.Label> */}
              <Form.Control
                type="integer"
                placeholder=""
                name="id"
                value={updateData.id}
                onChange={handleUpdateChange}
                readOnly
                style={{display:'none'}}

              />
            </Form.Group>
            <Form.Group controlId="formMemberNo">
              <Form.Label>Member No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter member number"
                name="memberNo"
                value={updateData.memberNo}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={updateData.firstName}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={updateData.lastName}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={updateData.email}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formBranch">
              <Form.Label>Branch</Form.Label>
              <Form.Select
                name="branchName"
                value={updateData.branchName}
                onChange={handleUpdateChange}
              >
                <option value="">Select a branch</option>
                {branchNames.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Edit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
        <Modal.Header closeButton className="bg-cyan-800 text-white">
          <Modal.Title className="text-xl font-semibold">
            View Member Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewMemberData && (
            <div className="space-y-2">
              <p className="text-gray-800">
                <strong>Member No:</strong> {viewMemberData.memberNo}
              </p>
              <p className="text-gray-800">
                <strong>First Name:</strong> {viewMemberData.firstName}
              </p>
              <p className="text-gray-800 ">
                <strong>Last Name:</strong> {viewMemberData.lastName}
              </p>
              <p className="text-gray-800">
                <strong>Email:</strong> {viewMemberData.email}
              </p>
              <p className="text-gray-800">
                <strong>Branch:</strong> {viewMemberData.branchName}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>






      <Modal show={showAccountModal} onHide={handleCloseAccountModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAccountSubmit }>
            {/* Account No Dropdown */}
            <Form.Group controlId="formAccountNo">
              <Form.Label>Account No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter account number"
                name="accountNo"
                value={accountFormData.accountNo}
                onChange={handleAccountInputChange}
              />
            </Form.Group>

            {/* Account Type Dropdown */}
            <Form.Group controlId="formAccountType">
              <Form.Label>Account Type</Form.Label>
              <Form.Select
                name="accountType"
                value={accountFormData.accountType}
                onChange={handleAccountInputChange}
              >
                <option value="">Select an account type</option>
                <option value="Savings">Savings</option>
                <option value="Loan">Loan</option>
              </Form.Select>
            </Form.Group>

            {/* Opening Balance Fields */}
            <Form.Group controlId="formOpeningBalance">
              <Form.Label>Opening Balance</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter opening balance"
                name="openingBalance"
                value={accountFormData.openingBalance}
                onChange={handleAccountInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create Account
            </Button>
          </Form>
        </Modal.Body>
      </Modal>






      <Table responsive striped bordered hover className="mt-4 rounded-lg overflow-hidden ">
  <thead>
    <tr>
      <th>Member No</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>Branch</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {membersData.map((member) => (
      <tr key={member._id}>
        <td>{member.memberNo}</td>
        <td>{member.firstName}</td>
        <td>{member.lastName}</td>
        <td>{member.email}</td>
        <td>{member.branchName}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleOpenEditModal(member._id)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelete(member._id)}>
                Delete
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenViewModal(member._id)}>
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenAccountModal(member._id)}>
                Create Account
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
    </div>
  );
};
export default Members;
