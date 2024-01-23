import React, { useEffect, useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosMore } from "react-icons/io";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { Table } from "react-bootstrap";
// import Button from 'react-bootstrap/Button';
import { Stacked, Button, LineChart, SparkLine } from "../components";
import {
  earningData,
  medicalproBranding,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
} from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import product9 from "../data/product9.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// const path = require('path');
// const dotenv = require('dotenv');

// const envPath = path.resolve(__dirname, '../.env');

// dotenv.config({ path: envPath });

const API_BASE_URL = process.env.REACT_APP_API_URL;
// // console.log("Api URL:", API_BASE_URL);

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
  const [TotalLoanAmount, setTotalLoanAmount] = useState();
  const [totalCurrentBalance, settotalCurrentBalance] = useState();
  const [pendingLoans, setPendingLoans] = useState();
  const [transactions, setTransactions] = useState([]);
  const [ecomPieChartData, setEcomPieChartData] = useState([]);
  const [stackedChartData, setStackedChartData] = useState([]);

  // Define an array of colors corresponding to each year
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#d34c4c", "#888888"];

  // Get the token from localStorage
  const token = localStorage.getItem("token");

  if (token) {
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const decodedPayload = atob(encodedPayload);
    const payload = JSON.parse(decodedPayload);
    // console.log(payload);
    // // console.log("Role: ", payload.role);
  } else {
    // // console.log("Token not found in localStorage");
  }

  // Function to retrieve all image URLs from the specified endpoints
  async function getAllImageUrls() {
    try {
      // Array to hold all image URLs
      let allImageUrls = [];

      // Function to retrieve image URLs from each endpoint and merge them into a single list
      async function getImageUrls(endpoint) {
        try {
          const response = await axios.get(endpoint);
          const { imageUrls } = response.data;
          allImageUrls = allImageUrls.concat(imageUrls);
        } catch (error) {
          // // console.error(
          //   `Error fetching images from ${endpoint}: ${error.message}`
          // );
        }
      }

      // Endpoints for fetching image URLs
      const endpoints = [
        `${API_BASE_URL}/getAllMemberImages`,
        `${API_BASE_URL}/getAllAccountImages`,
        `${API_BASE_URL}/getAllUserImages`,
      ];

      // Fetch image URLs from each endpoint
      for (const endpoint of endpoints) {
        await getImageUrls(endpoint);
      }

      // Remove duplicates from the consolidated image URLs list
      allImageUrls = [...new Set(allImageUrls)];

      return allImageUrls;
    } catch (error) {
      // console.error(`Error in getAllImageUrls: ${error.message}`);
      return [];
    }
  }

  // Fetch data for total members, deposit requests, withdraw requests, and pending loans
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/populate-revenue`);
      // console.log(response);
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
      // try {
      //   // Retrieve all image URLs
      //   const allImageUrls = await getAllImageUrls();
      //   // console.log(allImageUrls);

      //   // Here, make sure to pass the image URLs appropriately to your DELETE endpoint
      //   const response = await axios.delete(
      //     `${API_BASE_URL}/deleteOrphanImages`,
      //     {
      //       data: { imageUrls: allImageUrls }, // Pass data as payload (depends on how your API expects it)
      //       headers: { "Content-Type": "application/json" }, // Add headers if necessary
      //     }
      //   );

      //   // console.log("Deleted images:", response.data);
      // } catch (error) {
      //   // console.error("Error deleting images:", error);
      // }
      axios.get(`${API_BASE_URL}/expense-per-year`).then((response) => {
        const formattedData = response.data.map((item) => ({
          x: new Date(item.x).getFullYear(), // Assuming 'x' is a date or string representation of a date
          y: item.y,
          text: item.text,
        }));
        setEcomPieChartData(formattedData);
      });
      axios.get(`${API_BASE_URL}/stacked-chart-data`).then((response) => {
        const formattedData = response.data.map((item) => ({
          x: item.x,
          y: item.y,
        }));

        // Sort the formattedData array based on the 'x' values (years)
        formattedData.sort((a, b) => {
          const yearA = parseInt(a.x);
          const yearB = parseInt(b.x);
          return yearA - yearB;
        });

        setStackedChartData(formattedData);
      });
    } catch (error) {
      // // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  const navigate = useNavigate();

  // Extract unique years from ecomPieChartData
  const uniqueYears = Array.from(
    new Set(ecomPieChartData.map((data) => data.x))
  );

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
              <p className="font-bold text-gray-400">Total Loan Amount</p>
              <p className="text-2xl">{TotalLoanAmount}</p>
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
              <p className="font-bold text-gray-400">Account Balance</p>
              <p className="text-2xl">{totalCurrentBalance}</p>
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
            <p className="font-semibold text-xl">Expense Overview</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            {/* <div style={{ margin: "0 10px" }}>
              Expense Per Year
              <div style={{ width: "350px", height: "300px" }}>
                <PieChart width={350} height={300}>
                  <Tooltip
                    formatter={(value, name, props) => [
                      props.payload.x,
                      props.payload.y,
                    ]}
                  />
                  <Pie
                    data={ecomPieChartData}
                    dataKey="y"
                    cx={150}
                    cy={150}
                    outerRadius={100}
                    fill="#8884d8"
                    labelLine={false}
                  />
                  <Legend
                    align="left"
                    verticalAlign="middle"
                    layout="vertical"
                    iconType="circle"
                    payload={uniqueYears.map((year, index) => ({
                      value: year,
                      type: "circle",
                      id: year,
                      color: colors[index % ecomPieChartData.length],
                    }))}
                  />
                </PieChart>
              </div>
            </div> */}
            <div style={{ margin: "0 10px" }}>
              Earnings Per Year
              <div
                style={{ width: "600px", height: "400px", margin: "0 auto" }}
              >
                <BarChart
                  width={600}
                  height={400}
                  data={stackedChartData}
                  margin={{ right: 50, left: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="middle"
                    interval={0}
                    dy={10} // Adjust the vertical position of the label
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="y" fill="#8884d8" />
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-6 ">
        <h1 className="text-3xl m-2 text-cyan-500 font-medium">
          Recent Transaction
        </h1>
        <Table
          bordered
          hover
          responsive
          className="text-center text-white rounded-lg overflow-hidden"
        >
          <thead>
            <tr className="table-secondary">
              <th>Date</th>
              <th>Member</th>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Debit/Credit</th>
              <th>Status</th>
              {/* <th>Action</th> */}
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
                {/* <td>Render action button or data</td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Ecommerce;
