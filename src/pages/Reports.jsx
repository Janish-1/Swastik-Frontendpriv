import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Reports.css";
import { BsFillNutFill } from "react-icons/bs";

const Reports = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenParts = token.split(".");
      const encodedPayload = tokenParts[1];
      const decodedPayload = atob(encodedPayload);
      const payload = JSON.parse(decodedPayload);
      const role = payload.role; // Assuming 'role' contains the user's role
      setUserRole(role); // Set userRole state with the extracted role
    }
  }, []); // Empty dependency array to run the effect only once  
  
  let routestorender;

  switch (userRole) {
    case "admin":
      routestorender = (      
      <div className="m-4 flex justify-center  ">
        <Navbar
          style={{ backgroundColor: "white", borderRadius: "10px" }}
          expand="lg"
          className="mx-auto  "
        >
          <Navbar.Brand
            style={{ padding: "10px", borderRight: "1px solid #ccc" }}
          >
            Reports
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-5 flex items-center antialiased hover:subpixel-antialiased  ">
              <Nav.Link
                as={NavLink}
                to="/Accountstatement"
                activeClassName="active"
                className="nav-link  "
              >
                Account Statement
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/Accountbalance"
                activeClassName="active"
                className="nav-link"
              >
                Account Balance
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/Loanreport"
                activeClassName="active"
                className="nav-link"
              >
                Loan Report
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/Loandue"
                activeClassName="active"
                className="nav-link"
              >
                Loan Due
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/TransactionReport"
                activeClassName="active"
                className="nav-link"
              >
                Transaction
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/ExpenseReport"
                activeClassName="active"
                className="nav-link"
              >
                Expense
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/RevenueReport"
                activeClassName="active"
                className="nav-link"
              >
                Revenue
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
);  
break;

case "manager":
  routestorender = (      
  <div className="m-4 flex justify-center  ">
    <Navbar
      style={{ backgroundColor: "white", borderRadius: "10px" }}
      expand="lg"
      className="mx-auto  "
    >
      <Navbar.Brand
        style={{ padding: "10px", borderRight: "1px solid #ccc" }}
      >
        Reports
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-5 flex items-center antialiased hover:subpixel-antialiased  ">
          <Nav.Link
            as={NavLink}
            to="/Accountstatement"
            activeClassName="active"
            className="nav-link  "
          >
            Account Statement
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/Accountbalance"
            activeClassName="active"
            className="nav-link"
          >
            Account Balance
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/Loanreport"
            activeClassName="active"
            className="nav-link"
          >
            Loan Report
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/Loandue"
            activeClassName="active"
            className="nav-link"
          >
            Loan Due
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/TransactionReport"
            activeClassName="active"
            className="nav-link"
          >
            Transaction
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/ExpenseReport"
            activeClassName="active"
            className="nav-link"
          >
            Expense
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/RevenueReport"
            activeClassName="active"
            className="nav-link"
          >
            Revenue
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);  
break;

case "agent":
  routestorender = (      
  <div className="m-4 flex justify-center  ">
    <Navbar
      style={{ backgroundColor: "white", borderRadius: "10px" }}
      expand="lg"
      className="mx-auto  "
    >
      <Navbar.Brand
        style={{ padding: "10px", borderRight: "1px solid #ccc" }}
      >
        Reports
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-5 flex items-center antialiased hover:subpixel-antialiased  ">
          <Nav.Link
            as={NavLink}
            to="/Accountstatement"
            activeClassName="active"
            className="nav-link  "
          >
            Account Statement
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/Accountbalance"
            activeClassName="active"
            className="nav-link"
          >
            Account Balance
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/Loanreport"
            activeClassName="active"
            className="nav-link"
          >
            Loan Report
          </Nav.Link>
          {/* <Nav.Link
            as={NavLink}
            to="/Loandue"
            activeClassName="active"
            className="nav-link"
          >
            Loan Due
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/TransactionReport"
            activeClassName="active"
            className="nav-link"
          >
            Transaction
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/ExpenseReport"
            activeClassName="active"
            className="nav-link"
          >
            Expense
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/RevenueReport"
            activeClassName="active"
            className="nav-link"
          >
            Revenue
          </Nav.Link> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);  
break;

}
return routestorender || null; // Return null in case routestorender is undefined

};

export default Reports;
