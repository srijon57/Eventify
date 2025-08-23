import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "../../lib/api";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.data.accessToken);

            const userRes = await api.get("/auth/current-user");
            setUser(userRes.data.data);

            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                    Login
                </h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full py-2 text-lg">
                        Login
                    </Button>
                </form>
                <div className="mt-4">
                    <Button
                        variant="destructive"
                        className="w-full flex items-center justify-center gap-2 py-2 text-lg hover:brightness-110 transition"
                    >
                        Sign in with Google
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login;