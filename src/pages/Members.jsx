import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [uniquememberid,setuniquememberid] = useState(0);
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
      const uniquememberresponse = await axios.get(
        "http://localhost:3001/randomgenMemberId"
      );
      setuniquememberid(uniquememberresponse.data.uniqueid);
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
                value={uniquememberid}
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
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="integer"
                placeholder=""
                name="id"
                value={updateData.id}
                onChange={handleUpdateChange}
                readOnly
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

      <Table
        responsive
        striped
        bordered
        hover
        className="mt-4 rounded-lg overflow-hidden "
      >
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
            <tr>
              <td>{member.memberNo}</td>
              <td>{member.firstName}</td>
              <td>{member.lastName}</td>
              <td>{member.email}</td>
              <td>{member.branchName}</td>
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
export default Members;
