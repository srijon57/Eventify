import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import api from "../../lib/api";

export default function ParticipantsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Fetch event details and participants
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                
                if (!token) {
                    setError("Please log in to view participants");
                    setLoading(false);
                    return;
                }

                // Fetch event details
                const eventResponse = await api.get(`/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (eventResponse.data.success) {
                    const eventData = eventResponse.data.data;
                    setEvent(eventData);

                    // Check if current user is the event owner
                    if (user && eventData.createdBy?._id !== user._id) {
                        setError("You are not authorized to view participants of this event");
                        setLoading(false);
                        return;
                    }

                    // Fetch participants
                    await fetchParticipants(1);
                } else {
                    setError("Event not found");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.response?.data?.message || "Failed to load event data");
            } finally {
                setLoading(false);
            }
        };

        if (id && user) {
            fetchData();
        }
    }, [id, user]);

    const fetchParticipants = async (page) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(`/events/${id}/registered-users`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit: pagination.limit }
            });

            if (response.data.success) {
                setParticipants(response.data.data.registrations || []);
                setPagination(prev => ({
                    ...prev,
                    page: response.data.data.pagination.page,
                    total: response.data.data.pagination.total,
                    totalPages: response.data.data.pagination.totalPages
                }));
            }
        } catch (err) {
            console.error("Error fetching participants:", err);
            setError(err.response?.data?.message || "Failed to load participants");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchParticipants(newPage);
        }
    };

    const handleSendReminder = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.post(`/events/${id}/send-event-email`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.message) {
                alert(`✅ ${response.data.message}`);
            }
        } catch (err) {
            console.error("Error sending reminders:", err);
            alert("❌ " + (err.response?.data?.message || "Failed to send reminders"));
        }
    };

    const exportToCSV = () => {
        if (participants.length === 0) return;

        const headers = ["Name", "Email", "Student ID", "Department", "Registered At"];
        const csvData = participants.map(participant => [
            participant.user?.username || "N/A",
            participant.user?.email || "N/A",
            participant.studentId || "N/A",
            participant.department || "N/A",
            new Date(participant.createdAt).toLocaleString()
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.map(field => `"${field}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `participants-${event.title}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md text-center">
                    <div className="text-red-500 text-4xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error</h2>
                    <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h2>
                    <button
                        onClick={() => navigate("/events")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 md:mb-0"
                            >
                                ← Back to Event
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                Participants for {event.title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Total Registered: {event.participantsCount} participants
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                            <button
                                onClick={handleSendReminder}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                📧 Send Reminders
                            </button>
                            <button
                                onClick={exportToCSV}
                                disabled={participants.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                📊 Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Event Info Card */}
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Event Date</h3>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {new Date(event.eventTime).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Organizer</h3>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {event.organizingClub}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                {event.category}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Participants List */}
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Registered Participants ({pagination.total})
                        </h2>
                    </div>

                    {participants.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">👥</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No participants yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Participants who register for this event will appear here.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Participant
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Student ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Registered On
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {participants.map((participant, index) => (
                                            <tr key={participant._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={participant.user?.profileImage || `https://placehold.co/40x40?text=${participant.user?.username?.charAt(0)?.toUpperCase() || 'U'}`}
                                                            alt={participant.user?.username}
                                                        />
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {participant.user?.username || "Unknown User"}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {participant.user?.email || "No email"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white font-mono">
                                                        {participant.studentId || "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {participant.department || "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(participant.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing page {pagination.page} of {pagination.totalPages}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={pagination.page === 1}
                                                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={pagination.page === pagination.totalPages}
                                                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Stats */}
                {participants.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 text-center">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {pagination.total}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Total Participants</div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {participants.filter(p => p.department).length}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">With Department</div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {new Set(participants.map(p => p.department)).size}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Departments</div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {Math.ceil(pagination.total / pagination.limit)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Total Pages</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}