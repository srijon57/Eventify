// src/pages/EventPage/EventPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState(null);

  const API_URL = "http://localhost:8000";

  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/current-user`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/events/${id}`, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          setEvent(data.data.event);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  // Handle registration
  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setRegistering(true);
      setMessage(null);

      const res = await fetch(`${API_URL}/api/v1/events/${id}/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration failed");

      setMessage("✅ Successfully registered!");
      setEvent((prev) => ({ ...prev, participantsCount: prev.participantsCount + 1 }));
    } catch (err) {
      console.error("Error registering:", err);
      setMessage("❌ " + err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading event...</p>;
  if (!event) return <p className="text-center mt-20">Event not found</p>;

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <div className="w-full max-w-xl px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-center">{event.title}</h1>

        <div className="rounded-lg overflow-hidden shadow-md">
          <img
            src={event.image || "https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found"}
            alt={event.title}
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found";
            }}
          />
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-lg text-gray-700 dark:text-gray-300">{event.description}</p>
        </div>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Organized by:</strong> {event.organizingClub}</p>
          <p><strong>Participants:</strong> {event.participantsCount}</p>
          <p><strong>Date & Time:</strong> {new Date(event.eventTime).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
          <img
            src={event.createdBy.profileImage}
            alt={event.createdBy.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{event.createdBy.username}</p>
            <p className="text-sm text-gray-500">{event.createdBy.email}</p>
          </div>
        </div>

        {/* Show register button for any logged-in user */}
        {user ? (
          <button
            onClick={handleRegister}
            disabled={registering}
            className="block w-full text-center px-4 py-3 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors text-white font-medium"
          >
            {registering ? "Registering..." : "Register for Event"}
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="block w-full text-center px-4 py-3 bg-gray-600 rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none text-white font-medium"
          >
            Login to Register
          </button>
        )}

        {message && (
          <p className="text-center mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}

        <a
          href={event.location}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-3 bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors text-white font-medium"
        >
          📍 View on Map
        </a>
      </div>
    </div>
  );
}
