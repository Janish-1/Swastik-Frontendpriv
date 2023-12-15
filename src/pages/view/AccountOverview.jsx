import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AccountOverview = ({ id }) => {
  const [memberDetails, setMemberDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/memberAccountDetails/${id}`);
        const data = response.data;

        const newData = {
          "Account Number": data.accountNumber,
          "Available Balance": data.availableBalance,
          "Current Balance": data.currentBalance,
          "Associated Loans": data.associatedLoanIds,
        };

        setMemberDetails(newData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const fieldsToDisplay = ['Account Number', 'Available Balance', 'Current Balance', 'Associated Loans'];


  // Specify the fields that are images
// const imageFields = ['photo'];

  return (
    <div>
      <Table bordered striped responsive>
        <tbody>
         
          {fieldsToDisplay.map((field) => (
            <tr key={field}>
              <th>{field}</th>
              <td>{memberDetails[field]}</td>
            </tr>
          ))}
        </tbody>
       
      </Table>
    </div>
  );
};

export default AccountOverview;
