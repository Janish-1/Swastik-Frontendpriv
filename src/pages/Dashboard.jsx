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

const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();
  const [totalMembers, setTotalMembers] = useState();
  const [depositRequests, setDepositRequests] = useState();
  const [withdrawRequests, setWithdrawRequests] = useState();
  const [pendingLoans, setPendingLoans] = useState();
  const [transactions, setTransactions] = useState([]);

  // Fetch data for total members, deposit requests, withdraw requests, and pending loans
  const fetchData = async () => {
    try {
      const membersResponse = await axios.get(
        "http://localhost:3001/countMembers"
      );
      setTotalMembers(membersResponse.data.count);

      const depositResponse = await axios.get(
        "http://localhost:3001/depositRequestsPending"
      );
      setDepositRequests(depositResponse.data.count);

      const withdrawResponse = await axios.get(
        "http://localhost:3001/withdrawRequestsPending"
      );
      setWithdrawRequests(withdrawResponse.data.count);

      const loansResponse = await axios.get(
        "http://localhost:3001/pendingLoans"
      );
      setPendingLoans(loansResponse.data.data.length);

      const transactionsResponse = await axios.get(
        "http://localhost:3001/transactions"
      );
      setTransactions(transactionsResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

const navigate=useNavigate()

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
              <p className="font-bold text-gray-400">Deposit Request</p>
              <p className="text-2xl">{depositRequests}</p>
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
        {/* 2nd card end */}

        {/* <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-44 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center"> */}
        <div class="relative bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-44 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center shadow-lg transform transition duration-300 hover:translate-y-[-8px]">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Withdraw Request</p>
              <p className="text-2xl">{withdrawRequests}</p>
            </div>
          </div>
          <div className="mt-2 ml-4">
            <button
              onClick={() => navigate("/withdraw")}
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
              <p className="font-bold text-gray-400">Pending Loans</p>
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

      <div className="flex flex-wrap justify-center mt-10 mb-10">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-760 w-90 shadow-lg mt-8">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Expense Overview </p>
          </div>

          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            <div className=" border-r-1 border-color m-4 pr-10">
              <div className="w-40">
                <Pie
                  id="pie-chart"
                  data={ecomPieChartData}
                  legendVisiblity={false}
                  height="260px"
                />
              </div>
            </div>
            <div>
              <Stacked currentMode={currentMode} width="320px" height="360px" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-6 ">
        <h1 className="text-3xl m-2 text-cyan-500 font-medium">Recent Transaction</h1>
        <table className="table text-center bg-info text-white rounded-lg overflow-hidden ">
          <thead>
            <tr class="table-secondary">
              <th>Date</th>
              <th>Member</th>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Debit/Credit</th>
              <th>Status</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody className="table-success">
            {transactions.slice(0, 10).map((transaction, index) => (
              <tr key={index}>
                <td>{new Date(transaction.date).toLocaleString()}</td>
                <td>{transaction.member}</td>
                <td>{transaction.accountNumber}</td>
                <td>{transaction.transactionAmount}</td>
                <td>{transaction.debitOrCredit}</td>
                <td>{transaction.status}</td>
                {/* <td>Render action button or data</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ecommerce;
