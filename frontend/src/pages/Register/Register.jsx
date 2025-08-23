import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "../../lib/api";

const Register = () => {
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(null);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        studentId: "",
        department: "CSE",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("username", form.username);
            fd.append("email", form.email);
            fd.append("password", form.password);
            fd.append("studentId", form.studentId);
            fd.append("department", form.department);
            if (profilePic) fd.append("avatar", profilePic);

            await api.post("/auth/register", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("OTP sent to your email. Please verify.");
            navigate("/verify-otp", { state: { email: form.email } });
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                    Register
                </h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <input
                        type="text"
                        name="username"
                        placeholder="Name"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <input
                        type="text"
                        name="studentId"
                        placeholder="Student ID"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                        name="department"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option className="bg-white dark:bg-gray-700">
                            CSE
                        </option>
                        <option className="bg-white dark:bg-gray-700">
                            EEE
                        </option>
                        <option className="bg-white dark:bg-gray-700">ME</option>
                        <option className="bg-white dark:bg-gray-700">CE</option>
                    </select>
                    <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                        <label
                            htmlFor="profile-pic-upload"
                            className="w-full py-2 px-4 cursor-pointer text-gray-500 dark:text-gray-400 block"
                        >
                            {profilePic
                                ? profilePic.name
                                : "Choose a profile picture"}
                        </label>
                        <input
                            id="profile-pic-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePic(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    {profilePic && (
                        <img
                            src={URL.createObjectURL(profilePic)}
                            alt="Preview"
                            className="mt-2 w-20 h-20 object-cover rounded-full border border-gray-300 dark:border-gray-600"
                        />
                    )}
                    <Button type="submit" className="w-full py-2 text-lg">
                        Register
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Register;