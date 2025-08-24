// src/pages/dashboard/StudentDashboard.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import api from '../../lib/api'; // Assuming your API utility is here

export default function StudentDashboard() {
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // New state variables for fetching events
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchRegisteredEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const accessToken = localStorage.getItem("accessToken");
          // The updated API call with the correct path
          const response = await api.get(`/events/registered-events`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const eventsData = response.data.data;
          setRegisteredEvents(eventsData);
        } catch (err) {
          console.error("Failed to fetch registered events:", err);
          setError("Failed to load registered events. Please try again.");
          setRegisteredEvents([]);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchRegisteredEvents();
    }
  }, [user, isAuthLoading]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  // Updated filtering logic to match the new API response structure
  const filteredEvents = registeredEvents.filter(reg => {
    // The event data is now nested inside the registration object
    const event = reg.event;
    if (!event) return false; // Skip if for some reason event data is missing
    
    if (selectedCategory === 'All') {
      return true;
    }
    return event.category === selectedCategory;
  });

  // This is a placeholder for the handleLogout function, which you will need to implement
  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear tokens, redirect)
    console.log("Logout functionality to be implemented.");
    setShowLogoutDialog(false);
  };

  // Show a loading state while fetching user or event data
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <p className="text-xl">Loading your dashboard...</p>
      </div>
    );
  }

  // Show an error message if the fetch failed
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
        {/* Header and Logout Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          {/* You can add a logout button here */}
        </div>

        {/* Registered Events Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Events Registered</h2>
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
              {/* Dynamically create options based on fetched events */}
              {Array.from(new Set(filteredEvents.map(reg => reg.event.category))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="h-[400px] w-full overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(reg => (
              <div key={reg.registrationId} className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4">
                {/* Event Image */}
                <img 
                  src={reg.event.image} 
                  alt={reg.event.title} 
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div>
                  <h3 className="text-lg font-medium">{reg.event.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reg.event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No events found in this category.</p>
          )}
        </div>
      </div>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Are you sure you want to log out?</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You will need to sign in again to access your dashboard.
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
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
