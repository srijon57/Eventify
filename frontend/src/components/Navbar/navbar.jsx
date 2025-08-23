import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/eventify.png"; 

const Navbar = () => {
    return (
        <nav className="bg-gray-900 dark:bg-gray-700 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src={logo} 
                        alt="Eventify Logo"
                        className="h-8 w-auto"
                    />
                    <div className="text-white text-2xl font-bold">Eventify</div>
                </Link>
                <div className="space-x-4">
                    <Link to="/" className="text-white hover:text-gray-200">
                        Home
                    </Link>
                    <Link
                        to="/login"
                        className="text-white hover:text-gray-200"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="text-white hover:text-gray-200"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;