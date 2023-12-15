import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Loans = ({ id, memberData }) => {
  const [memberDetails, setMemberDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const memberNo = memberData.memberNo;
  console.log(id, memberData);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/loansbymember/${memberNo}`);

        if (isMounted) {
          const data = response.data.data;
          if (Array.isArray(data)) {
            setMemberDetails(data);
            setLoading(false);
          } else {
            console.error('Error: Response data is not an array');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, memberNo]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Display table only if memberDetails is an array
  if (!Array.isArray(memberDetails) || memberDetails.length === 0) {
    return <p>No data available</p>;
  }

  const fieldsToDisplay = ['loanId', 'loanProduct', 'appliedAmount', 'status'];

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
          {memberDetails.map((item, index) => (
            <tr key={index}>
              {fieldsToDisplay.map((field) => (
                <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item[field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Loans;
