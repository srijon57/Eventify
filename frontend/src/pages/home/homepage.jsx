import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroImage from "@/assets/Hero.jpg";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function HomePage() {
  const [topAttendedEvents, setTopAttendedEvents] = useState([]);
  const [topViewedEvents, setTopViewedEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
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
          // Set the first event as featured
          if (attendedResponse.data.data.length > 0) {
            setFeaturedEvent(attendedResponse.data.data[0]);
          }
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
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 -left-40 w-[400px] h-[400px] bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-[400px] h-[400px] bg-indigo-400/30 rounded-full blur-3xl animate-pulse" />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-24 pb-16 px-6 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight"
        >
          Discover Epic Events with <span className="text-yellow-300">Eventify</span>
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto"
        >
          Join the hottest tech events, workshops, and meetups in your city.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <button
            onClick={handleExploreEvents}
            className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
          >
            Find Your Next Event
          </button>
        </motion.div>
        <motion.img
          src={HeroImage}
          alt="Event Hero"
          className="mt-12 w-full h-70 max-w-4xl mx-auto rounded-2xl shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </motion.section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto px-6 py-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
            Featured Event
          </h2>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <img
              src={featuredEvent.image}
              alt={featuredEvent.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                {featuredEvent.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {new Date(featuredEvent.date).toLocaleDateString()} |{" "}
                {featuredEvent.totalRegistrations} Registrations
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNavigateToEvent(featuredEvent.eventId)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                Join Now
              </motion.button>
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* Analytics Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
    Event Highlights
  </h2>

  {!localStorage.getItem("token") ? (
    // Show login message if user is not logged in
    <div className="text-center py-12">
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
        🔒 Please <span className="font-semibold">login</span> to see event highlights.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
      >
        Login Now
      </button>
    </div>
  ) : isLoading ? (
    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
      Loading highlights...
    </div>
  ) : error ? (
    <div className="text-center text-red-500 py-12">{error}</div>
  ) : (
    // Your existing highlights grid
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Registered Events */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <span>🏆</span> Top Popular Events
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Events with the most registrations
                  </p>
                  {topAttendedEvents.length > 0 ? (
                    <div className="space-y-6">
                      {topAttendedEvents.slice(0, 3).map((event, index) => (
                        <motion.div
                          key={event.eventId}
                          whileHover={{ scale: 1.03 }}
                          className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-lg shadow-md"
                        >
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
                            {index + 1}. {event.title}
                          </h4>
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-40 object-cover rounded-md mb-3"
                            />
                          )}
                          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full">
                              👥 {event.totalRegistrations}
                            </span>
                          </div>
                          <div className="flex justify-end mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => handleNavigateToEvent(event.eventId)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                            >
                              View Event
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <p className="text-lg">No registration data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Top Viewed Events */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                    <span>👀</span> Top Viewed Events
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Events with the most views
                  </p>
                  {topViewedEvents.length > 0 ? (
                    <div className="space-y-6">
                      {topViewedEvents.slice(0, 3).map((event, index) => (
                        <motion.div
                          key={event._id}
                          whileHover={{ scale: 1.03 }}
                          className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 rounded-lg shadow-md"
                        >
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
                            {index + 1}. {event.title}
                          </h4>
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-40 object-cover rounded-md mb-3"
                            />
                          )}
                          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>{new Date(event.eventTime).toLocaleDateString()}</span>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full">
                              👁️ {event.viewsCount}
                            </span>
                          </div>
                          <div className="flex justify-end mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => handleNavigateToEvent(event._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                            >
                              View Event
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <p className="text-lg">No view data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl w-full py-16 text-center mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-gray-800 dark:text-gray-100">💬 Community Voices</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: "Showrov", text: "Eventify helped me find amazing hackathons and network with great people!" },
            { name: "Rakibul", text: "Workshops here are always super insightful and well-organized." },
            { name: "Sumit", text: "A fantastic platform to explore trending events near me." },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-md"
            >
              <p className="italic text-gray-600 dark:text-gray-300 mb-4">"{t.text}"</p>
              <h4 className="font-semibold text-indigo-600">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-6xl w-full py-12 mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100">Explore by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {["Hackathons", "Workshops", "Meetups"].map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl cursor-pointer text-center"
            >
              <h3 className="text-xl font-semibold">{cat}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Find the best {cat.toLowerCase()} happening near you.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-6 py-16 mb-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Ready for Your Next Adventure?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore a world of events, from tech talks to networking meetups, all in one place.
        </p>
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
          <button
            onClick={handleExploreEvents}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Browse All Events
          </button>
        </motion.div>
      </motion.section>
    </div>
  );
}