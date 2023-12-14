import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Transactions = ({ id }) => {
  const [memberDetails, setMemberDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/accountDetails/${id}`);
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
  const fieldsToDisplay = ['accountNumber', 'availableBalance', 'CurrentBalance', 'associatedLoanIds'];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-auto border-collapse border border-gray-400">
        <thead className="bg-gray-50">
          <tr>
            {fieldsToDisplay.map((field) => (
              <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            {fieldsToDisplay.map((field) => (
              <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {memberDetails[field]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
