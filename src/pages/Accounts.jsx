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
const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("Api URL:", API_BASE_URL);

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
  const [uniqueaccountid, setuniqueaccountid] = useState(0);
  const [branchNames, setBranchNames] = useState([]);

  const [accountFormData, setAccountFormData] = useState({
    _id: "",
    accountNumber: 0,
    member: "",
    memberNo: 0,
    email: "",
    branchName: "",
    aadhar: "",
    pancard: "",
    accountType: "",
    status: "",
    openingBalance: 0,
    currentBalance: 0,
  });

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
      const response = await axios.get(`${API_BASE_URL}/accounts/${id}`);
      const accountData = response.data.data; // Assuming response.data contains the account data

      setAccountFormData({
        _id: id,
        accountNumber: accountData.accountNumber,
        member: accountData.memberName,
        memberNo: accountData.memberNo,
        email: accountData.email,
        branchName: accountData.branchName,
        aadhar: accountData.aadhar,
        pancard: accountData.pancard,
        accountType: accountData.accountType,
        status: accountData.status,
        openingBalance: accountData.openingBalance,
        currentBalance: accountData.currentBalance,
      });

      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      console.error("Error fetching account data:", error);
      // Handle the error condition, show an error message, or perform other actions
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
    setAccountFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deleteaccounts/${id}`
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
        `${API_BASE_URL}/updateaccounts/${accountFormData._id}`,
        accountFormData
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
      await axios.post(`${API_BASE_URL}/createaccounts`, formData);
      // alert('Data Entered Successfully');
      fetchData(); // Fetch data after successful addition
      handleCloseModal();
    } catch (error) {
      // alert('Check Data Fields for no duplicates');
      // console.error('Error:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch accounts data
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      setAccountsData(response.data.data); // Assuming response.data contains the account data
    } catch (error) {
      console.error("Error fetching accounts:", error);
      // Handle error or display an error message to the user
    }

    const response = await axios
      .get(`${API_BASE_URL}/readmembersname`)
      .then((response) => {
        // console.log('Member Name Status:',response);
        setMembersData(response.data.data);
      })
      .catch((error) => console.log("Error Fetching Member Numbers"));

    const uniqueaccountresponse = await axios.get(
      `${API_BASE_URL}/randomgenAccountId`
    );
    setuniqueaccountid(uniqueaccountresponse.data.uniqueid);

    const branchNamesResponse = await axios.get(
      `${API_BASE_URL}/branches/names`
    );
    setBranchNames(branchNamesResponse.data.data);
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
                value={uniqueaccountid}
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
                <option value="Savings">Savings Account</option>
                <option value="Loan">Loan Account</option>
              </Form.Control>
            </Form.Group>
            {/* <Form.Group controlId="formStatus">
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
            </Form.Group> */}
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
            {/* Assuming formData is your state containing account information */}
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="id"
                value={accountFormData._id}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formAccountNumber">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="accountNumber"
                value={accountFormData.accountNumber}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formMemberNumber">
              <Form.Label>Member Number</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="memberNo"
                value={accountFormData.memberNo}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formMember">
              <Form.Label>Member</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter member name"
                name="memberName"
                value={accountFormData.member}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAccountType">
              <Form.Label>Account Type</Form.Label>
              <Form.Control
                as="select"
                name="accountType"
                value={accountFormData.accountType}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                <option value="Savings">Savings Account</option>
                <option value="Loan">Loan Account</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formOpeningBalance">
              <Form.Label>Opening Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter opening balance"
                name="openingBalance"
                value={accountFormData.openingBalance}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAadhar">
              <Form.Label>Aadhar</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Aadhar number"
                name="aadhar"
                value={accountFormData.aadhar}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPancard">
              <Form.Label>Pancard</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Pancard number"
                name="pancard"
                value={accountFormData.pancard}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBranch">
              <Form.Label>Branch</Form.Label>
              <Form.Select
                name="branchName"
                value={accountFormData.branchName}
                onChange={handleInputChange}
              >
                <option value="">Select a branch</option>
                {branchNames.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>{" "}
            <Form.Group controlId="formEMAIL">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={accountFormData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Table
        striped
        responsive
        bordered
        hover
        className="mt-4 rounded-lg overflow-hidden"
      >
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Member Number</th>
            <th>Member Name</th>
            <th>Account Type</th>
            <th>Opening Balance</th>
            <th>Current Balance</th>
            <th>Branch</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((account) => (
            <tr key={account._id}>
              <td>{account.accountNumber}</td>
              <td>{account.memberNo}</td>
              <td>{account.memberName}</td>
              <td>{account.accountType}</td>
              <td>{account.openingBalance}</td>
              <td>{account.currentBalance}</td>
              <td>{account.branchName}</td>
              <td>{account.email}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle
                    className="btn-secondary"
                    variant="primary"
                    id={`dropdown-${account._id}`}
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
