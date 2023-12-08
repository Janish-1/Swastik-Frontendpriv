import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "./depositform.css"; // Import the custom CSS file
const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("Api URL:", API_BASE_URL);

const Deposit = () => {
  const [formData, setFormData] = useState({
    date: "",
    member: "",
    accountNumber: "",
    transactionAmount: "",
    debitOrCredit: "Credit",
    status: "",
    description: "",
  });

  const [members, setMembers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactions, setTransactions] = useState([]);

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
      const transactionsResponse = await axios.get(
        `${API_BASE_URL}/transactions`
      );
      setTransactions(transactionsResponse.data.data);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

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
      // Send form data to your API endpoint to create a transaction
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setSuccessMessage("Transaction created successfully");
      setErrorMessage("");

      // console.log('Transaction created:', data); // Log the response from the server

      // Reset form fields after successful submission if needed
      setFormData({
        date: "",
        member: "",
        accountNumber: "",
        transactionAmount: "",
        debitOrCredit: "Credit",
        status: "",
        description: "",
      });
      fetchData();
    } catch (error) {
      setErrorMessage("Error creating transaction");
      setSuccessMessage("");
    }
  };

  return (
    <div className="body-div">
      <Container>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              type="number"
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
      <div className="mx-6 ">
        <h1 className="text-3xl m-2 text-cyan-500 font-medium ">
          Recent Deposits
        </h1>
        <table className="table text-center text-white rounded-lg overflow-hidden ">
          <thead>
            <tr class="table-secondry">
              <th>Date</th>
              <th>Member</th>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions
              .filter((transaction) => transaction.debitOrCredit === "Credit") // Filter transactions where debitOrCredit is 'credit'
              .slice(0, 10) // Take the first 10 transactions after filtering
              .map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                  <td>{transaction.member}</td>
                  <td>{transaction.accountNumber}</td>
                  <td>{transaction.transactionAmount}</td>
                  <td>{transaction.status}</td>
                  <td>{transaction.debitOrCredit}</td>
                  <td>{transaction.description}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deposit;
