// Withdraw.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import "./depositform.css";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// // console.log("Api URL:", API_BASE_URL);

const Withdraw = () => {
  const [formData, setFormData] = useState({
    date: "",
    member: "",
    accountNumber: "",
    transactionAmount: "",
    debitOrCredit: "Debit",
    status: "",
    description: "",
  });

  const [members, setMembers] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const fetchData = async () => {
    try {
      const memberResponse = await axios.get(`${API_BASE_URL}/readmemberids`);
      setMembers(memberResponse.data.data);
      // // console.log('Member IDs Status:', memberResponse);

      const accountResponse = await axios.get(
        `${API_BASE_URL}/readaccountnumbers`
      );
      setAccounts(accountResponse.data);
      // // console.log('Account Numbers Status:', accountResponse);
    } catch (error) {
      // // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

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
      // // console.error("Error fetching details:", error);
    }
  };

  const handleMemberOrAccountSelect = (value, type) => {
    // Call fetchDetails function with the selected value and type
    fetchDetails(value, type);
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
      // Validation checks
      const missingFields = [];
      if (!formData.date) missingFields.push("Date");
      if (!formData.member) missingFields.push("Member");
      if (!formData.accountNumber) missingFields.push("Account Number");
      if (!formData.transactionAmount) missingFields.push("Transaction Amount");
      if (!formData.debitOrCredit) missingFields.push("Debit/Credit");
      if (!formData.status) missingFields.push("Status");
      if (!formData.description) missingFields.push("Description");

      if (missingFields.length > 0) {
        const missingFieldsMessage = "Please fill in the following fields: " + missingFields.join(", ");
        window.alert(missingFieldsMessage);
        return;
      }

      // Send form data to your API endpoint to create a transaction
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        window.alert("Transaction created successfully");
        // console.log('Transaction created:', data); // Log the response from the server

        // Reset form fields after successful submission if needed
        setFormData({
          date: "",
          member: "",
          accountNumber: "",
          transactionAmount: "",
          debitOrCredit: "Debit",
          status: "",
          description: "",
        });
        fetchData(); // Assuming fetchData is a function to fetch updated data
      } else {
        window.alert("Error creating transaction. Please check your input.");
      }
    } catch (error) {
      window.alert("Error creating transaction. Please try again.");
      // console.error('Error creating transaction:', error);
    }
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
            <Form.Label className="custom-form-label">Amount *</Form.Label>
            <Form.Control
              className="custom-form-control"
              type="integer"
              name="transactionAmount"
              value={formData.transactionAmount}
              onChange={handleInputChange}
              required
            />
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

export default Withdraw;
