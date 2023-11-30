// // Deposit.jsx

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Container } from 'react-bootstrap';


// const Deposit = () => {
//   const [formData, setFormData] = useState({
//     date: '',
//     member: '',
//     accountNumber: '',
//     amount: '',
//     status: 'Completed',
//     description: '',
//   });

//   const [members, setMembers] = useState([]);
//   const [accounts, setAccounts] = useState([]);

//   useEffect(() => {
//     // Fetch members from API
//     fetchMembers();

//     // Fetch accounts from API
//     fetchAccounts();
//   }, []);

//   const fetchMembers = async () => {
//     try {
//       // Replace 'your-members-api-endpoint' with the actual API endpoint for members
//       const response = await fetch('your-members-api-endpoint');
//       const data = await response.json();
//       setMembers(data); // Assuming data is an array of members
//     } catch (error) {
//       console.error('Error fetching members:', error);
//     }
//   };

//   const fetchAccounts = async () => {
//     try {
//       // Replace 'your-accounts-api-endpoint' with the actual API endpoint for accounts
//       const response = await fetch('your-accounts-api-endpoint');
//       const data = await response.json();
//       setAccounts(data); // Assuming data is an array of accounts
//     } catch (error) {
//       console.error('Error fetching accounts:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add logic to send form data to your API
//     console.log(formData);
//   };

//   return (
//     <div className='body-div'>
//     <Container>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="date">
//           <Form.Label>Date *</Form.Label>
//           <Form.Control
          
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleInputChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="member">
//           <Form.Label>Member *</Form.Label>
//           <Form.Control
//             as="select"
//             name="member"
//             value={formData.member}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="">Select Member</option>
//             {members.map((member) => (
//               <option key={member.id} value={member.id}>
//                 {member.name}
//               </option>
//             ))}
//           </Form.Control>
//         </Form.Group>
//         <Form.Group controlId="accountNumber">
//           <Form.Label>Account Number *</Form.Label>
//           <Form.Control
//             as="select"
//             name="accountNumber"
//             value={formData.accountNumber}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="">Select Account</option>
//             {accounts.map((account) => (
//               <option key={account.id} value={account.accountNumber}>
//                 {account.accountNumber}
//               </option>
//             ))}
//           </Form.Control>
//         </Form.Group>
//         <Form.Group controlId="amount">
//           <Form.Label>Amount *</Form.Label>
//           <Form.Control
//             type="number"
//             name="amount"
//             value={formData.amount}
//             onChange={handleInputChange}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="status">
//           <Form.Label>Status *</Form.Label>
//           <Form.Control
//             as="select"
//             name="status"
//             value={formData.status}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="Completed">Completed</option>
//             <option value="Pending">Pending</option>
//             <option value="Cancelled">Cancelled</option>
//           </Form.Control>
//         </Form.Group>
//         <Form.Group controlId="description">
//           <Form.Label>Description *</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={4}
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             required
//           />
//         </Form.Group>
//         <Button variant="primary" type="submit">
//           Submit
//         </Button>
//       </Form>
//     </Container>
//     </div>
//   );
// };

// export default Deposit;



import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './depositform.css'; // Import the custom CSS file

const Deposit = () => {
  const [formData, setFormData] = useState({
    date: '',
    member: '',
    accountNumber: '',
    amount: '',
    status: 'Completed',
    description: '',
  });

  const [members, setMembers] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Fetch members from API
    fetchMembers();

    // Fetch accounts from API
    fetchAccounts();
  }, []);

  const fetchMembers = async () => {
    try {
      // Replace 'your-members-api-endpoint' with the actual API endpoint for members
      const response = await fetch('your-members-api-endpoint');
      const data = await response.json();
      setMembers(data); // Assuming data is an array of members
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      // Replace 'your-accounts-api-endpoint' with the actual API endpoint for accounts
      const response = await fetch('your-accounts-api-endpoint');
      const data = await response.json();
      setAccounts(data); // Assuming data is an array of accounts
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to send form data to your API
    console.log(formData);
  };

  return (
    <div className='body-div'>
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="date">
          <Form.Label className="custom-form-label">Date *</Form.Label>
          <Form.Control
          className="custom-form-control"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="member">
          <Form.Label className="custom-form-label">Member *</Form.Label>
          <Form.Control
          className="custom-form-control"
            as="select"
            name="member"
            value={formData.member}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="accountNumber">
          <Form.Label className="custom-form-label">Account Number *</Form.Label>
          <Form.Control
          className="custom-form-control"
            as="select"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.accountNumber}>
                {account.accountNumber}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="amount">
          <Form.Label className="custom-form-label">Amount *</Form.Label>
          <Form.Control
          className="custom-form-control"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="status">
          <Form.Label className="custom-form-label">Status *</Form.Label>
          <Form.Control
          className="custom-form-control"
            as="select"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label className="custom-form-label">Description *</Form.Label>
          <Form.Control
          className="custom-form-control"
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
    </div>
  );
};

export default Deposit;
