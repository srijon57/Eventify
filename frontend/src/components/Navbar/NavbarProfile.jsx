import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const NavbarProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        setUser(null); // Clear user state
        navigate("/"); // Redirect to home
    };

    if (!user) {
        return null;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <img
                src={
                    user.profileImage ||
                    `https://placehold.co/40x40?text=${
                        user.username
                            ? user.username.charAt(0).toUpperCase()
                            : "?"
                    }`
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                onClick={() => setOpen(!open)}
            />
            <div
                className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden transition-all duration-300 z-50 ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setOpen(false)}
                >
                    Profile
                </Link>
                {user.role?.toLowerCase().includes("user") && (
                    <Link
                        to="/studentdashboard"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpen(false)}
                    >
                        Student Dashboard
                    </Link>
                )}
                {user.role?.toLowerCase().includes("admin") && (
                    <Link
                        to="/admindashboard"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpen(false)}
                    >
                        Admin Dashboard
                    </Link>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default NavbarProfile;
