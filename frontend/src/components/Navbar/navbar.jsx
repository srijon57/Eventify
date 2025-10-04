import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/eventify.png";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import NavbarProfile from "./NavbarProfile";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="relative bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white py-4 shadow-lg">
      {/* Animated background shapes */}
      <div className="absolute top-0 -left-24 w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 -right-0 w-[200px] h-[200px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Eventify Logo" className="h-10 w-auto" />
            <span className="text-2xl font-extrabold text-blue-300 tracking-tight">Eventify</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 z-2">

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-400 text-gray-900 rounded-full hover:bg-blue-300 transition-colors duration-300 font-semibold shadow-md"
              >
                Register
              </Link>
            </>
          ) : (
            <NavbarProfile />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-200 hover:text-blue-300 focus:outline-none z-2"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800/90 backdrop-blur-md w-full absolute left-0 top-16 z-50">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link
              to="/events"
              className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium py-2"
              onClick={toggleMobileMenu}
            >
              Events
            </Link>
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium py-2"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium py-2"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium py-2"
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                {user.role?.toLowerCase().includes("admin") && (
                  <Link
                    to="/admindashboard"
                    className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium py-2"
                    onClick={toggleMobileMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role?.toLowerCase().includes("user") && (
                  <Link
                    to="/studentdashboard"
                    className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium py-2"
                    onClick={toggleMobileMenu}
                  >
                    Student Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    document.cookie.split(";").forEach((cookie) => {
                      const eqPos = cookie.indexOf("=");
                      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                    });
                    window.location.reload();
                  }}
                  className="text-gray-200 hover:text-red-300 transition-colors duration-300 font-medium py-2 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
