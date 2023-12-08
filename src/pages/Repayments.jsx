// Repayments.jsx

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("Api URL:", API_BASE_URL);

const Repayments = () => {
  const [showModal, setShowModal] = useState(false);
  const [approvedLoanIds, setApprovedLoanIds] = useState([]);
  const [formData, setFormData] = useState({
    loanId: "",
    paymentDate: new Date(),
    dueDate: new Date(),
    dueAmount: 0,
    principalAmount: 0,
    interest: 0,
    latePenalties: 0,
    totalAmount: 0,
  });
  const [repaymentsData, setRepaymentsData] = useState([]);
  const [filteredRepayments, setFilteredRepayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      loanId: "",
      paymentDate: new Date(),
      dueDate: new Date(),
      dueAmount: 0,
      principalAmount: 0,
      interest: 0,
      latePenalties: 0,
      totalAmount: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "loanId" ? value : parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/repayments`, formData);
      // console.log('Data Successfully entered in Backend Server', response.data.data);
      fetchData();
      handleCloseModal();
      setFormData({
        loanId: "",
        paymentDate: new Date(),
        dueDate: new Date(),
        dueAmount: 0,
        principalAmount: 0,
        interest: 0,
        latePenalties: 0,
        totalAmount: 0,
      });
    } catch (error) {
      // console.error('Some Error in submitting the form data to backend:', error);
      handleCloseModal();
    }
  };
  // Function to check if the user has paid for the current month
  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/checkPaymentStatus?userId=YOUR_USER_ID_HERE`);
      setIsPaid(response.data.isPaid);
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/repayments`);
      setRepaymentsData(response.data.data);
    } catch (error) {
      // console.error('Error fetching repayments:', error);
      // Handle error or display an error message to the user
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/approvedLoans`);
      const data = response.data.data;
      setApprovedLoanIds(data);
      // console.log('Approved Loan Id',data);
    } catch (error) {
      // console.error('Error fetching approved loan IDs:', error);
    }
  };

  useEffect(() => {
    // Fetch data initially on component mount
    fetchData();
    checkPaymentStatus(); // Check payment status on component mount
  }, []);

  const handlePayment = async () => {
    // Logic to handle the payment process (make API call to record payment)
    // ...

    // After payment, update payment status
    setIsPaid(true);
  };

  useEffect(() => {
    const filteredRepayments = repaymentsData.filter((repayment) =>
      repayment.loanId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRepayments(filteredRepayments);
  }, [searchTerm, repaymentsData]);

  return (
    <div className="body-div">
      <div className="d-flex mb-2">
        <Button className="mr-2" onClick={handleOpenModal}>
          Add Repayment
        </Button>
        <FormControl
          className="custom-search-bar"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Repayment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formLoanId">
              <Form.Label>Loan ID</Form.Label>
              <Form.Control
                as="select"
                name="loanId"
                value={formData.loanId}
                onChange={handleInputChange}
              >
                <option value="">Select a Loan ID</option>
                {approvedLoanIds.map((loan) => (
                  <option key={loan._id} value={loan.loanId}>
                    {loan.loanId}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPaymentDate">
              <Form.Label>Payment Date</Form.Label>
              <Form.Control
                type="date"
                name="paymentDate"
                value={formData.paymentDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData((prevData) => ({
                    ...prevData,
                    paymentDate: date,
                  }));
                }}
              />
            </Form.Group>

            <Form.Group controlId="formDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={formData.dueDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData((prevData) => ({
                    ...prevData,
                    dueDate: date,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group controlId="formDueAmount">
              <Form.Label>Due Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Due amount"
                name="dueAmount"
                value={formData.dueAmount}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrincipalAmount">
              <Form.Label>Principal Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter principal amount"
                name="principalAmount"
                value={formData.principalAmount}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formInterest">
              <Form.Label>Interest</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter interest"
                name="interest"
                value={formData.interest}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLatePenalties">
              <Form.Label>Late Penalties</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter late penalties"
                name="latePenalties"
                value={formData.latePenalties}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTotalAmount">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter total amount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Table striped bordered hover className="mt-4 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Payment Date</th>
            <th>Due Date</th>
            <th>Due Amount</th>
            <th>Principal Amount</th>
            <th>Interest</th>
            <th>Late Penalties</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRepayments.map((repayment, index) => (
            <tr key={index}>
              <td>{repayment.loanId}</td>
              <td>{new Date(repayment.paymentDate).toLocaleDateString()}</td>
              <td>{new Date(repayment.dueDate).toLocaleDateString()}</td>
              <td>{repayment.dueAmount}</td>
              <td>{repayment.principalAmount}</td>
              <td>{repayment.interest}</td>
              <td>{repayment.latePenalties}</td>
              <td>{repayment.totalAmount}</td>
              <td>
                {" "}
                {isPaid ? (
                  <p>Paid</p>
                ) : (
                  <Button onClick={handlePayment}>Pay Now</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Repayments;
