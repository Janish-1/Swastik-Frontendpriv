import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Reports from "../Reports";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

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
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, expenseType]);

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
            <Col md={6} className="text-right">
              <Button variant="danger" type="button">
                Export to PDF
              </Button>
            </Col>
          </Row>

          {/* Expense Table */}
          <Table
            striped
            bordered
            hover
            className="mt-2 rounded-lg overflow-hidden"
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
