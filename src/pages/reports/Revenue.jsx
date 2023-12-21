import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import Reports from "../Reports";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// // console.log("Api URL:", API_BASE_URL);

export default function Revenue() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [revenueData, setRevenueData] = useState({});

  const downloadPDF = () => {
    const input = document.getElementById("table-to-download");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("revenue.pdf");
    });
  };

  const handleSearch = async () => {
    try {
      const monthNumber = getMonthNumber(month); // Convert month name to number
      const response = await axios.get(
        `${API_BASE_URL}/calculate-revenue?year=${year}&month=${monthNumber}`
      );
      setRevenueData(response.data);
    } catch (error) {
      // // console.error("Error fetching revenue data:", error);
      setRevenueData({});
    }
  };

  // Function to generate year options from 2023 to 2050
  const generateYearOptions = () => {
    const years = [];
    for (let i = 2023; i <= 2050; i++) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return years;
  };

  // Function to generate month options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Helper function to convert month name to number
  const getMonthNumber = (monthName) => {
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };
    return months[monthName];
  };

  const handleExportToPDF = () => {
    // // console.log("Exporting to PDF");
    // Implement PDF export logic here
  };

  return (
    <div>
      <Reports />
      <div style={{ padding: "20px" }}>
        <Container>
          <h2 className="mt-4">Revenue</h2>
          <Row className="mt-4">
            <Col>
              <Form>
                <Row>
                  {/* Year Dropdown */}
                  <Col md={3} className="mb-2">
                    <Form.Group controlId="year">
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        as="select"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="">Select Year</option>
                        {generateYearOptions()}
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  {/* Month Dropdown */}
                  <Col md={3} className="mb-2">
                    <Form.Group controlId="month">
                      <Form.Label>Month</Form.Label>
                      <Form.Control
                        as="select"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option value="">Select Month</option>
                        {months.map((m, index) => (
                          <option key={index} value={m}>
                            {m}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  {/* Search Button */}
                  <Col
                    md={3}
                    className="mb-2"
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          {/* Separation Line */}
          <hr className="my-4" />
          <h2>Revenue Report</h2>
          {/* Search Bar and Export PDF Button */}
          <Row className="mt-4">
            <Col md={6}>
              <Form>
                <Form.Group controlId="revenueSearch">
                  <Form.Control type="text" placeholder="Search..." />
                </Form.Group>
              </Form>
            </Col>
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
          </Row>
          <Table
            responsive
            striped
            bordered
            hover
            className="mt-2 rounded-lg overflow-hidden"
            id="table-to-download" // Add an ID to the table
          >
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Revenue Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {revenueData && Object.keys(revenueData).length > 0 ? (
                <tr>
                  <td>{year}</td>
                  <td>{month}</td>
                  <td>Loan</td>
                  <td>{revenueData.monthlyRevenue}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4">No revenue data available</td>
                </tr>
              )}
            </tbody>
          </Table>{" "}
        </Container>
      </div>
    </div>
  );
}
