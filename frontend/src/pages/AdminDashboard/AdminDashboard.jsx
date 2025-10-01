import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../lib/api";
import EventForm from './../EventForm/EventForm';

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showEventForm, setShowEventForm] = useState(false);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch admin's created events
  const fetchAdminEvents = async (category = 'All') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // or your token storage method
      
      const params = {};
      if (category !== 'All') {
        params.category = category;
      }

      const response = await api.get("/events/admin/created-events", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params
      });

      if (response.data && response.data.data) {
        setCreatedEvents(response.data.data.events);
      }
    } catch (err) {
      console.error('Error fetching admin events:', err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminEvents(selectedCategory);
  }, [selectedCategory]);

  const handlePostEvent = () => {
    setShowEventForm(true);
  };
  
  const handleCancelForm = () => {
    setShowEventForm(false);
    // Refresh events after form cancellation (in case new event was created elsewhere)
    fetchAdminEvents(selectedCategory);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleEventClick = (eventId) => {
    navigate(`/eventpage/${eventId}`);
  };

  const filteredEvents = createdEvents.filter(event => {
    if (selectedCategory === 'All') {
      return true;
    }
    return event.category === selectedCategory;
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      {showEventForm ? (
        <EventForm onCancel={handleCancelForm} onSuccess={handleCancelForm} />
      ) : (
        <div className="w-full max-w-2xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
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
  
          {/* Created Events Section */}
          <div className="flex justify-between items-center mb-4">
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
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
                {/* Add more categories as needed */}
              </select>
            </div>
          </div>
          
          <div className="h-[400px] w-full overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading events...</p>
            ) : error ? (
              <p className="text-center text-red-500 dark:text-red-400">{error}</p>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div 
                  key={event._id} 
                  onClick={() => handleEventClick(event._id)}
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4 cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md"
                >
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>📍 {event.location}</span>
                      <span>🕒 {new Date(event.eventTime).toLocaleString()}</span>
                      <span>👥 {event.participantsCount} participants</span>
                      <span>👁️ {event.viewsCount} views</span>
                    </div>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {event.category}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No events found in this category.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}