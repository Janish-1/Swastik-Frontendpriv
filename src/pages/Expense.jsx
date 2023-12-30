import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table,Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const Expense = () => {
  const [showModal, setShowModal] = useState(false);
  const [branchNames, setBranchNames] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date(),
    category: "",
    amount: "",
    reference: "",
    note: "",
    branchName: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(categoriesResponse.data); // Assuming data is an array of categories

      const expensesResponse = await axios.get(`${API_BASE_URL}/expenses`);
      setExpenses(expensesResponse.data); // Assuming the response data contains an array of expenses

      const branchNamesResponse = await axios.get(
        `${API_BASE_URL}/branches/names`
      );
      setBranchNames(branchNamesResponse.data.data);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, {
        name: newCategory,
      });

      if (response.status === 201) {
        setNewCategory("");
        fetchData();
      } else {
        // console.error("Failed to add category");
      }
    } catch (error) {
      // console.error("Error adding category:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date,
    }));
  };

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    // Reset form data when the modal is closed
    setFormData({
      date: new Date(),
      category: "",
      amount: "",
      reference: "",
      note: "",
      branchName: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/expenses`, formData);
      setFormData({
        date: new Date(),
        category: "",
        amount: "",
        reference: "",
        note: "",
        branchName: "",
      });
      fetchData();
    } catch (error) {
      // console.error("Error creating Expense:", error);
    }
    handleModalClose();
  };
  
  const handleBranchSelect = (event) => {
    setSelectedBranch(event.target.value);
  };

  return (
    <div className="body-div">
      <div style={{ marginBottom: "3px" }}>
        <Button variant="primary" onClick={handleModalShow}>
          Add Expense
        </Button>
        <Form onSubmit={handleBranchSelect}>
          <Row className="mb-3">
            <Col xs={6} md={3}>
              <Form.Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="custom-select"
              >
                <option value="All">All Branches</option>
                {branchNames.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} md={3}>
              <Button type="submit" variant="primary">
                Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <br />
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBranch">
                  <Form.Label>Branch</Form.Label>
                  <Form.Control
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    as="select"
                  >
                    <option value="">Select Branch</option>
                    {branchNames.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>{" "}
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date.toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange(date);
                }}
              />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select or Add Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value="newCategory">Add New Category</option>
              </Form.Control>
              {formData.category === "newCategory" && (
                <div>
                  <Form.Control
                    type="text"
                    placeholder="Enter New Category"
                    name="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-2"
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddCategory}
                    className="mt-2"
                  >
                    Add Category
                  </Button>
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="reference">
              <Form.Label>Reference</Form.Label>
              <Form.Control
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="note">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="note"
                value={formData.note}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Expense
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Table responsive striped bordered hover className="rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Note</th>
            <th>Branch Name</th>
          </tr>
        </thead>
        <tbody>
        {expenses
          .filter((expense) => selectedBranch === "All" || expense.branchName === selectedBranch)
          .map((expense, index) => (
            <tr key={index}>
              <td>{new Date(expense.date).toISOString().split("T")[0]}</td>
              <td>{expense.category}</td>
              <td>{expense.amount}</td>
              <td>{expense.reference}</td>
              <td>{expense.note}</td>
              <td>{expense.branchName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Expense;
