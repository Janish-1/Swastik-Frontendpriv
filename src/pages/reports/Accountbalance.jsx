import React, { useState,useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Reports from "../Reports";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("Api URL:", API_BASE_URL);

export default function AccountBalance() {
  const [tableData, setTableData] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [accounts, setAccounts] = useState([]);

  const fetchData = async () => {
    const accountResponse = await axios.get(
      `${API_BASE_URL}/readaccountnumbers`
    );
    setAccounts(accountResponse.data);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/accountDetails/${accountNumber}`
      );
      setTableData([response.data]); // Set the fetched data to the state
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]); // Clear any previous data
    }
  };

  useEffect(() =>{
    fetchData();
  }, []);


  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchData(); // Call the fetchData function on form submit
  };

  const renderTableContent = () => {
    if (tableData.length === 0) {
      return (
        <tr>
          <td colSpan="4">No data available</td>
        </tr>
      );
    }

    return tableData.map((dataRow, index) => (
      <tr key={index}>
        <td>{dataRow.accountNumber}</td>
        <td>{dataRow.availableBalance}</td>
        <td>{dataRow.associatedLoanIds}</td>
        <td>{dataRow.currentBalance}</td>
      </tr>
    ));
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
                  <Form.Label>Select Account:</Form.Label>
                  <Form.Select
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  >
                    <option value="">Choose</option>
                    {accounts.map((accountNumber) => (
                      <option key={accountNumber} value={accountNumber}>
                        {accountNumber}
                      </option>
                    ))}
                  </Form.Select>
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
            <tbody>{renderTableContent()}</tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
}
