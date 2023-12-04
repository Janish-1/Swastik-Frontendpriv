import React, {useState,useEffect} from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import Reports from '../Reports';

export default function Loanreport() {
  const [loanData, setLoanData] = useState([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    loanType: '', // Default value for loanType
    memberNo: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/loanreport', formData);
      setLoanData(response.data);
    } catch (error) {
      console.error('Error fetching loan data:', error);
      // Handle error (display an error message, etc.)
    }
  };

return (
    <div>
      <Reports />
      <div style={{ padding: '20px' }}>
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
              type="text"
              value={formData.memberNo}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit">
        Search
      </Button>
    </Form>
</Col>
</Row>

<hr className="mt-4 mb-4" />

<h2>Loan Report</h2>

<Table striped bordered hover className="mt-2">
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
        <td>{loan.borrower}</td>
        <td>{loan.appliedAmount}</td>
        <td>{loan.repaymentPlan ? loan.repaymentPlan.dueAmount : 'N/A'}</td>
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
