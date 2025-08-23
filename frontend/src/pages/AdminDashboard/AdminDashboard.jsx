// src/pages/admin/AdminDashboard.jsx

import React, { useState } from 'react';

// This is just mock data to simulate events created by the admin, now with categories
const createdEvents = [
  { id: 1, name: 'Tech Meetup 2024', description: 'Join us for a day of innovation and networking.', category: 'Tech' },
  { id: 2, name: 'Web Dev Workshop', description: 'Learn the latest trends in web development.', category: 'Tech' },
  { id: 3, name: 'Creative Writing Workshop', description: 'Unleash your inner writer.', category: 'Art & Culture' },
  { id: 4, name: 'AI & Machine Learning', description: 'An introduction to AI, with hands-on labs.', category: 'Tech' },
  { id: 5, name: 'Photography Basics', description: 'Learn to take stunning photos.', category: 'Art & Culture' },
  { id: 6, name: 'Cybersecurity Conference', description: 'Explore the future of digital security.', category: 'Tech' },
  { id: 7, name: 'UI/UX Design Masterclass', description: 'Master the principles of user-centric design.', category: 'Design' },
];

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handlePostEvent = () => {
    // This is where you would implement the logic to show a form
    // or navigate to a new page for creating and posting a new event.
    console.log("Navigating to event creation page...");
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredEvents = createdEvents.filter(event => {
    if (selectedCategory === 'All') {
      return true;
    }
    return event.category === selectedCategory;
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
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
            </select>
          </div>
        </div>
        
        <div className="h-[400px] w-full overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4">
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
    </div>
  );
}
