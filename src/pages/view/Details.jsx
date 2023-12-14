import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Details = ({ id }) => {
  const [memberDetails, setMemberDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getmember/${id}`);
        const data = response.data; // Assuming data is an object
        setMemberDetails(data);
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

  // Specify the fields you want to display
  const fieldsToDisplay = ['memberNo', 'firstName', 'lastName', 'email', 'branchName', 'aadhar', 'pancard'];
  
  // Specify the fields that are images
  const imageFields = ['photo'];

  return (
    <div>
      <Table bordered striped responsive>
        <tbody>
          {imageFields.map((field) => (
            <tr key={field}>
              <th>{field}</th>
              <td>
                {memberDetails[field] && 
                <img 
                    src={memberDetails[field]} 
                    alt={field} 
                    style={{ maxWidth: '100px', maxHeight: '100px' }} 
                />}
              </td>
            </tr>
          ))}
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

export default Details;
