// src/pages/admin/EventForm.jsx

import React, { useState } from 'react';

export default function EventForm({ onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    location: '',
    eventTime: '',
    category: '',
    organizingClub: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is where you would handle the form submission,
    // for example, by making an API call to your backend
    console.log("Submitting new event:", formData);
    // After submission, you might want to clear the form or navigate back
    // setFormData({ ...initial state ... });
    onCancel(); // For now, just go back to the dashboard
  };

  return (
    <div className="w-full max-w-2xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 p-2"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Event Date & Time
          </label>
          <input
            type="datetime-local"
            id="eventTime"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="organizingClub" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organizing Club
          </label>
          <input
            type="text"
            id="organizingClub"
            name="organizingClub"
            value={formData.organizingClub}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 p-2"
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
