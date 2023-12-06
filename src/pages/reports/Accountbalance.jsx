import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Reports from "../Reports";
import axios from "axios";

export default function AccountBalance() {
  const [tableData, setTableData] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/account-details?accountNumber=${accountNumber}`
      );
      // Axios response data can be accessed directly
      setTableData(response.data); // Set the fetched data to the state
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors, for example, display a message to the user
      // You might want to set an empty array to tableData here to clear any previous data
      setTableData([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchData(); // Call the fetchData function on form submit
  };

  return (
    <div>
      <Reports />
      <br />
      <div style={{ padding: "20px" }}>
        <Container>
          <Row className="mt-4">
            <Col md={6} className="d-flex">
              <Form onSubmit={handleSearch} className="mr-2 flex-grow-1">
                <Form.Group controlId="accountNumber">
                  <Form.Label>Account No.</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Account no."
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-8">
                  Search
                </Button>
              </Form>
            </Col>
          </Row>

          <hr className="mt-4 mb-4" />

          <h2>Account Balance</h2>

          <Table
            striped
            bordered
            hover
            className="mt-2 rounded-lg overflow-hidden"
          >
            <thead>
              <tr>
                <th>Account No.</th>
                <th>Balance</th>
                <th>Loan</th>
                <th>Current Balance</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((dataRow, index) => (
                <tr key={index}>
                  <td>{dataRow.accountNumber}</td>
                  <td>{dataRow.balance}</td>
                  <td>{dataRow.loanAmount}</td>
                  <td>{dataRow.currentBalance}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
}
