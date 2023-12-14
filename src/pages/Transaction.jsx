// Transaction.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import "./depositform.css";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const Transaction = () => {
  const [formData, setFormData] = useState({
    date: new Date(),
    member: "",
    accountNumber: "",
    amount: "",
    transactionType: "",
    status: "Completed",
    description: "",
  });

  const [members, setMembers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  // const [transactionTypes, setTransactionTypes] = useState([]);

  const fetchData = async () => {
    try {
      const memberResponse = await axios.get(`${API_BASE_URL}/readmemberids`);
      setMembers(memberResponse.data.data);
      // console.log('Member IDs Status:', memberResponse);

      const accountResponse = await axios.get(
        `${API_BASE_URL}/readaccountnumbers`
      );
      setAccounts(accountResponse.data);
      // console.log('Account Numbers Status:', accountResponse);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // const fetchTransactionTypes = async () => {
  //   try {
  //     // Replace 'your-transaction-types-api-endpoint' with the actual API endpoint for transaction types
  //     const response = await fetch('your-transaction-types-api-endpoint');
  //     const data = await response.json();
  //     setTransactionTypes(data); // Assuming data is an array of transaction types
  //   } catch (error) {
  //     console.error('Error fetching transaction types:', error);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchDetails = async (inputValue, type) => {
    try {
      let response;
      if (type === "member") {
        response = await axios.get(
          `${API_BASE_URL}/detailsByMemberId/${inputValue}`
        );
        const memberDetails = response.data;
        const { accountNumber } = memberDetails;
        setFormData((prevFormData) => ({
          ...prevFormData,
          accountNumber: accountNumber,
          // Update other form fields as needed
        }));
      } else if (type === "account") {
        response = await axios.get(
          `${API_BASE_URL}/detailsByAccountNumber/${inputValue}`
        );
        const accountDetails = response.data;
        const { member } = accountDetails;
        setFormData((prevFormData) => ({
          ...prevFormData,
          member: member,
          // Update other form fields as needed
        }));
      }
      // Handle the retrieved details accordingly
    } catch (error) {
      // Handle error or display an error message
      // console.error("Error fetching details:", error);
    }
  };

  const handleMemberOrAccountSelect = (value, type) => {
    // Call fetchDetails function with the selected value and type
    fetchDetails(value, type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to your API endpoint to create a transaction
      const response = await axios.post(
        `${API_BASE_URL}/transactions`,
        formData
      );
      // console.log(response);

      // Reset form fields after successful submission if needed
      setFormData({
        date: new Date(),
        member: "",
        accountNumber: "",
        transactionAmount: "",
        debitOrCredit: "",
        status: "",
        description: "",
      });
      fetchData();
    } catch (error) {
      // console.error('Error creating transaction:', error);
    }
    // console.log(formData);
  };

  return (
    <div className="body-div">
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="date">
            <Form.Label className="custom-form-label">Date *</Form.Label>
            <Form.Control
              className="custom-form-control"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="member">
            <Form.Label className="custom-form-label">Member *</Form.Label>
            <Form.Control
              className="custom-form-control"
              as="select"
              name="member"
              value={formData.member}
              onChange={(e) => {
                handleInputChange(e);
                fetchDetails(e.target.value, "member");
              }}
            required
            >
              <option value="">Select Member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.id}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="accountNumber">
            <Form.Label className="custom-form-label">
              Account Number *
            </Form.Label>
            <Form.Control
              className="custom-form-control"
              as="select"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => {
                handleInputChange(e);
                fetchDetails(e.target.value, "account");
              }}
            required
            >
              <option value="">Select Account</option>
              {accounts.map((accountNumber) => (
                <option key={accountNumber} value={accountNumber}>
                  {accountNumber}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="transactionAmount">
            <Form.Label className="custom-form-label">
              Transaction Amount *
            </Form.Label>
            <Form.Control
              className="custom-form-control"
              type="number"
              name="transactionAmount"
              value={formData.transactionAmount}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="debitOrCredit">
            <Form.Label className="custom-form-label">
              Debit/Credit *
            </Form.Label>
            <Form.Control
              className="custom-form-control"
              as="select"
              name="debitOrCredit"
              value={formData.debitOrCredit}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Transaction Type</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="status">
            <Form.Label className="custom-form-label">Status *</Form.Label>
            <Form.Control
              className="custom-form-control"
              as="select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Please Select an Option</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label className="custom-form-label">Description *</Form.Label>
            <Form.Control
              className="custom-form-control"
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Transaction;
