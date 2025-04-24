import React from "react";
import { useNavigate,useLocation } from "react-router";
import {  useDispatch,useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { logoutUser } from "../services/apiServices";
const Header = (initialUser) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user= useSelector((state) => state.auth.user);
  const initialUserData = initialUser.initialUser || null;
  const userData =  initialUserData|| user;

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await logoutUser(); 
      console.log("Server logout request done!");
      
      console.log("Dispatched Redux logout action!");
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.__INITIAL_DATA__.user = null;
      console.log("Deleted user cookie!");
      
      setTimeout(() => {
        dispatch(logout());
        window.location.href = "/login";
        
        
      }, 500);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const handleNavigate = (path) => {
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  };
  return (
    <header className="header">
    <h1>My App</h1>
    <div className="user-actions">
      <p suppressHydrationWarning>{userData ? `Welcome, ${userData?.name}` : "Guest"}</p>
      <button  onClick={handleLogout} className="logout">
        Logout
      </button>
      {location.pathname !== "/home" && (
          <button
            onClick={() => handleNavigate("/home")}
            className="upload"
          >
            Home
          </button>
        )}
        {location.pathname !== "/contact" && (
          <button
            onClick={() => handleNavigate("/contact")}
            className="upload"
          >
            Contact
          </button>
        )}
        {location.pathname !== "/details" && (
          <button
            onClick={() => handleNavigate("/details")}
            className="upload"
          >
            Detail
          </button>
        )}
    </div>
    
  </header>
  );
};

export default Header;
