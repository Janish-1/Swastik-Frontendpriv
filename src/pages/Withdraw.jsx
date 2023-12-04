// Withdraw.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import './depositform.css'
const Withdraw = () => {
  const [formData, setFormData] = useState({
    date: '',
    member: '',
    accountNumber: '',
    transactionAmount: '',
    debitOrCredit: 'Debit',
    status: '',
    description: '',
  });

  const [members, setMembers] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const fetchData = async () => {
      try {
        const memberResponse = await axios.get('http://localhost:3001/readmemberids');
        setMembers(memberResponse.data.data);
        // console.log('Member IDs Status:', memberResponse);

        const accountResponse = await axios.get('http://localhost:3001/readaccountnumbers');
        setAccounts(accountResponse.data);
        // console.log('Account Numbers Status:', accountResponse);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };
  
    useEffect(  () => {
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
      const response = await fetch('http://localhost:3001/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      // console.log('Transaction created:', data); // Log the response from the server
      
      // Reset form fields after successful submission if needed
      setFormData({
        date: '',
        member: '',
        accountNumber: '',
        transactionAmount: '',
        debitOrCredit: 'Debit',
        status: '',
        description: ''
      });
      fetchData();
    } catch (error) {
      // console.error('Error creating transaction:', error);
    }
    // console.log(formData);
  };

  return (
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
          <Form.Label className="custom-form-label">Account Number *</Form.Label>
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
  );
};

export default Withdraw;
