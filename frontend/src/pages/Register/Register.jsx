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

            await api.post("/users/register", fd, {
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
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="studentId"
                        placeholder="Student ID"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <select
                        name="department"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option>CSE</option>
                        <option>EEE</option>
                        <option>ME</option>
                        <option>CE</option>
                    </select>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePic(e.target.files[0])}
                        className="w-full"
                    />
                    {profilePic && (
                        <img
                            src={URL.createObjectURL(profilePic)}
                            alt="Preview"
                            className="mt-2 w-20 h-20 object-cover rounded-full border"
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
