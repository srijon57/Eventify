import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function StudentDashboard() {
    const { user, isLoading: isAuthLoading } = useContext(AuthContext);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchRegisteredEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching registered events...");
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }
            const response = await api.get("/events/registered-events", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("API response:", response.data);
            const events = response.data.data || [];
            console.log("Processed events:", events);
            setRegisteredEvents(events);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError(
                err.response?.data?.message ||
                    "Failed to load events. Please try again."
            );
        } finally {
            setIsLoading(false);
            console.log("Fetching complete. isLoading set to false.");
        }
    };

    useEffect(() => {
        console.log(
            "useEffect triggered. isAuthLoading:",
            isAuthLoading,
            "user:",
            user
        );
        if (!isAuthLoading && user) {
            fetchRegisteredEvents();
        }
    }, [user, isAuthLoading]);

    // Handle category filter change
    const handleCategoryChange = (e) => {
        console.log("Selected category:", e.target.value);
        setSelectedCategory(e.target.value);
    };

    // Extract unique categories for the filter dropdown
    const uniqueCategories = Array.from(
        new Set(
            registeredEvents
                .map((reg) => {
                    // Adjust 'category' to the correct field name if different (e.g., eventCategory)
                    const category = reg.event?.category || reg.event?.eventCategory;
                    if (!category) {
                        console.warn("Missing category for event:", reg);
                    }
                    return category;
                })
                .filter((category) => category)
        )
    );
    console.log("Unique categories:", uniqueCategories);

    // Filter events based on selected category
    const filteredEvents = registeredEvents.filter((reg) => {
        if (!reg.event) {
            console.warn("Event missing in registration:", reg);
            return false;
        }
        // Adjust 'category' to the correct field name if different
        const eventCategory = reg.event.category || reg.event.eventCategory;
        const matchesCategory =
            selectedCategory === "All" || eventCategory === selectedCategory;
        console.log(
            `Filtering event: ${reg.event.title}, Category: ${eventCategory}, Matches: ${matchesCategory}`
        );
        return matchesCategory;
    });

    // Handle navigation to event page
    const handleNavigateToEvent = (eventId) => {
        console.log("Navigating to event:", eventId);
        navigate(`/eventpage/${eventId}`);
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

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
            <div className="w-full max-w-2xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Student Dashboard</h1>
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
                            disabled={uniqueCategories.length === 0}
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

                {/* Fallback message if no categories */}
                {uniqueCategories.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Category filtering is unavailable because no categories are defined for your registered events.
                    </p>
                )}

                {/* Events List */}
                <div className="h-[400px] w-full overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((reg) => (
                            <motion.div
                                key={reg.registrationId}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                onClick={() => handleNavigateToEvent(reg.event._id)}
                                className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4 cursor-pointer"
                            >
                                <img
                                    src={reg.event.image}
                                    alt={reg.event.title}
                                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                />
                                <div>
                                    <h3 className="text-lg font-medium">
                                        {reg.event.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {reg.event.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No events found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}