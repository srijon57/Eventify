import React from "react";
import { Link } from "react-router-dom";

const LogoutPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">
                You have logged out successfully!
            </h2>
            <Link to="/" className="text-blue-600 underline">
                Go to Home
            </Link>
        </div>
    );
};

export default LogoutPage;
