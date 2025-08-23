import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
    const [profilePic, setProfilePic] = useState(null);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Register to Eventify
                </h1>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Student ID
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your student ID"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Department
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your department"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Profile Picture (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {profilePic && (
                            <div className="mt-2">
                                <img
                                    src={profilePic}
                                    alt="Profile Preview"
                                    className="w-20 h-20 object-cover rounded-full"
                                />
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
