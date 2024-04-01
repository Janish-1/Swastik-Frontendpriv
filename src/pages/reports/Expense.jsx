import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Reports from "../Reports";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const API_BASE_URL = process.env.REACT_APP_API_URL;
const FRONT_BASE_URL = process.env.REACT_APP_FRONT_URL;

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Update handleInputChange to set the selected option correctly
  const handleInputChange = (e) => {
    const { value } = e.target;
    setExpenseType(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories with axios.get including parameters
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/categories`,
          {
            params: {
              startDate: startDate,
              endDate: endDate,
              expenseType: expenseType,
            },
          }
        );
        setCategories(categoriesResponse.data);

        // Construct the URL for fetching expenses with parameters
        let url = `${API_BASE_URL}/reportexpenses`;
        const params = {
          startDate,
          endDate,
          expenseType,
          sortBy: "date", // Change this based on the desired sorting field
          sortOrder: "desc", // Change this based on the desired sorting order ('asc' or 'desc')
        };

        const queryParams = new URLSearchParams(params).toString();
        const fullUrl = `${url}?${queryParams}`;

        const expensesResponse = await axios.get(fullUrl);
        setExpenses(expensesResponse.data);
      } catch (error) {
        // // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, expenseType]);

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
      pdf.text("REGP. Office 1st Floor,Purani Sabji Mandi Unhel, Dist.Ujjain(M.P)",70,40);
      pdf.text("Pincode 456221",70,50);

      pdf.addImage(imgData, "PNG", 0, 70, imgWidth, imgHeight);
      pdf.save("expense.pdf");
    });
  };

  // Function to filter expenses based on the reference field
  const filteredExpenses = expenses.filter((expense) => {
    return expense.reference.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Reports />

      <div style={{ padding: "20px" }}>
        <Container>
          <h2 className="mt-4">Expense</h2>

          <Row className="mt-4">
            <Col>
              <Form>
                <Row>
                  {/* Start Date */}
                  <Col md={3} className="mb-2">
                    <Form.Group controlId="startDate">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  {/* End Date */}
                  <Col md={3} className="mb-2">
                    <Form.Group controlId="endDate">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  {/* Expense Type Dropdown */}
                  <Col md={3} className="mb-2">
                    <Form.Group controlId="expenseType">
                      <Form.Label>Expense Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={expenseType}
                        name="expenseType"
                        onChange={handleInputChange}
                      >
                        <option value="">Select Expense Type</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                {/* Search Button */}
                <Button variant="primary" type="button">
                  Search
                </Button>
              </Form>
            </Col>
          </Row>

          {/* Separation Line */}
          <hr className="my-4" />

          <h2>Expense Report</h2>

          {/* Search Bar and Export PDF Button */}
          <Row className="mt-4">
            <Col md={6}>
              <Form>
                <Form.Group controlId="expenseSearch">
                  <Form.Control
                    type="text"
                    placeholder="Search Reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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

          {/* Expense Table */}
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
                <th>Date</th>
                <th>Reference</th>
                <th>Expense Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.date}</td>
                  <td>{expense.reference}</td>
                  <td>{expense.category}</td>
                  <td>{expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
}
