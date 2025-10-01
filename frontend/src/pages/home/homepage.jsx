import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroImage from "@/assets/Hero.jpg";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function HomePage() {
  const [topAttendedEvents, setTopAttendedEvents] = useState([]);
  const [topViewedEvents, setTopViewedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        // Fetch top attended events
        const attendedResponse = await api.get("/analytics/top-attended-event", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (attendedResponse.data.success && attendedResponse.data.data) {
          setTopAttendedEvents(attendedResponse.data.data);
        }

        // Fetch top viewed events
        const viewedResponse = await api.get("/analytics/top-viewed-event", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (viewedResponse.data.success && viewedResponse.data.data) {
          setTopViewedEvents(viewedResponse.data.data);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Could not load analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleNavigateToEvent = (eventId) => {
    navigate(`/eventpage/${eventId}`);
  };

  const handleExploreEvents = () => {
    navigate("/events");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mb-12"
      >
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Eventify</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Discover and join the latest tech events, workshops, and meetups near you.
        </p>
        <div className="mt-6">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <button
              onClick={handleExploreEvents}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
            >
              Explore Events
            </button>
          </motion.div>
        </div>
        <motion.img
          src={HeroImage}
          alt="Event Hero"
          className="mt-8 w-full max-w-3xl rounded-xl shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.section>

      {/* Analytics Section */}
      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-semibold mb-8 text-center">Event Analytics</h2>

        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            Loading analytics...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Registered Events */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border border-blue-200 dark:border-blue-600 rounded-lg overflow-hidden shadow-sm">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2">
                    <span>🏆</span> Top 3 Popular Events
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    Highest number of registrations
                  </p>
                  {topAttendedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {topAttendedEvents.map((event, index) => (
                        <div key={event.eventId} className="p-4 bg-white dark:bg-blue-950 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            {index + 1}. {event.title}
                          </h4>
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-32 object-cover rounded-md my-2"
                            />
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700 dark:text-blue-300">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                              👥 {event.totalRegistrations}
                            </span>
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleNavigateToEvent(event.eventId)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-blue-700 dark:text-blue-300">
                      <p className="text-lg mb-2">No registration data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Top Viewed Events */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border border-green-200 dark:border-green-600 rounded-lg overflow-hidden shadow-sm">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 flex items-center gap-2 mb-2">
                    <span>👀</span> Top 3 Viewed Events
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                    Highest number of views
                  </p>
                  {topViewedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {topViewedEvents.map((event, index) => (
                        <div key={event._id} className="p-4 bg-white dark:bg-green-950 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                            {index + 1}. {event.title}
                          </h4>
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-32 object-cover rounded-md my-2"
                            />
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700 dark:text-green-300">
                              {new Date(event.eventTime).toLocaleDateString()}
                            </span>
                            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                              👁️ {event.viewsCount}
                            </span>
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleNavigateToEvent(event._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-green-700 dark:text-green-300">
                      <p className="text-lg mb-2">No view data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Call-to-Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-4">Ready to Explore More?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Discover all our upcoming events, workshops, and meetups in one place.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <button
            onClick={handleExploreEvents}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
          >
            Browse All Events
          </button>
        </motion.div>
      </motion.section>
    </div>
  );
}
