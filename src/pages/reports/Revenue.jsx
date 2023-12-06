import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Reports from "../Reports";

export default function Revenue() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const handleSearch = () => {
    // Handle search logic here
    console.log("Searching with Year:", year, "Month:", month);
  };

  const handleExportToPDF = () => {
    // Handle export to PDF logic here
    console.log("Exporting to PDF");
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
                        <option value="2023">2023</option>
                        {/* Add more years as needed */}
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
                        <option value="January">January</option>
                        {/* Add more months as needed */}
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
            <Col md={6} className="text-right">
              <Button
                variant="danger"
                type="button"
                onClick={handleExportToPDF}
              >
                Export to PDF
              </Button>
            </Col>
          </Row>

          {/* Revenue Table */}
          <Table
            striped
            bordered
            hover
            className="mt-2 rounded-lg overflow-hidden"
          >
            <thead>
              <tr>
                <th>Revenue Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample Data */}
              <tr>
                <td>Sales</td>
                <td>$10,000</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
}
