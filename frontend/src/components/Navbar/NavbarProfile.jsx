import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import api from "../../lib/api";

const NavbarProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("token");
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      setUser(null);
      navigate("/");
      window.location.reload();
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src={
          user.profileImage ||
          `https://placehold.co/40x40?text=${user.username ? user.username.charAt(0).toUpperCase() : "?"}`
        }
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover cursor-pointer border-4 border-blue-300/50 hover:border-blue-300 transition-all duration-300 shadow-md"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="px-4 py-3 bg-gradient-to-b from-gray-100 dark:from-gray-800 to-transparent">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.username || "User"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email || "No email"}</p>
          </div>
          <Link
            to="/profile"
            className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          {user.role?.toLowerCase().includes("user") && (
            <Link
              to="/studentdashboard"
              className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              Student Dashboard
            </Link>
          )}
          {user.role?.toLowerCase().includes("admin") && (
            <Link
              to="/admindashboard"
              className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavbarProfile;
