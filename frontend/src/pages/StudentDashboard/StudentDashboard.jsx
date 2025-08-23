// src/pages/dashboard/StudentDashboard.jsx

import React, { useState } from 'react';

// This is just mock data to simulate registered events with categories
const registeredEvents = [
  { id: 1, name: 'Tech Meetup 2024', description: 'Join us for a day of innovation and networking.', category: 'Tech', imageUrl: 'https://placehold.co/100x100/A3E635/000000?text=Event+1' },
  { id: 2, name: 'Web Dev Workshop', description: 'Learn the latest trends in web development.', category: 'Tech', imageUrl: 'https://placehold.co/100x100/FDE68A/000000?text=Event+2' },
  { id: 3, name: 'AI & Machine Learning', description: 'An introduction to AI, with hands-on labs.', category: 'Tech', imageUrl: 'https://placehold.co/100x100/BEF264/000000?text=Event+3' },
  { id: 4, name: 'Cybersecurity Conference', description: 'Explore the future of digital security.', category: 'Tech', imageUrl: 'https://placehold.co/100x100/93C5FD/000000?text=Event+4' },
  { id: 5, name: 'Game Development Hackathon', description: 'Build your own game in 24 hours.', category: 'Tech', imageUrl: 'https://placehold.co/100x100/C4B5FD/000000?text=Event+5' },
  { id: 6, name: 'UI/UX Design Masterclass', description: 'Master the principles of user-centric design.', category: 'Design', imageUrl: 'https://placehold.co/100x100/A7F3D0/000000?text=Event+6' },
  { id: 7, name: 'Creative Writing Workshop', description: 'Unleash your inner writer.', category: 'Art & Culture', imageUrl: 'https://placehold.co/100x100/A1A1AA/000000?text=Event+7' },
  { id: 8, name: 'Photography Basics', description: 'Learn to take stunning photos.', category: 'Art & Culture', imageUrl: 'https://placehold.co/100x100/22C55E/000000?text=Event+8' },
];

export default function StudentDashboard() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
    setShowLogoutDialog(false);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredEvents = registeredEvents.filter(event => {
    if (selectedCategory === 'All') {
      return true;
    }
    return event.category === selectedCategory;
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <div className="w-full max-w-2xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        {/* Header and Logout Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-800 rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
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
              <option value="Tech">Tech</option>
              <option value="Design">Design</option>
              <option value="Art & Culture">Art & Culture</option>
            </select>
          </div>
        </div>
        
        <div className="h-[400px] w-full overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4">
                {/* Event Image */}
                <img 
                  src={event.imageUrl} 
                  alt={event.name} 
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div>
                  <h3 className="text-lg font-medium">{event.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>
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