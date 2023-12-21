import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Branches from "./pages/Branches";
import Members from "./pages/Members";
import Accounts from "./pages/Accounts";
import Repayments from "./pages/Repayments";
import Loans from "./pages/Loans";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Deposit from "./pages/Deposit";
import Dashboard from "./pages/Dashboard";
import Withdraw from "./pages/Withdraw";
import Transaction from "./pages/Transaction";
import Expense from "./pages/Expense";
import User from "./pages/User";
import Reports from "./pages/Reports";
import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import "./App.css";
import { useStateContext } from "./contexts/ContextProvider";
import Accountstatement from "./pages/reports/Accountstatement";
import Accountbalance from "./pages/reports/Accountbalance";
import Loanreport from "./pages/reports/Loanreport";
import Loandue from "./pages/reports/Loandue";
import TransactionReport from "./pages/reports/Transaction";
import ExpenseReport from "./pages/reports/Expense";
import RevenueReport from "./pages/reports/Revenue";
import AccountStatement from "./pages/reports/Accountstatement";
import AgentDash from "./pages/AgentDash";
import Switch from "./pages/Switch";

const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
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

      // Verify the token on the server to check its validity
      axios
        .get(`${API_BASE_URL}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          // Token is valid, user is authenticated
          setAuthenticated(true);
        })
        .catch(() => {
          // Token is invalid, remove it from local storage
          localStorage.removeItem("token");
          setAuthenticated(false); // Set authenticated to false
        });
    } else {
      setAuthenticated(false); // No token found, set authenticated to false
    }
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <BrowserRouter>
      {authenticated ? (
        <AuthenticatedRoutes userRole={userRole} />
      ) : (
        <UnauthenticatedRoutes />
      )}
    </BrowserRouter>
  );
};

const AuthenticatedRoutes = ({ userRole }) => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  const currentThemeColor = localStorage.getItem("colorMode");
  const currentThemeMode = localStorage.getItem("themeMode");
  if (currentThemeColor && currentThemeMode) {
    setCurrentColor(currentThemeColor);
    setCurrentMode(currentThemeMode);
  }
  let routesToRender;

  switch (userRole) {
    case "admin":
      routesToRender = (
        <div className={currentMode === "Dark" ? "dark" : ""}>
          <div className="flex relative dark:bg-main-dark-bg">
            <div
              className="fixed right-4 bottom-4"
              style={{ zIndex: "1000" }}
            ></div>
            {activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )}
            <div
              className={
                activeMenu
                  ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                  : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
              }
            >
              <div>
                <Navbar />
              </div>
              <div>
                <Routes>
                  {/* pages  */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/Switch" element={<Switch />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/repayments" element={<Repayments />} />
                  <Route path="/loans" element={<Loans />} />
                  <Route path="/deposit" element={<Deposit />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/transaction" element={<Transaction />} />
                  <Route path="/expense" element={<Expense />} />
                  <Route path="/user" element={<User />} />
                  <Route path="/reports" element={<AccountStatement />} />
                  <Route
                    path="/accountstatement"
                    element={<Accountstatement />}
                  />
                  <Route path="/accountbalance" element={<Accountbalance />} />
                  <Route path="/loandue" element={<Loandue />} />
                  <Route path="/loanreport" element={<Loanreport />} />
                  <Route path="/loandue" element={<Loandue />} />
                  <Route
                    path="/Transactionreport"
                    element={<TransactionReport />}
                  />
                  <Route path="/ExpenseReport" element={<ExpenseReport />} />
                  <Route path="/RevenueReport" element={<RevenueReport />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      );
      break;

    case "manager":
      routesToRender = (
        <div className={currentMode === "Dark" ? "dark" : ""}>
          <div className="flex relative dark:bg-main-dark-bg">
            <div
              className="fixed right-4 bottom-4"
              style={{ zIndex: "1000" }}
            ></div>
            {activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )}
            <div
              className={
                activeMenu
                  ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                  : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
              }
            >
              <div>
                <Navbar />
              </div>
              <div>
                <Routes>
                  {/* pages  */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/Switch" element={<Switch />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/repayments" element={<Repayments />} />
                  <Route path="/loans" element={<Loans />} />
                  <Route path="/deposit" element={<Deposit />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/transaction" element={<Transaction />} />
                  <Route path="/expense" element={<Expense />} />
                  <Route path="/user" element={<User />} />
                  <Route path="/reports" element={<AccountStatement />} />
                  <Route
                    path="/accountstatement"
                    element={<Accountstatement />}
                  />
                  <Route path="/accountbalance" element={<Accountbalance />} />
                  <Route path="/loandue" element={<Loandue />} />
                  <Route path="/loanreport" element={<Loanreport />} />
                  <Route path="/loandue" element={<Loandue />} />
                  <Route
                    path="/Transactionreport"
                    element={<TransactionReport />}
                  />
                  <Route path="/ExpenseReport" element={<ExpenseReport />} />
                  <Route path="/RevenueReport" element={<RevenueReport />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      );
      break;

    case "agent":
      routesToRender = (
        <div className={currentMode === "Dark" ? "dark" : ""}>
          <div className="flex relative dark:bg-main-dark-bg">
            <div
              className="fixed right-4 bottom-4"
              style={{ zIndex: "1000" }}
            ></div>
            {activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )}
            <div
              className={
                activeMenu
                  ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                  : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
              }
            >
              <div>
                <Navbar />
              </div>
              <div>
                <Routes>
                  {/* pages  */}
                  <Route path="/" element={<AgentDash />} />
                  <Route path="/dashboard" element={<AgentDash />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/repayments" element={<Repayments />} />
                  <Route path="/loans" element={<Loans />} />
                  <Route path="/deposit" element={<Deposit />} />
                  {/* <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/transaction" element={<Transaction />} /> */}
                  {/* <Route path="/expense" element={<Expense />} />
                  <Route path="/user" element={<User />} /> */}
                  <Route path="/reports" element={<AccountStatement />} />
                  <Route
                    path="/accountstatement"
                    element={<Accountstatement />}
                  />
                  <Route path="/accountbalance" element={<Accountbalance />} />
                  {/* <Route path="/loandue" element={<Loandue />} /> */}
                  <Route path="/loanreport" element={<Loanreport />} />
                  {/* <Route path="/loandue" element={<Loandue />} />
                  <Route
                    path="/Transactionreport"
                    element={<TransactionReport />}
                  />
                  <Route path="/ExpenseReport" element={<ExpenseReport />} />
                  <Route path="/RevenueReport" element={<RevenueReport />} /> */}
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      );
      break;

    default:
      routesToRender = null; // Default case if user role doesn't match
  }

  return routesToRender;
};
const UnauthenticatedRoutes = () => {
  return (
    <Routes>
      {/* Show the login page if not authenticated */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;