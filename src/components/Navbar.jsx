import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import axios from "axios";
import { IoLogOut } from "react-icons/io5";
import avatar from "../data/avatar.jpg";
import { Cart, Chat, Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
const mongoose = require("mongoose");
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  const [userRole, setUserRole] = useState(""); // State to store user's role
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [usero, setUsername] = useState("");

  // // Function to switch database and reload page
  // const switchDatabase = (selectedDatabase) => {
  //   // Perform logic to switch the database based on the selected value
  //   const dbName = selectedDatabase;
  //   mongoose.connection
  //     .close()
  //     .then(() => {
  //       return mongoose.connect(uri, {
  //         dbName,
  //         useNewUrlParser: true,
  //         useUnifiedTopology: true,
  //       });
  //     })
  //     .then(() => {
  //       // Event handling for successful connection
  //       mongoose.connection.on("connected", () => {
  //         // console.log("Connected to MongoDB",dbName);
  //       });

  //       // Event handling for disconnection
  //       mongoose.connection.on("disconnected", () => {
  //         // console.log("Disconnected from MongoDB",dbName);
  //       });

  //       // Event handling for error
  //       mongoose.connection.on("error", (err) => {
  //         // console.error("Connection error:", err);
  //       });
  //     })
  //     .catch((err) => {
  //       // console.error("Error:", err);
  //     });
  //   // Reload the page to reflect the changes
  //   window.location.reload();
  // };

  useEffect(async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const tokenParts = token.split(".");
      const encodedPayload = tokenParts[1];
      const decodedPayload = atob(encodedPayload);
      const payload = JSON.parse(decodedPayload);
      setUsername(payload.username);
      const urole = payload.role; // Extract user role from the token payload
      setUserRole(urole); // Set the user's role in the state
      // // console.log(payload);
      // Based on the user's role, set dropdown options accordingly
      // let options = [];
      // switch (urole) {
      //   case "admin":
      //     const response = await axios.get(`${API_BASE_URL}/admin-databases`);
      //     // console.log(response.data.databases);
      //     options = response.data.databases;
      //     options.push("admindatabase"); // Adding "admindatabase" as an additional option
      //     break;
      //   case "manager":
      //     const x = payload.db;
      //     const parts = x.split("_");
      //     if (parts.length > 1) {
      //       const objectIdPart = parts[1]; // Accessing the second part after the split
      //       // console.log("(Manager)ObjectID:", objectIdPart);
      //       // Getting the Options
      //       const response = await axios.get(
      //         `${API_BASE_URL}/branch-databases/${objectIdPart}`
      //       );
      //       // console.log(response.data.databases);
      //       options = response.data.databases;
      //     } else {
      //       // console.log("Invalid format or no ObjectID found");
      //       // options = ["Option A", "Option B", "Option C"]; // Example options for manager
      //     }
      //     break;
      //   case "agent":
      //     options = []; // Example options for regular user
      //     break;
      //   default:
      //     options = []; // Default empty options if role doesn't match
      // }
      // setDropdownOptions(options);
      // // console.log(options);
    }
  }, []); // Empty dependency array ensures this runs only once on mount/reload

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleOptionSelect = (selectedOption) => {
    switchDatabase(selectedOption); // Call the function to switch the database
  };

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        {/* <NavButton title="Cart" customFunc={() => handleClick('cart')} color={currentColor} icon={<FiShoppingCart />} /> */}
        {/* <NavButton title="Chat" dotColor="#03C9D7" customFunc={() => handleClick('chat')} color={currentColor} icon={<BsChatLeft />} /> */}
        {/* <NavButton title="Notification" dotColor="rgb(254, 201, 15)" customFunc={() => handleClick('notification')} color={currentColor} icon={<RiNotification3Line />} /> */}
        {/* <DropdownButton id="dropdown-basic-button" title="Switch Databases">
          {Array.isArray(dropdownOptions) &&
            dropdownOptions.map((option, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleOptionSelect(option)} // Handle option selection
              >
                {option}
              </Dropdown.Item>
            ))}
        </DropdownButton> */}
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            <img className="rounded-full w-8 h-8" alt="user-profile" />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {usero}
              </span>
            </p>
          </div>
        </TooltipComponent>
        <NavButton
          title="Logout"
          icon={<IoLogOut />}
          customFunc={handleLogout}
        />
        {/* {isClicked.userProfile && (<UserProfile />)} */}
      </div>
    </div>
  );
};

export default Navbar;
