// Accounts.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Table,
  FormControl,
  Dropdown,
} from "react-bootstrap";

const Accounts = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: "",
    member: "",
    accountType: "", // Change default value to an empty string
    status: "", // Change default value to an empty string
    openingBalance: 0,
  });
  const [accountsData, setAccountsData] = useState([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [membersData, setMembersData] = useState([]);

  const handleOpenModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAccountIndex(null);
    setFormData({
      accountNumber: "",
      member: "",
      accountType: "",
      status: "",
      openingBalance: 0,
      currentBalance: openingBalance,
    });
  };

  const handleOpenEditModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/accounts/${id}`);
      const accountData = response.data.data; // Assuming response.data contains the account data

      setFormData({
        id: accountData._id,
        accountNumber: accountData.accountNumber,
        member: accountData.member,
        accountType: accountData.accountType,
        status: accountData.status,
        openingBalance: accountData.openingBalance,
        currentBalance: accountData.openingBalance,
        // Add other fields as necessary based on your form structure
      });

      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      // console.error('Error fetching account data:', error);
      // Handle error or display an error message to the user
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "openingBalance" ? parseFloat(value) : value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/deleteaccounts/${id}`
      );
      // console.log(response);
      // alert('Delete Success');
      fetchData(); // Fetch data after successful deletion
    } catch (error) {
      // console.error('Failed Delete:', error);
      // alert('Delete Failed');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // console.log(formData);
      await axios.put(
        `http://localhost:3001/updateaccounts/${formData.id}`,
        formData
      );
      // alert('Data Updated Successfully');
      fetchData(); // Fetch data after successful update
      handleCloseEditModal();
    } catch (error) {
      // alert('Failed to update account. Please check the data fields.');
      // console.error('Error:', error);
      handleCloseEditModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/createaccounts", formData);
      // alert('Data Entered Successfully');
      handleCloseModal();
      fetchData(); // Fetch data after successful addition
    } catch (error) {
      // alert('Check Data Fields for no duplicates');
      // console.error('Error:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch accounts data
      const response = await axios.get("http://localhost:3001/accounts");
      setAccountsData(response.data.data); // Assuming response.data contains the account data
    } catch (error) {
      console.error("Error fetching accounts:", error);
      // Handle error or display an error message to the user
    }
    const response = await axios
      .get("http://localhost:3001/readmembersname")
      .then((response) => {
        // console.log('Member Name Status:',response);
        setMembersData(response.data.data);
      })
      .catch((error) => console.log("Error Fetching Member Numbers"));
  };

  useEffect(() => {
    // Fetch accounts data initially
    fetchData();
    // ... Rest of your useEffect code remains the same
  }, []); // Run once on component mount

  useEffect(() => {
    // Filter accountsData based on searchTerm whenever searchTerm changes
    const filtered = accountsData.filter((account) =>
      Object.values(account).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredAccounts(filtered);
  }, [searchTerm, accountsData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
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
          Add Account
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
          <Modal.Title>Add Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formAccountNumber">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter account number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMember">
              <Form.Label>Member</Form.Label>
              <Form.Control
                as="select" // Render as a dropdown select
                name="member"
                value={formData.member}
                onChange={handleInputChange}
              >
                <option value="">Select member</option>
                {/* Map through the membersData array to create options */}
                {membersData.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAccountType">
              <Form.Label>Account Type</Form.Label>
              <Form.Control
                as="select"
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                <option value="Savings Account">Savings Account</option>
                <option value="Loan Account">Loan Account</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formOpeningBalance">
              <Form.Label>Opening Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter opening balance"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formAccountNumber">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter account number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMember">
              <Form.Label>Member</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter member name"
                name="member"
                value={formData.member}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAccountType">
              <Form.Label>Account Type</Form.Label>
              <Form.Control
                as="select"
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                <option value="Savings Account">Savings Account</option>
                <option value="Loan Account">Loan Account</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formOpeningBalance">
              <Form.Label>Opening Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter opening balance"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleInputChange}
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
            <th>Unique Table ID</th>
            <th>Account Number</th>
            <th>Member</th>
            <th>Account Type</th>
            <th>Status</th>
            <th>Opening Balance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((account) => (
            <tr>
              <td>{account._id}</td>
              <td>{account.accountNumber}</td>
              <td>{account.member}</td>
              <td>{account.accountType}</td>
              <td>{account.status}</td>
              <td>{account.openingBalance}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle
                    className="btn-secondry"
                    variant="secondary"
                    id="dropdown-basic"
                  >
                    Action
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleOpenEditModal(account._id)}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(account._id)}>
                      Delete
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

export default Accounts;
