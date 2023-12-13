import React, { useEffect, useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosMore } from "react-icons/io";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

// import Button from 'react-bootstrap/Button';
import { Stacked, Pie, Button, LineChart, SparkLine } from "../components";
import {
  earningData,
  medicalproBranding,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  ecomPieChartData,
} from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import product9 from "../data/product9.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const path = require('path');
// const dotenv = require('dotenv');

// const envPath = path.resolve(__dirname, '../.env');

// dotenv.config({ path: envPath });

const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id="time"
      fields={{ text: "Time", value: "Id" }}
      style={{ border: "none", color: currentMode === "Dark" && "white" }}
      value="1"
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth="120px"
    />
  </div>
);

const AgentDash = () => {
  const { currentColor, currentMode } = useStateContext();
  const [totalMembers, setTotalMembers] = useState();
  const [TotalLoanAmount, setTotalLoanAmount] = useState();
  const [totalCurrentBalance, settotalCurrentBalance] = useState();
  const [pendingLoans, setPendingLoans] = useState();
  const [transactions, setTransactions] = useState([]);

  // Get the token from localStorage
  const token = localStorage.getItem("token");

  if (token) {
    // Split the token into its components (header, payload, signature)
    const tokenParts = token.split(".");

    // Decode the payload (which is the second part of the token)
    const encodedPayload = tokenParts[1];

    // Decode the Base64 encoded payload to get the actual data
    const decodedPayload = atob(encodedPayload);

    // Parse the JSON data to get the object representation of the payload
    const payload = JSON.parse(decodedPayload);

    // Log the token and its payload
    // console.log("Token:", token);
    // console.log("Payload:", payload);
    // console.log("Role: ", payload.role);
  } else {
    // console.log("Token not found in localStorage");
  }

  // Fetch data for total members, deposit requests, withdraw requests, and pending loans
  const fetchData = async () => {
    try {
      const membersResponse = await axios.get(`${API_BASE_URL}/countMembers`);
      setTotalMembers(membersResponse.data.count);

      const totalLoanAmount = await axios.get(
        `${API_BASE_URL}/totalLoanAmount`
      );
      setTotalLoanAmount(totalLoanAmount.data.totalLoanAmount);

      const totalCurrentBalance = await axios.get(
        `${API_BASE_URL}/totalCurrentBalance`
      );
      settotalCurrentBalance(totalCurrentBalance.data.totalCurrentBalance);

      const loansResponse = await axios.get(`${API_BASE_URL}/pendingLoans`);
      setPendingLoans(loansResponse.data.data.length);

      const transactionsResponse = await axios.get(
        `${API_BASE_URL}/transactions`
      );
      setTransactions(transactionsResponse.data.data);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="mt-18">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div class="relative bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-44 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center shadow-lg transform transition duration-300 hover:translate-y-[-8px]">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Total Members</p>
              <p className="text-2xl">{totalMembers}</p>
            </div>
          </div>
          <div className="mt-2 ml-4">
            <button
              onClick={() => navigate("/members")}
              className="bg-cyan-500
             hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline-blue active:bg-gray-500"
            >
              View
            </button>
          </div>
        </div>
        {/* 1st card end */}

        {/* <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-44 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center"> */}
        <div class="relative bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-44 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center shadow-lg transform transition duration-300 hover:translate-y-[-8px]">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Today's Collection</p>
              <p className="text-2xl">{TotalLoanAmount}</p>
            </div>
          </div>
          <div className="mt-2 ml-4">
            <button
              onClick={() => navigate("/reports")}
              className="bg-cyan-500
             hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline-blue active:bg-gray-500"
            >
              View
            </button>
          </div>
        </div>
        {/* 2nd card end */}

        {/* <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-44 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center"> */}
        <div class="relative bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-44 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center shadow-lg transform transition duration-300 hover:translate-y-[-8px]">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Pending Collection</p>
              <p className="text-2xl">{totalCurrentBalance}</p>
            </div>
          </div>
          <div className="mt-2 ml-4">
            <button
              onClick={() => navigate("/deposit")}
              className="bg-cyan-500
             hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline-blue active:bg-gray-500"
            >
              View
            </button>
          </div>
        </div>
        {/* 3rd card end */}

        <div class="relative bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-44 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center shadow-lg transform transition duration-300 hover:translate-y-[-8px] ">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Total Number of Loans</p>
              <p className="text-2xl">{pendingLoans}</p>
            </div>
          </div>
          <div className="mt-2 ml-4">
            <button
              onClick={() => navigate("/loans")}
              className="bg-cyan-500
             hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline-blue active:bg-gray-500"
            >
              View
            </button>
          </div>
        </div>
      </div>
      {/* 4th card end */}



      <br></br>
      <br></br>
      <hr></hr>
      <hr></hr>
      <br></br>


      <div className="mx-6 ">
        <h1 className="text-3xl m-2 text-cyan-500 font-medium">
          Recent Collection
        </h1>
        <table className="table text-center bg-info text-white rounded-lg overflow-hidden ">
          <thead>
            <tr class="table-secondary">
              <th>Date</th>
              <th>Member Name</th>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Debit/Credit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((transaction, index) => (
              <tr key={index}>
                <td>{new Date(transaction.date).toLocaleString()}</td>
                <td>{transaction.member}</td>
                <td>{transaction.accountNumber}</td>
                <td>{transaction.transactionAmount}</td>
                <td>{transaction.debitOrCredit}</td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentDash;