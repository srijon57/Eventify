import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api"; // Import the configured Axios instance

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState(null);

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");

  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const response = await api.get("/auth/current-user", {
          headers: {
            Authorization: Bearer ${token},
          },
        });

        if (response.data.success) {
          setUser(response.data.data);
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
        const token = localStorage.getItem("token");
        const response = await api.get(/events/${id}, {
          headers: token ? { Authorization: Bearer ${token} } : {},
        });

        if (response.data.success) {
          setEvent(response.data.data);
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  // Handle registration
  const handleRegister = async () => {
    if (!studentId.trim() || !department.trim()) {
      setMessage("❌ Student ID and Department are required");
      return;
    }

    try {
      setRegistering(true);
      setMessage(null);

      const token = localStorage.getItem("token");
      const response = await api.post(
        /events/${id}/register,
        { studentId, department },
        {
          headers: {
            Authorization: Bearer ${token},
          },
        }
      );

      if (response.data.success) {
        setMessage("✅ Successfully registered!");
        setEvent((prev) => ({
          ...prev,
          participantsCount: prev.participantsCount + 1,
        }));
        setShowRegisterForm(false);
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error registering:", err);
      setMessage("❌ " + (err.response?.data?.message || err.message));
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
            src={event.createdBy?.profileImage}
            alt={event.createdBy?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{event.createdBy?.username}</p>
            <p className="text-sm text-gray-500">{event.createdBy?.email}</p>
          </div>
        </div>

        {/* Register button */}
        {user ? (
          <>
            <button
              onClick={() => setShowRegisterForm(true)}
              disabled={registering}
              className="block w-full text-center px-4 py-3 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors text-white font-medium"
            >
              {registering ? "Registering..." : "Register for Event"}
            </button>

            {/* Registration form modal */}
            {showRegisterForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-80 space-y-4">
                  <h2 className="text-xl font-semibold text-center">Register for Event</h2>
                  <input
                    type="text"
                    placeholder="Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                  />
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => setShowRegisterForm(false)}
                      className="flex-1 px-4 py-2 bg-gray-500 rounded-lg text-white hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className="flex-1 px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
                    >
                      {registering ? "Registering..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
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