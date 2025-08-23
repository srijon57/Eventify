import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HeroImage from "@/assets/Hero.jpg";

const events = [
  { title: "Tech Meetup 2024", description: "Join us for a day of innovation and networking." },
  { title: "Web Dev Workshop", description: "Learn the latest trends in web development." },
  { title: "AI & Machine Learning", description: "An introduction to AI, with hands-on labs." },
  { title: "Startup Pitch Night", description: "Pitch your ideas to top investors and mentors." },
  { title: "Blockchain Seminar", description: "Explore blockchain technology and its applications." },
];

export default function HomePage() {
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

      {/* Featured Events */}
      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.title}
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
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">{event.description}</p>
                  <div className="flex justify-end">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <Button>View Details</Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
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
          />
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Button>Subscribe</Button>
          </motion.div>
        </form>
      </motion.section>
    </div>
  );
}