import React, { useEffect, useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";

const Logout = () => {
  const { setActiveMenu, setScreenSize, screenSize } = useStateContext();
  const [showConfirmation, setShowConfirmation] = useState(true);

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

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        zIndex: 1000, // Set a high z-index to ensure it appears above other elements
      }}
    >
      {showConfirmation && (
        <>
          <p>Do you want to logout?</p>
          <button style={{ marginRight: "10px" }} onClick={confirmLogout}>
            Logout
          </button>
          <button onClick={cancelLogout}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Logout;
