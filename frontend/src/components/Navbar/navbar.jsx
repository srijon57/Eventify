import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/eventify.png";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import NavbarProfile from "./NavbarProfile"; // import the new component

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 dark:bg-gray-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Eventify Logo" className="h-8 w-auto" />
          <div className="text-white text-2xl font-bold">Eventify</div>
        </Link>

        <div className="flex items-center space-x-4">

          {!user && (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-200">
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              {/* Replace old profile button with dropdown */}
              <NavbarProfile />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
