import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Reports from "../Reports";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    transactionType: "",
    transactionStatus: "",
    accountNumber: "",
  });

  const fetchData = async () => {
    const accountResponse = await axios.get(
      `${API_BASE_URL}/readaccountnumbers`
    );
    setAccounts(accountResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${API_BASE_URL}/transactionreport`, {
        params: formData,
      });
      setTransactions(response.data);
    } catch (error) {
      // console.error("Error fetching transaction data:", error);
      // Handle error (display an error message, etc.)
    }
  };

  return (
    <div>
      <Reports />
      <div style={{ padding: "20px" }}>
        <Container>
          <h2 className="mt-4">Transaction</h2>
          <Row className="mt-4">
            <Col>
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Start Date */}
                  <Col md={3} className="mb-2">
                    <Form.Group controlId="startDate">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* End Date */}
                  <Col md={3} className="mb-2">
                    <Form.Group controlId="endDate">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Type Dropdown */}
                  <Col md={2} className="mb-2">
                    <Form.Group controlId="transactionType">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.transactionType}
                        onChange={handleChange}
                      >
                        <option>Debit</option>
                        <option>Credit</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  {/* Status Dropdown */}
                  <Col md={2} className="mb-2">
                    <Form.Group controlId="transactionStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.transactionStatus}
                        onChange={handleChange}
                      >
                        {" "}
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option>All</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  {/* Account Number Input */}
                  <Col md={2} className="mb-2">
                    <Form.Group controlId="accountNumber">
                      <Form.Label>Account Number</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.accountNumber}
                        onChange={handleChange}
                      >
                        <option value="">Choose</option>
                        {accounts.map((accountNumber) => (
                          <option key={accountNumber} value={accountNumber}>
                            {accountNumber}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-2">
                  {/* Search Button */}
                  <Col md={8}>
                    <Button variant="primary" type="submit">
                      Search
                    </Button>
                  </Col>

                  {/* Export to PDF Button */}
                  <Col md={4} className="text-right">
                    <Button variant="danger" type="button">
                      Export to PDF
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>

          {/* Separation Line */}
          <hr className="my-4" />

          {/* Transaction Table */}
          <Table
            responsive
            striped
            bordered
            hover
            className="mt-2 rounded-lg overflow-hidden"
          >
            <thead>
              <th>Date</th>
              <th>Member</th>
              <th>AC Number</th>
              <th>Amount</th>
              <th>DR/CR</th>
              <th>Type</th>
              <th>Status</th>
              <th>Details</th>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.member}</td>
                  <td>{transaction.accountNumber}</td>
                  <td>${transaction.transactionAmount.toFixed(2)}</td>
                  <td>{transaction.debitOrCredit === "Debit" ? "DR" : "CR"}</td>
                  <td>
                    {transaction.debitOrCredit === "Debit" ? "Debit" : "Credit"}
                  </td>
                  <td>{transaction.status}</td>
                  <td>View Details</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
}
