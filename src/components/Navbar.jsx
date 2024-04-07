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
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {usero}
              </span>
            </p>
          </div>
        </TooltipComponent>
      </div>
    </div>
  );
};

export default Navbar;
