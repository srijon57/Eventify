import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });
  const navigate = useNavigate();
  const categories = [
    "Workshop", "Seminar", "Conference", "Cultural",
    "Sports", "Technical", "Social", "Other"
  ];

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, categoryFilter]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(categoryFilter && { category: categoryFilter })
      };
      const response = await api.get("/events/get-all-events", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params
      });
      if (response.data.success) {
        const data = response.data.data;
        setEvents(data.events || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0
        }));
      } else {
        throw new Error(response.data.message || "Failed to fetch events.");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Could not load events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToEvent = (eventId) => {
    navigate(`/eventpage/${eventId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizingClub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Events
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Discover and join amazing events, workshops, and meetups. Find something that interests you!
          </p>
        </motion.div>

        {/* Check if user is logged in */}
        {!localStorage.getItem("token") ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 text-center"
          >
            <div className="text-yellow-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Please log in to see events
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You need to be logged in to view and join events.{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 hover:underline font-medium"
              >
                Log in here
              </button>
              .
            </p>
          </motion.div>
        ) : (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <select
                    value={categoryFilter}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : filteredEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                          {event.title}
                        </h3>
                        {event.image && (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover rounded-md mb-4"
                          />
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 line-clamp-3">
                          {event.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            <strong>Category:</strong> {event.category}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            <strong>Organizer:</strong> {event.organizingClub}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            <strong>Date:</strong> {new Date(event.eventTime).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            <strong>Participants:</strong> {event.participantsCount}
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleNavigateToEvent(event._id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-center items-center gap-4 mt-8"
                  >
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600 dark:text-gray-300">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No events found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm || categoryFilter
                    ? "Try adjusting your search or filters"
                    : "No events available at the moment. Check back later!"}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
