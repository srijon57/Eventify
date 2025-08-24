import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HeroImage from "@/assets/Hero.jpg";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api"; // Import the configured Axios instance

// Assuming you have the BASE_URL defined somewhere, 
// for image loading compatibility, you might need to import it here
// import { BASE_URL } from "../../lib/api"; 
// OR define it locally: 
// const BASE_URL = import.meta.env.VITE_BACKEND_URL; 

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add state for top event since it's used in the effect hook
  const [topEvent, setTopEvent] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/events/get-all-events", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch events.");
        }

        const fetchedEvents = response.data.data?.events || [];
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Could not load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchTopEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/v1/analytics/top-attended-event", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setTopEvent(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTopEvent();
  }, []);

  const handleNavigateToEvent = (eventId) => {
    navigate(`/eventpage/${eventId}`);
  };
  
  // Helper Component for repeated Card content
  const EventCardContent = ({ event, colorClass, darkColorClass }) => (
    <>
      {event.image && (
          <img
            // src={BASE_URL ? `${BASE_URL}${event.image}` : event.image} // Use BASE_URL if defined
            src={event.image} // Keeping original for now, but be aware of Base URL issue
            alt={event.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
      <p className={`text-sm ${colorClass} ${darkColorClass} mb-4`}>
        {event.description}
      </p>
      <div className="flex justify-end">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Button onClick={() => handleNavigateToEvent(event._id)}>View Details</Button>
        </motion.div>
      </div>
    </>
  );

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
            <Button variant="default" size="lg">Explore Events</Button>
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

      {/* NEW: Container for Top Registered and Top Viewed Sections */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row lg:space-x-8 mt-12 mb-20">
        
        {/* Top Registered Events */}
        <section className="w-full lg:w-1/2 mb-12 lg:mb-0">
          <h2 className="text-3xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
            Top Registered Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {events.slice(0, 1).map((event) => ( // Display the very first event (index 0)
              <motion.div
                key={event._id + "-registered"}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card className="w-full bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-blue-900 dark:text-blue-100">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EventCardContent 
                      event={event} 
                      colorClass="text-blue-800" 
                      darkColorClass="dark:text-blue-200" 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Top Viewed Events */}
        <section className="w-full lg:w-1/2">
          <h2 className="text-3xl font-semibold mb-6 text-green-600 dark:text-green-400">
            Top Viewed Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {events.slice(1, 2).map((event) => ( // Display the second event (index 1)
              <motion.div
                key={event._id + "-viewed"}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card className="w-full bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700">
                  <CardHeader>
                    <CardTitle className="text-green-900 dark:text-green-100">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EventCardContent 
                      event={event} 
                      colorClass="text-green-800" 
                      darkColorClass="dark:text-green-200" 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
      {/* END NEW CONTAINER */}
      
      {/* Featured Events */}
      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">Featured Events</h2>
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EventCardContent 
                      event={event} 
                      colorClass="text-gray-500" 
                      darkColorClass="dark:text-gray-300" 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">No events found.</div>
        )}
      </section>
        
      {/* Newsletter / Call-to-Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Subscribe to our newsletter to get the latest events directly in your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border rounded-md flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            id="email-newsletter"
            name="email-newsletter"
          />
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button>Subscribe</Button>
          </motion.div>
        </form>
      </motion.section>
    </div>
  );
}