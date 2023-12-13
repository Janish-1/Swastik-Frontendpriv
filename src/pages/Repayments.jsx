// Repayments.jsx

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

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
  const [repaymentExists, setRepaymentExists] = useState(false);

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

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/repayments`);
      setRepaymentsData(response.data.data);
      console.log(response);
    } catch (error) {
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

  const checkRepaymentExists = async (loanId) => {
    try {
      // console.log("loan Id:", loanId); // String Output
      // Fetch the repayment details using the repaymentId
      // const responsea = await axios.get(`${API_BASE_URL}/repayments/${repaymentId}/loanId`);
      // const loanId = responsea.data.data.loanId;

      const response = await axios.get(
        `${API_BASE_URL}/api/checkRepaymentExists/${loanId}`
      );
      return response.data.exists;
    } catch (error) {
      // console.error("Error checking repayment:", error);
      return false;
    }
  };

  const handlePayment = async (repaymentId) => {
    try {
      // Fetch the repayment details using the repaymentId
      const response = await axios.get(
        `${API_BASE_URL}/repayments/${repaymentId}/loanId`
      );
      const loanId = response.data.data.loanId;

      const repaymentExists = await checkRepaymentExists(loanId);

      if (repaymentExists) {
        setRepaymentsData((prevRepaymentsData) =>
          prevRepaymentsData.map((repayment) =>
            repayment._id === repaymentId
              ? { ...repayment, isPaid: true }
              : repayment
          )
        );
        // console.log("Repayment data exists for the current month.");
      } else {
        const createResponse = await axios.post(
          `${API_BASE_URL}/api/updatePaymentAndCreateDetails/${repaymentId}`
        );

        if (createResponse.status === 200) {
          setRepaymentsData((prevRepaymentsData) =>
            prevRepaymentsData.map((repayment) =>
              repayment._id === repaymentId
                ? { ...repayment, isPaid: true }
                : repayment
            )
          );
          // console.log(
          //   "Repayment data created for the current month:",
          //   createResponse.data.repaymentData
          // );
        } else {
          // console.log("Failed to create repayment data for the current month.");
          // Handle failure to create repayment data
        }
      }
    } catch (error) {
      // console.error("Error handling payment:", error);
      // Handle errors or display a message to the user
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            {/* <Form.Group controlId="formPaymentDate">
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
            </Form.Group> */}

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
            <th>Month Status</th>
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
                <Button
                  onClick={() => handlePayment(repayment._id)}
                  disabled={
                    repayment.isPaid || repayment.monthstatus === "paid"
                  }
                >
                  {repayment.isPaid || repayment.monthstatus === "paid"
                    ? "Paid"
                    : "Pay Now"}
                </Button>
              </td>
              <td>{repayment.monthstatus}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Repayments;
