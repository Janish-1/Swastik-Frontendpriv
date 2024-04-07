import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Transactions = ({ id }) => {
  const [transactions, settransactions] = useState({});
  const [loading, setLoading] = useState(true);

  // console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/transactionsbymember/${id}`);
        const newresponse = response.data.data; // Assuming data is an object
        // const newData ={
        //   "Account Number":newresponse.accountNumber,
        //   "Balance":newresponse.currentBalancemoment,
        //   "Transaction Amount":newresponse.transactionAmount,
        //   "Debit or Credit":newresponse.debitOrCredit,
        // }
        settransactions(newresponse);
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
  const fieldsToDisplay = ['Account Number', 'Balance', 'Transaction Amount', 'Debit or Credit'];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-auto border-collapse border border-gray-400">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit or Credit</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.accountNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.currentBalancemoment}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.transactionAmount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.debitOrCredit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
