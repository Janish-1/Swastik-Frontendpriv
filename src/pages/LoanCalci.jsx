// Import necessary components
import { Card, Form, Button,Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function LoanCalci() {
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [tenure, setTenure] = useState('');
    const [emi, setEMI] = useState(null);
    const [totalInterest, setTotalInterest] = useState(null);
    const [totalPayment, setTotalPayment] = useState(null);

  const calculateEMI = () => {
    if (!amount || !interestRate || !tenure) {
      return;
    }

    const principal = parseFloat(amount);
    const monthlyInterestRate = parseFloat(interestRate) / 12 / 100;
    const numberOfMonths = parseFloat(tenure);

    let calculatedEMI;
    if (monthlyInterestRate === 0) {
      calculatedEMI = principal / numberOfMonths;
    } else {
      calculatedEMI =
        (principal *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
        (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);
    }

    const totalInterestPayable = (calculatedEMI * numberOfMonths) - principal;
    const totalPaymentValue = principal + totalInterestPayable;

    setEMI(calculatedEMI);
    setTotalInterest(totalInterestPayable);
    setTotalPayment(totalPaymentValue);
  };
  
  return (
    <div className="container mx-auto p-4">
       <h1 className="text-3xl m-2 text-cyan-500 font-medium">
          Loan Calculator
        </h1>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter loan amount"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interest Rate (%)</Form.Label>
              <Form.Control
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tenure</Form.Label>
              <Form.Control
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="Enter tenure in months"
              />
            </Form.Group>
            <Button onClick={calculateEMI} variant="primary">
              Calculate EMI
            </Button>
          </Form>
        </Card.Body>
      </Card>
      


      {emi && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>EMI Details</Card.Title>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Monthly Payment (EMI)</td>
                  <td>₹{emi.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Total Interest Payable</td>
                  <td>₹{totalInterest.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Total Payment (Principal + Interest)</td>
                  <td>₹{totalPayment.toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}


    </div>
  );
}

export default LoanCalci;
