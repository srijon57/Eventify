import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function StudentDashboard() {
    const { user, isLoading: isAuthLoading, setUser } = useContext(AuthContext);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [certificateLoading, setCertificateLoading] = useState({});
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const fetchRegisteredEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }
            const response = await api.get("/events/registered-events", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRegisteredEvents(response.data.data.dashboardEvents || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to load events. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthLoading && user) {
            fetchRegisteredEvents();
        }
    }, [user, isAuthLoading, fetchRegisteredEvents]);

    const handleCategoryChange = useCallback((e) => {
        setSelectedCategory(e.target.value);
    }, []);

    const handleNavigateToEvent = useCallback((eventId) => {
        if (eventId) {
            navigate(`/eventpage/${eventId}`);
        }
    }, [navigate]);

    const handleDownloadCertificate = useCallback(async (eventId, eventTitle) => {
        try {
            setCertificateLoading((prev) => ({ ...prev, [eventId]: true }));
            setMessage(null);

            const token = localStorage.getItem("token");
            const response = await api.post(`/certificates/${eventId}/create-certificate`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `certificate_${eventTitle || "event"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setMessage("✅ Certificate downloaded successfully!");
        } catch (err) {
            setMessage(
                "❌ " +
                    (err.response?.data?.message ||
                        "Failed to download certificate. Please try again.")
            );
        } finally {
            setCertificateLoading((prev) => ({ ...prev, [eventId]: false }));
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
        setShowLogoutDialog(false);
        navigate("/login");
    }, [navigate, setUser]);

    const handleRetry = useCallback(() => {
        fetchRegisteredEvents();
    }, [fetchRegisteredEvents]);

    const uniqueCategories = Array.from(
        new Set(
            registeredEvents.map((reg) => reg.event?.category).filter(Boolean)
        )
    );

    const filteredEvents = registeredEvents.filter((reg) => {
        if (!reg.event) return false;
        return (
            selectedCategory === "All" ||
            reg.event.category === selectedCategory
        );
    });

    if (isAuthLoading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
                <div className="flex items-center space-x-2">
                    <svg
                        className="animate-spin h-5 w-5 text-indigo-500"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        />
                    </svg>
                    <p className="text-xl">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 text-red-500">
                <p className="text-xl mb-4">{error}</p>
                <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
            <div className="w-full max-w-2xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Student Dashboard</h1>
                    <button
                        onClick={() => setShowLogoutDialog(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Registered Events</h2>
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor="category-filter"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Filter by Category:
                        </label>
                        <select
                            id="category-filter"
                            onChange={handleCategoryChange}
                            value={selectedCategory}
                            className="py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={uniqueCategories.length === 0}
                            aria-label="Filter events by category"
                        >
                            <option value="All">All Categories</option>
                            {uniqueCategories.length > 0 ? (
                                uniqueCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No categories available</option>
                            )}
                        </select>
                    </div>
                </div>

                {uniqueCategories.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Category filtering is unavailable because no categories are defined for your registered events.
                    </p>
                )}

                <div className="h-[400px] w-full overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((reg) => (
                            <motion.div
                                key={reg.registrationId}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3 }}
                                className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4"
                            >
                                <img
                                    src={
                                        reg.event?.image ||
                                        "https://placehold.co/100x100/333333/FFFFFF?text=Image+Not+Found"
                                    }
                                    alt={reg.event?.title || "Event"}
                                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <h3
                                        className="text-lg font-medium cursor-pointer hover:underline"
                                        onClick={() =>
                                            handleNavigateToEvent(reg.event?._id)
                                        }
                                    >
                                        {reg.event?.title || "Untitled Event"}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {reg.event?.description ||
                                            "No description available"}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        handleDownloadCertificate(
                                            reg.event?._id,
                                            reg.event?.title
                                        )
                                    }
                                    disabled={certificateLoading[reg.event?._id]}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                                    aria-label={`Download certificate for ${reg.event?.title || "event"}`}
                                >
                                    {certificateLoading[reg.event?._id]
                                        ? "Generating..."
                                        : "Certificate"}
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No events found.
                        </p>
                    )}
                </div>

                {message && (
                    <p className="text-center mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {message}
                    </p>
                )}
            </div>

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
