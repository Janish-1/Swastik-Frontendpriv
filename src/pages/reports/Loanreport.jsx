import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import Reports from "../Reports";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const API_BASE_URL = process.env.REACT_APP_API_URL;
const FRONT_BASE_URL = process.env.REACT_APP_FRONT_URL;

export default function Loanreport() {
  const [memberNumbers, setmemberNumbers] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    loanType: "", // Default value for loanType
    memberNo: "",
  });

  const downloadPDF = () => {
    const input = document.getElementById("table-to-download");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      // Add Bank Name and Bank ID in the header
      if (`${FRONT_BASE_URL}/logo.png`) {
        pdf.addImage(`${FRONT_BASE_URL}/logo.png`, 'JPEG', 10, 10, 50, 50);
      }

      pdf.setFontSize(16);
      pdf.text("Swastik", 70, 20); // Adjusted position for Bank Name to avoid overlap
      pdf.setFontSize(12);
      pdf.text("Unhel Branch", 70, 30); // Adjusted position for Bank ID to avoid overlap

      pdf.addImage(imgData, "PNG", 0, 70, imgWidth, imgHeight);
      pdf.save("loanreport.pdf");
    });
  };

  // Function to fetch data
  const fetchData = async () => {
    try {
      const membersResponse = await axios.get(`${API_BASE_URL}/loanmembers`);
      const memberNumbers = membersResponse.data.data;
      setmemberNumbers(memberNumbers);
    } catch (error) {
      // // console.error('Error fetching data:', error);
      // Handle error or display an error message
    }
  };

  useEffect(() => {
    // Fetch data initially on component mount
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/loanreport`, formData);
      setLoanData(response.data);
      // // console.log(response);
    } catch (error) {
      // // console.error("Error fetching loan data:", error);
      // Handle error (display an error message, etc.)
    }
  };

  return (
    <div>
      <Reports />
      <div style={{ padding: "20px" }}>
        <Container>
          <Row className="mt-4">
            <Col>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-2">
                    <Form.Group controlId="startDate">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-2">
                    <Form.Group controlId="endDate">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-2">
                    <Form.Group controlId="loanType">
                      <Form.Label>Loan Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.loanType}
                        onChange={handleChange}
                      >
                        <option>Please Select an Option</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Completed</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-2">
                    <Form.Group controlId="memberNo">
                      <Form.Label>Member No.</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.memberNo}
                        onChange={handleChange}
                      >
                        <option value="">Select Member No</option>
                        {memberNumbers.map((memberNo) => (
                          <option key={memberNo} value={memberNo}>
                            {memberNo}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit">
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
              </Form>
            </Col>
          </Row>

          <hr className="mt-4 mb-4" />

          <h2>Loan Report</h2>

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
                <th>Loan ID</th>
                <th>Member No</th>
                <th>Created</th>
                <th>Loan Product</th>
                <th>Borrower</th>
                <th>Applied Amount</th>
                <th>Due Amount</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loanData.map((loan, index) => (
                <tr key={index}>
                  <td>{loan.loanId}</td>
                  <td>{loan.memberNo}</td>
                  <td>{loan.releaseDate}</td>
                  <td>{loan.loanProduct}</td>
                  <td>{loan.memberName}</td>
                  <td>{loan.appliedAmount}</td>
                  <td>{loan.dueAmount !== null ? loan.dueAmount : "N/A"}</td>
                  <td>{loan.status}</td>
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
