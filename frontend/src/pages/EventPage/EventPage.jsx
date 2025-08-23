// src/pages/event/EventPage.jsx

import React from 'react';

// This is mock data to demonstrate the page layout.
const mockEvent = {
  id: 1,
  title: "Tech Meetup 2024",
  description: "Join us for a day of innovation and networking. We'll have speakers covering the latest in AI, web development, and cloud computing. There will also be a chance to network with professionals and other students.",
  imageUrl: "https://placehold.co/600x400/333333/FFFFFF?text=Event+Image",
  location: "AUST Auditorium",
  locationLink: "https://www.google.com/maps/place/Ahsanullah+University+of+Science+and+Technology/@23.731461,90.407267,17z/data=!3m1!4b1!4m6!3m5!1s0x3755b85a30f14371:0x411edb5f1f9b3b0d!8m2!3d23.731461!4d90.4098419!16s%2Fm%2F09j19y5?entry=ttu",
};

export default function EventPage({ event = mockEvent }) {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <div className="w-full max-w-xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        {/* Event Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{event.title}</h1>
        </div>

        <div className="space-y-6">
          {/* Image Section */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src="https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found";
              }}
            />
          </div>

          {/* Text Content Section */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {event.description}
            </p>
          </div>

          {/* Clickable Location Section */}
          <a
            href={event.locationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-3 bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <span className="text-lg font-medium text-white">
              {event.location}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
