import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports the default export 'api'
import api from "../../lib/api"; 
import EventForm from './../EventForm/EventForm';

// Define the Base URL locally since api.js no longer exports it by name
const BASE_URL = import.meta.env.VITE_BACKEND_URL; 

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handlePostEvent = () => {
    setShowEventForm(true);
  };

  const handleCancelForm = () => {
    setShowEventForm(false);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleNavigateToEvent = (eventId) => {
    if (eventId) {
      navigate(`/eventpage/${eventId}`);
    }
  };

  const filteredEvents = events.filter(event => {
    if (selectedCategory === 'All') {
      return true;
    }
    return event.category && event.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // --- Updated Event List Item Component ---
  const EventListItem = ({ event }) => (
    <div
      key={event._id}
      // List Item Styling: Horizontal layout, full width, border, list-like padding
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.005] hover:shadow-xl flex items-center p-4 mb-4 border border-gray-200 dark:border-gray-700"
      onClick={() => handleNavigateToEvent(event._id)}
    >
      {/* 1. Image Display (Fixed size on the left) */}
      <div className="flex-shrink-0 w-32 h-20 sm:w-48 sm:h-28 overflow-hidden rounded-md mr-4">
        {event.image ? (
          <img
            src={`${BASE_URL}${event.image}`}
            alt={event.title || 'Event Image'}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x225?text=NO+IMAGE'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* 2. Event Details (Takes remaining space) */}
      <div className="flex-grow min-w-0">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
          {event.title || event.name}
        </h3>
        <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 mb-2">
          {event.category} | {event.organizingClub}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 sm:line-clamp-2">
          {event.description}
        </p>
      </div>
      
      {/* 3. Action/Date (Right aligned) */}
      <div className="flex-shrink-0 ml-4 flex flex-col items-end">
        {/* You could add the date here */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents clicking the button from navigating the whole list item
            handleNavigateToEvent(event._id);
          }}
          className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2 sm:mt-0"
        >
          View Details
        </button>
      </div>
    </div>
  );
  // --- End Event List Item Component ---

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      {showEventForm ? (
        <EventForm onCancel={handleCancelForm} />
      ) : (
        <div className="w-full max-w-5xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          {/* Header and Buttons */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handlePostEvent}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Post New Event
            </button>
          </div>

          {/* Filter Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Created Events</h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter:
              </label>
              <select
                id="category-filter"
                onChange={handleCategoryChange}
                value={selectedCategory}
                className="py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">All Categories</option>
                <option value="Tech">Tech</option>
                <option value="Design">Design</option>
                <option value="Art & Culture">Art & Culture</option>
              </select>
            </div>
          </div>

          {/* Event List Display */}
          <div className="w-full">
            {isLoading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading events...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : filteredEvents.length > 0 ? (
              // FIX 4: Changed grid to simple flex column for list layout
              <div className="flex flex-col gap-3"> 
                {filteredEvents.map(event => (
                  // FIX 5: Changed component name
                  <EventListItem key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No events found in this category.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}