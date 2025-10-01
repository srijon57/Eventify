import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <nav className="relative bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white py-4 shadow-lg ">
      {/* Animated background shapes */}
      <div className="absolute top-0 -left-24 w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 -right-24 w-[200px] h-[200px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Eventify Logo" className="h-10 w-auto" />
            <span className="text-2xl font-extrabold text-blue-300 tracking-tight">Eventify</span>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            
          </motion.div>
          {!user ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-400 text-gray-900 rounded-full hover:bg-blue-300 transition-colors duration-300 font-semibold shadow-md"
                >
                  Register
                </Link>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <NavbarProfile />
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="md:hidden text-gray-200 hover:text-blue-300 focus:outline-none"
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
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-800/90 backdrop-blur-md"
        >
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link
              to="/events"
              className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium"
              onClick={toggleMobileMenu}
            >
              Events
            </Link>
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-200 hover:text-blue-300 transition-colors duration-300 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex justify-center">
                <NavbarProfile />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;