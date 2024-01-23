import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import Reports from "../Reports";
import axios from "axios";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const API_BASE_URL = process.env.REACT_APP_API_URL;
// // console.log("Api URL:", API_BASE_URL);

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

  useEffect(() => {
    fetchData();
  }, []);

  const downloadPDF = () => {
    const input = document.getElementById("table-to-download");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("accountstatement.pdf");
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
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
                  <Col md={9}>
                    <Button
                      className="justify-start mt-2"
                      variant="danger"
                      type="button"
                      onClick={downloadPDF}
                    >
                      Export to PDF
                    </Button>
                  </Col>
                  {/* <Button className="justify-start ml-2" variant="danger" onClick={handleExportToPDF}>
                    Export to PDF
                  </Button> */}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>

        <hr />
        <br />

        <Table
          responsive
          striped
          bordered
          hover
          className="rounded-lg overflow-hidden"
          id="table-to-download" // Add an ID to the table
        >
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
                  <td>
                    {new Date(+new Date(transaction.Date)).toLocaleString()}
                  </td>
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