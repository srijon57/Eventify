import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
    const { user, isLoading: isAuthLoading, setUser } = useContext(AuthContext);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchRegisteredEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching registered events..."); // Debug log
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }
            const response = await api.get("/events/registered-events", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched events:", response.data); // Debug log
            setRegisteredEvents(response.data.data.dashboardEvents || []);
        } catch (err) {
            console.error("Error fetching events:", err); // Debug log
            setError(
                err.response?.data?.message ||
                    "Failed to load events. Please try again."
            );
        } finally {
            setIsLoading(false);
            console.log("Fetching complete. isLoading set to false."); // Debug log
        }
    };

    useEffect(() => {
        console.log(
            "useEffect triggered. isAuthLoading:",
            isAuthLoading,
            "user:",
            user
        ); // Debug log
        if (!isAuthLoading && user) {
            fetchRegisteredEvents();
        }
    }, [user, isAuthLoading]);

    // Handle category filter change
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Filter events based on selected category
    const filteredEvents = registeredEvents.filter((reg) => {
        if (!reg.event) return false;
        return (
            selectedCategory === "All" ||
            reg.event.category === selectedCategory
        );
    });

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setShowLogoutDialog(false);
        navigate("/login");
    };

    // Show loading state
    if (isAuthLoading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
                <p className="text-xl">Loading your dashboard...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 text-red-500">
                <p className="text-xl">{error}</p>
            </div>
        );
    }

    // Extract unique categories for the filter dropdown
    const uniqueCategories = Array.from(
        new Set(
            registeredEvents.map((reg) => reg.event?.category).filter(Boolean)
        )
    );

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
            <div className="w-full max-w-2xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Student Dashboard</h1>
                    <button
                        onClick={() => setShowLogoutDialog(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
                    >
                        Logout
                    </button>
                </div>

                {/* Registered Events Section */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Registered Events</h2>
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor="category-filter"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Filter:
                        </label>
                        <select
                            id="category-filter"
                            onChange={handleCategoryChange}
                            value={selectedCategory}
                            className="py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="All">All Categories</option>
                            {uniqueCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Events List */}
                <div className="h-[400px] w-full overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((reg) => (
                            <div
                                key={reg.registrationId}
                                className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4"
                            >
                                <img
                                    src={reg.event?.image || "https://placehold.co/100x100/333333/FFFFFF?text=Image+Not+Found"}
                                    alt={reg.event?.title || "Event"}
                                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/100x100/333333/FFFFFF?text=Image+Not+Found";
                                    }}
                                />
                                <div>
                                    <h3 className="text-lg font-medium">
                                        {reg.event?.title || "Untitled Event"}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {reg.event?.description || "No description available"}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No events found.
                        </p>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            Confirm Logout
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Are you sure you want to log out? You will need to
                            sign in again.
                        </p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setShowLogoutDialog(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}