// src/context/AuthContext/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../../lib/api";

export const AuthContext = createContext({
    user: null,
    setUser: () => {},
    isLoading: true,
    fetchAndSetUser: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAndSetUser = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log("Fetching user..."); // Debug log
            const token = localStorage.getItem("token");
            console.log("Token:", token); // Debug log

            if (token) {
                const response = await api.get("/auth/current-user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("User fetched:", response.data); // Debug log
                setUser(response.data.data);
            } else {
                console.log("No token found."); // Debug log
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error); // Debug log
            setUser(null);
            localStorage.removeItem("token");
        } finally {
            console.log("Fetching user complete. isLoading set to false."); // Debug log
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log("AuthProvider useEffect triggered."); // Debug log
        fetchAndSetUser();
    }, [fetchAndSetUser]);

    const value = {
        user,
        setUser,
        isLoading,
        fetchAndSetUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
