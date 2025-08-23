import  "react";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <header className="w-full bg-blue-600 text-white py-6">
                <h1 className="text-4xl font-bold text-center">
                    HACKATHON PROJECT: Eventify - University Club Event
                    Management Platform
                </h1>
            </header>
            <main className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Problem Statement
                    </h2>
                    <p className="text-gray-600">
                        Create a full-stack web application called "Eventify" —
                        an event management portal specially designed for
                        university clubs. It allows club admins to organize
                        events and students to register and view them. Students
                        will build a functional, user-friendly web platform
                        using a tech stack of their choice.
                    </p>
                </section>
                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        User Roles
                    </h2>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Student: can browse and register for events.</li>
                        <li>
                            Club Admin: can add, edit, or delete events and
                            manage attendees.
                        </li>
                    </ul>
                </section>
                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Core Features (MVP)
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">
                                Authentication
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 ml-4">
                                <li>Signup/Login system</li>
                                <li>Role-based access (Student, Admin)</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">
                                Student Features:
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 ml-4">
                                <li>View upcoming events</li>
                                <li>Register/Unregister from an event</li>
                                <li>
                                    Personal dashboard showing registered events
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-gray-700">
                                Admin Features:
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 ml-4">
                                <li>Create new events</li>
                                <li>Edit/Delete existing events</li>
                                <li>View attendee list for each event</li>
                            </ul>
                        </div>
                    </div>
                </section>
                <div className="text-center">
                    <a
                        href="/login"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg ml-4 hover:bg-green-700 transition duration-300"
                    >
                        Register
                    </a>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
