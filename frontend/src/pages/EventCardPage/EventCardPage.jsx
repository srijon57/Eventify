import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import api from "../../lib/api"; 

export default function EventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [unregistering, setUnregistering] = useState(false);
    const [message, setMessage] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [department, setDepartment] = useState("");

    // Edit form state
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        location: '',
        eventTime: '',
        category: '',
        organizingClub: '',
        registrationDeadline: '',
        image: null,
    });

    // Fetch event details
    const fetchEvent = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(`/events/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (response.data.success) {
                const eventData = response.data.data;
                setEvent(eventData);
                
                setEditFormData({
                    title: eventData.title,
                    description: eventData.description,
                    location: eventData.location,
                    eventTime: new Date(eventData.eventTime).toISOString().slice(0, 16),
                    category: eventData.category,
                    organizingClub: eventData.organizingClub,
                    registrationDeadline: eventData.registrationDeadline 
                        ? new Date(eventData.registrationDeadline).toISOString().slice(0, 16)
                        : '',
                    image: null,
                });
                
                if (user && eventData.createdBy?._id === user._id) {
                    setIsOwner(true);
                }
                
                await checkUserRegistration();
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

    // Check if user is registered for this event
    const checkUserRegistration = async () => {
        if (!user) return;
        
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(`/events/registered-events`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                const registeredEvents = response.data.data.dashboardEvents || [];
                const isUserRegistered = registeredEvents.some(
                    reg => reg.event?._id === id
                );
                setIsRegistered(isUserRegistered);
            }
        } catch (err) {
            console.error("Error checking registration:", err);
        }
    };

    useEffect(() => {
        if (id) fetchEvent();
    }, [id, user]);

    // Handle edit form input change
    const handleEditInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            setEditFormData({ ...editFormData, [name]: files[0] });
        } else {
            setEditFormData({ ...editFormData, [name]: value });
        }
    };

    // Handle event update
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            setMessage("Updating event...");

            const token = localStorage.getItem("token");
            const data = new FormData();
            
            if (editFormData.title !== event.title) data.append('title', editFormData.title);
            if (editFormData.description !== event.description) data.append('description', editFormData.description);
            if (editFormData.location !== event.location) data.append('location', editFormData.location);
            if (editFormData.eventTime !== new Date(event.eventTime).toISOString().slice(0, 16)) {
                data.append('eventTime', new Date(editFormData.eventTime).toISOString());
            }
            if (editFormData.category !== event.category) data.append('category', editFormData.category);
            if (editFormData.organizingClub !== event.organizingClub) data.append('organizingClub', editFormData.organizingClub);
            
            if (editFormData.registrationDeadline) {
                const newDeadline = new Date(editFormData.registrationDeadline).toISOString();
                const oldDeadline = event.registrationDeadline ? new Date(event.registrationDeadline).toISOString() : null;
                if (newDeadline !== oldDeadline) {
                    data.append('registrationDeadline', newDeadline);
                }
            }
            
            if (editFormData.image) {
                data.append('image', editFormData.image);
            }

            const response = await api.patch(`/events/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setMessage("✅ Event updated successfully!");
                setEvent(response.data.data);
                setIsEditing(false);
                fetchEvent();
            }
        } catch (err) {
            console.error("Error updating event:", err);
            setMessage("❌ " + (err.response?.data?.message || err.message));
        }
    };

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
                `/events/${id}/register`,
                { studentId, department },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setMessage("✅ Successfully registered!");
                setEvent((prev) => ({
                    ...prev,
                    participantsCount: prev.participantsCount + 1,
                }));
                setIsRegistered(true);
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

    // Handle unregistration
    const handleUnregister = async () => {
        try {
            setUnregistering(true);
            setMessage(null);

            const token = localStorage.getItem("token");
            const response = await api.delete(
                `/events/${id}/unregister`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setMessage("✅ Successfully unregistered!");
                setEvent((prev) => ({
                    ...prev,
                    participantsCount: Math.max(0, prev.participantsCount - 1),
                }));
                setIsRegistered(false);
            } else {
                throw new Error(response.data.message || "Unregistration failed");
            }
        } catch (err) {
            console.error("Error unregistering:", err);
            setMessage("❌ " + (err.response?.data?.message || err.message));
        } finally {
            setUnregistering(false);
        }
    };

    // Handle event deletion
    const handleDeleteEvent = async () => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await api.delete(`/events/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setMessage("✅ Event deleted successfully!");
                setTimeout(() => navigate("/events"), 1000);
            }
        } catch (err) {
            console.error("Error deleting event:", err);
            setMessage("❌ " + (err.response?.data?.message || err.message));
        }
    };

    // View registered users
    const handleViewRegisteredUsers = () => {
        navigate(`/events/${id}/participants`);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData({
            title: event.title,
            description: event.description,
            location: event.location,
            eventTime: new Date(event.eventTime).toISOString().slice(0, 16),
            category: event.category,
            organizingClub: event.organizingClub,
            registrationDeadline: event.registrationDeadline 
                ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
                : '',
            image: null,
        });
        setMessage(null);
    };

    if (loading) return <p className="text-center mt-20 text-xl text-gray-500 dark:text-gray-400">Loading event...</p>;
    if (!event) return <p className="text-center mt-20 text-xl text-red-500 dark:text-red-400">Event not found</p>;

    const isRegistrationClosed = new Date() > new Date(event.registrationDeadline || new Date(event.eventTime).getTime() - 60 * 60 * 1000);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8">
                {isEditing ? (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Edit Event</h1>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditInputChange}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:hover:bg-indigo-700 transition"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Leave empty to keep current image</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={editFormData.location}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    name="eventTime"
                                    value={editFormData.eventTime}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Deadline</label>
                                <input
                                    type="datetime-local"
                                    name="registrationDeadline"
                                    value={editFormData.registrationDeadline}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                                <select
                                    name="category"
                                    value={editFormData.category}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                >
                                    <option value="workshop">Workshop</option>
                                    <option value="seminar">Seminar</option>
                                    <option value="conference">Conference</option>
                                    <option value="cultural">Cultural</option>
                                    <option value="sports">Sports</option>
                                    <option value="technical">Technical</option>
                                    <option value="social">Social</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organizing Club *</label>
                                <input
                                    type="text"
                                    name="organizingClub"
                                    value={editFormData.organizingClub}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpdateEvent}
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Update Event
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white">{event.title}</h1>

                            <div className="rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={
                                        event.image ||
                                        "https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found"
                                    }
                                    alt={event.title}
                                    className="w-full h-80 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found";
                                    }}
                                />
                            </div>

                            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md">
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                                <div>
                                    <p><strong>Category:</strong> <span className="capitalize">{event.category}</span></p>
                                    <p><strong>Organized by:</strong> {event.organizingClub}</p>
                                    <p><strong>Participants:</strong> {event.participantsCount}</p>
                                    <p><strong>Views:</strong> {event.viewsCount || 0}</p>
                                </div>
                                <div>
                                    <p><strong>Date & Time:</strong> {new Date(event.eventTime).toLocaleString()}</p>
                                    {event.registrationDeadline && (
                                        <p>
                                            <strong>Registration Deadline:</strong>{" "}
                                            {new Date(event.registrationDeadline).toLocaleString()}
                                            {isRegistrationClosed && (
                                                <span className="text-red-500 ml-2 font-semibold">(Closed)</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md">
                                <img
                                    src={event.createdBy?.profileImage || "https://placehold.co/40x40?text=U"}
                                    alt={event.createdBy?.username}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{event.createdBy?.username || "Unknown User"}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.createdBy?.email || ""}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {user ? (
                                    <>
                                        {isRegistered ? (
                                            <button
                                                onClick={handleUnregister}
                                                disabled={unregistering}
                                                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none font-semibold disabled:opacity-50 transition"
                                            >
                                                {unregistering ? "Unregistering..." : "Unregister from Event"}
                                            </button>
                                        ) : (
                                            <>
                                                {isRegistrationClosed ? (
                                                    <button
                                                        disabled
                                                        className="w-full px-6 py-3 bg-gray-400 text-white rounded-lg shadow-md font-semibold cursor-not-allowed"
                                                    >
                                                        Registration Closed
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setShowRegisterForm(true)}
                                                        disabled={registering}
                                                        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none font-semibold disabled:opacity-50 transition"
                                                    >
                                                        {registering ? "Registering..." : "Register for Event"}
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {showRegisterForm && (
                                            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-xl">
                                                    <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">Register for Event</h2>
                                                    <input
                                                        type="text"
                                                        placeholder="Student ID"
                                                        value={studentId}
                                                        onChange={(e) => setStudentId(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Department"
                                                        value={department}
                                                        onChange={(e) => setDepartment(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    />
                                                    <div className="flex justify-between gap-4">
                                                        <button
                                                            onClick={() => setShowRegisterForm(false)}
                                                            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleRegister}
                                                            disabled={registering}
                                                            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
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
                                        className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none font-semibold transition"
                                    >
                                        Login to Register
                                    </button>
                                )}

                                <a
                                    href={event.location}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none font-semibold transition"
                                >
                                    📍 View on Map
                                </a>
                            </div>

                            {isOwner && (
                                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={handleViewRegisteredUsers}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                                    >
                                        View Participants
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition"
                                    >
                                        Edit Event
                                    </button>
                                    <button
                                        onClick={handleDeleteEvent}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
                                    >
                                        Delete Event
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {message && (
                    <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}