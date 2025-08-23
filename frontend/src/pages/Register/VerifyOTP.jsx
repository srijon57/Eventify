import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "../../lib/api";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const { state } = useLocation();
    const navigate = useNavigate();
    const email = state?.email;

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/verify-otp", { email, otp });
            alert("Account verified successfully!");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "OTP verification failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                    Verify OTP
                </h2>
                <form onSubmit={handleVerify} className="space-y-5">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                    <Button type="submit" className="w-full py-2 text-lg">
                        Verify
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
