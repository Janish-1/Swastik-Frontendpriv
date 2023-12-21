import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Table, Row, Col } from "react-bootstrap";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Switch = () => {
  const [databases, setDatabases] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [branchNames, setBranchNames] = useState([]); // State to store branch names
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); // State for filtered data

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");

      if (token) {
        const tokenParts = token.split(".");
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        const payload = JSON.parse(decodedPayload);
        const urole = payload.role; // Extract user role from the token payload
        setUserRole(urole);

        let dbs = [];
        switch (urole) {
          case "admin":
            try {
              const response = await axios.get(
                `${API_BASE_URL}/admin-databases`
              );
              dbs = response.data.databases;
              dbs.push("admindatabase"); // Adding "admindatabase" as an additional option
            } catch (error) {
              // console.error("Error fetching admin databases:", error);
            }
            break;
          case "manager":
            const x = payload.db;
            const parts = x.split("_");
            if (parts.length > 1) {
              const objectIdPart = parts[1]; // Accessing the second part after the split
              try {
                const response = await axios.get(
                  `${API_BASE_URL}/branch-databases/${objectIdPart}`
                );
                dbs = response.data.databases;
              } catch (error) {
                // console.error("Error fetching branch databases:", error);
              }
            } else {
              // console.log("Invalid format or no ObjectID found");
              // Handle invalid format or no ObjectID found
            }
            break;
          default:
            // Default empty dbs if role doesn't match
            dbs = [];
        }

        // Fetch and attach additional data to each database entry in dbs array
        for (let i = 0; i < dbs.length; i++) {
          const databaseName = dbs[i];
          try {
            const tableResponse = await axios.get(
              `${API_BASE_URL}/userdetails/${databaseName}`
            );
            dbs[i] = { db: databaseName, ...tableResponse.data }; // Attach fetched data to database object
          } catch (error) {
            // console.error(`Error fetching data for ${databaseName}:`, error);
            dbs[i] = { db: databaseName, username: "", email: "" }; // Set defaults if fetch fails
          }
        }

        try {
          const branchNamesResponse = await axios.get(
            `${API_BASE_URL}/branches/names`
          );
          setBranchNames(branchNamesResponse.data.data);
        } catch (error) {
          // console.error("Error fetching branch names:", error);
        }

        setDatabases(dbs);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...databases];

    if (selectedBranch !== "All") {
      filtered = filtered.filter(
        (database) => database[0]?.branchName === selectedBranch
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (database) =>
          (database[0]?.name && database[0]?.name.includes(searchQuery)) ||
          (database[0]?.email && database[0]?.email.includes(searchQuery))
      );
    }

    setFilteredData(filtered); // Set filtered data separately
  }, [selectedBranch, searchQuery, databases]);

  const handleSwitch = async (databaseName) => {
    // Handle switching logic for the selected database
    // console.log(`Switching to database: ${databaseName}`);
    const response = await axios.get(
      `${API_BASE_URL}/switch-database/${databaseName}`
    );
    // console.log(response);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let filtered = [...databases];

    if (selectedBranch !== "All") {
      filtered = filtered.filter(
        (database) => database[0]?.branchName === selectedBranch
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (database) =>
          (database[0]?.name && database[0]?.name.includes(searchQuery)) ||
          (database[0]?.email && database[0]?.email.includes(searchQuery))
      );
    }

    setFilteredData(filtered); // Set filtered data separately
  };

  return (
    <div>
      {userRole === "admin" && (
        <Form onSubmit={handleFormSubmit}>
          <Row className="mb-3">
            <Col xs={6} md={3}>
              <Form.Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="custom-select"
              >
                <option value="All">All Branches</option>
                {branchNames.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} md={3}>
              <Form.Control
                type="text"
                placeholder="Search by Name or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col xs={6} md={3}>
              <Button type="submit" variant="primary">
                Filter
              </Button>
            </Col>
          </Row>
        </Form>
      )}
      {userRole === "manager" && (
        <Form onSubmit={handleFormSubmit}>
        <Row className="mb-3">
          <Col xs={6} md={3}>
            <Form.Control
              type="text"
              placeholder="Search by Name or Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col xs={6} md={3}>
            <Button type="submit" variant="primary">
              Filter
            </Button>
          </Col>
        </Row>
      </Form>
    )}
      <Table
        responsive
        striped
        bordered
        hover
        className="mt-4 rounded-lg overflow-hidden"
      >
        <thead>
          <tr>
            <th>Database Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Branch</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((database, index) => (
            <tr key={index}>
              <td>{database.db}</td>
              <td>{database[0]?.name}</td>
              <td>{database[0]?.email}</td>
              <td>{database[0]?.branchName}</td>
              <td>
                <Button onClick={() => handleSwitch(database.db)}>
                  Switch
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Switch;
