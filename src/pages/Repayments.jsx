// Repayments.jsx

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios, { Axios } from "axios";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from 'jspdf';

const FRONT_BASE_URL = process.env.REACT_APP_FRONT_URL;
const API_BASE_URL = process.env.REACT_APP_API_URL;

const Repayments = () => {
  const [showModal, setShowModal] = useState(false);
  const [approvedLoanIds, setApprovedLoanIds] = useState([]);
  const [printdata, setprintdat] = useState({});
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
      // Validation checks
      const missingFields = [];
      if (!formData.loanId) missingFields.push("Loan ID");
      if (!formData.paymentDate) missingFields.push("Payment Date");
      if (!formData.dueDate) missingFields.push("Due Date");
      if (!formData.dueAmount) missingFields.push("Due Amount");
      if (!formData.principalAmount) missingFields.push("Principal Amount");
      if (!formData.interest) missingFields.push("Interest");
      if (!formData.latePenalties) missingFields.push("Late Penalties");
      if (!formData.totalAmount) missingFields.push("Total Amount");

      if (missingFields.length > 0) {
        const missingFieldsMessage = "Please fill in the following fields: " + missingFields.join(", ");
        window.alert(missingFieldsMessage);
        return;
      }
      
      const response = await axios.post(`${API_BASE_URL}/repayments`, formData);
      // Show success alert for form submission
      window.alert("Repayment data submitted successfully");
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
      // Handle error and show error alert
      window.alert("Error submitting repayment data. Please try again.");
      handleCloseModal();
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/repayments`);
      setRepaymentsData(response.data.data);
      console.log("Response Data repayments:", response);
    } catch (error) {
      // Handle error or display an error message to the user
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/approvedLoansNotInRepayment`);
      const data = response.data.data;
      setApprovedLoanIds(data);
      // // console.log('Approved Loan Id',data);
    } catch (error) {
      // // console.error('Error fetching approved loan IDs:', error);
    }
  };

  const checkRepaymentExists = async (loanId) => {
    try {
      // // console.log("loan Id:", loanId); // String Output
      // Fetch the repayment details using the repaymentId
      // const responsea = await axios.get(`${API_BASE_URL}/repayments/${repaymentId}/loanId`);
      // const loanId = responsea.data.data.loanId;

      const response = await axios.get(
        `${API_BASE_URL}/api/checkRepaymentExists/${loanId}`
      );
      return response.data.exists;
    } catch (error) {
      // // console.error("Error checking repayment:", error);
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
        // Show success alert for payment
        window.alert("Repayment marked as paid successfully.");
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
          // Show success alert for payment and data creation
          window.alert("Repayment marked as paid, and data created for the current month.");
        } else {
          // Handle failure to create repayment data and show error alert
          window.alert("Failed to create repayment data for the current month.");
        }
      }
    } catch (error) {
      // Handle errors or display a message to the user
      window.alert("Error handling payment. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredRepayments = repaymentsData.filter((repayment) => {
      const loanId = repayment.loanId;

      // Check if loanId is a non-null integer before filtering
      if (Number.isInteger(loanId) && loanId.toString().includes(searchTerm.toString())) {
        return true;
      }

      return false;
    });

    setFilteredRepayments(filteredRepayments);
  }, [searchTerm, repaymentsData]);

  const handleprint = async (repaymentId) => {
    const response = await axios.get(`${API_BASE_URL}/repayments/${repaymentId}`)
    setprintdat(response.data.data);
    console.log("Print Data: ", printdata);
    generateBankDocumentPDF();
    console.log("Print Clicked");
  };

  const generateBankDocumentPDF = () => {
    const doc = new jsPDF();

    // Add Border around the whole document
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 280);

    // Add Bank Name and Bank ID in the header
    if (`${FRONT_BASE_URL}/logo.png`) {
      doc.addImage(`${FRONT_BASE_URL}/logo.png`, 'JPEG', 10, 10, 50, 50);
    }

    doc.setFontSize(16);
    doc.text("Swastik", 70, 20); // Adjusted position for Bank Name to avoid overlap
    doc.setFontSize(12);
    doc.text("Unhel Branch", 70, 30); // Adjusted position for Bank ID to avoid overlap
    doc.text("REGP. Office 1st Floor,Purani Sabji Mandi Unhel, Dist.Ujjain(M.P)",70,40);
    doc.text("Pincode 456221",70,50);
    doc.line(5, 60, 205, 60); // Line to separate header from content

    // Personal Information Section
    doc.text("Repayment Information", 15, 68);
    doc.line(5, 70, 205, 70); // Line to separate sections
    doc.text(`Loan ID: ${printdata["loanId"] || 'Undefined'}`, 15, 78);
    doc.text(`Interest: ${printdata["interest"] || 'Undefined'}`, 65, 78);
    doc.text(`Due Amount: ${printdata["dueAmount"] || 'Undefined'}`, 125, 78);
    doc.text(`Late Penalties: ${printdata["latePenalties"] || 'Undefined'}`, 15, 88);
    doc.text(`Due Date: ${new Date(printdata["dueDate"]).toLocaleString() || 'Undefined'}`, 85, 88);
    doc.text(`Payment Date: ${new Date(printdata["paymentDate"]).toLocaleString() || 'Undefined'}`, 65, 98);
    doc.text(`Principal Amount: ${printdata["principalAmount"] || 'Undefined'}`, 15, 98);
    doc.text(`Total Amount: ${printdata["totalAmount"] || 'Undefined'}`, 155, 98);

    doc.save('bank_document.pdf');
  };

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
            <Form.Group controlId="formTotalAmount" className="mb-3">
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

      <Table responsive striped bordered hover className="mt-4 rounded-lg overflow-hidden">
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
            <th>Print</th>
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
              <td><Button onClick={() => handleprint(repayment._id)}>Print</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Repayments;