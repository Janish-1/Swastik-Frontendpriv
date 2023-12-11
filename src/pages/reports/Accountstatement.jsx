import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import Reports from "../Reports";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const AccountStatement = () => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accounts, setAccounts] = useState([]);

  const fetchData = async () => {
    const accountResponse = await axios.get(
      `${API_BASE_URL}/readaccountnumbers`
    );
    setAccounts(accountResponse.data);
    try {
      const response = await axios.get(`${API_BASE_URL}/accountstatement`, {
        params: {
          accountNumber,
          startDate,
          endDate,
        },
      });

      if (response.status === 200) {
        const transactionsData = response.data || [];
        setTransactions(transactionsData);
      } else {
        // console.error("Failed to fetch data");
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() =>{
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleExportToPDF = () => {
    const blob = new Blob([<MyDocument data={data} />], {
      type: "application/pdf",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "AccStatement.pdf";
    link.click();
  };
  return (
    <div>
      <Reports />
      <br />
      <div style={{ padding: "20px" }}>
        <Row className="mb-3">
          <Col>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Start Date:</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Label>End Date:</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Col>
                <Col>
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
                </Col>
                <Col>
                  <Button variant="primary" type="submit" className="mt-8">
                    Search
                  </Button>
                  <Button variant="danger" onClick={handleExportToPDF}>
                    Export to PDF
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>

        <hr />
        <br />

        <Table striped bordered hover className="rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                  <td>{transaction.Description}</td>
                  <td>{transaction.Debit}</td>
                  <td>{transaction.Credit}</td>
                  <td>{transaction.Balance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  {transactions.length === 0
                    ? "No transactions found"
                    : "Loading..."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AccountStatement;
