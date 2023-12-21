import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Details = ({ id, memberData }) => {
  const [memberDetails, setMemberDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // console.log(id,memberData);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getmember/${id}`);
        const data = response.data; // Assuming data is an object
        // console.log(data);
        const newData = {
          "Profile": data.photo,
          "Member ID":data.memberNo,
          "Name":data.fullName,
          "Email":data.email,
          "Branch":data.branchName,
          "ID Proof":data.idProof,
        }
        setMemberDetails(newData);
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Specify the fields you want to display
  const fieldsToDisplay = ['Member ID', 'Name', 'Email', 'Branch'];
  
  // Specify the fields that are images
  const imageFields = ['Profile','ID Proof'];

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
