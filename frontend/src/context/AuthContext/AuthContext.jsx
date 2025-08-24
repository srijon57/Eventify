import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../../lib/api"; // Assuming your API utility is here

// Create the context with a more complete initial value
export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isLoading: true,
  fetchAndSetUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the function to prevent unnecessary re-creations
  const fetchAndSetUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        // Fetch the latest user data from your API endpoint
        const response = await api.get("/auth/current-user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // Update the user state with the fetched data
        setUser(response.data.data);
      } else {
        // No token means no authenticated user
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Clear the user state if fetching fails (e.g., expired token)
      setUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      setIsLoading(false);
    }
  }, []); // The dependency array is empty because this function doesn't depend on any props or state

  // Call the fetch function on component mount
  useEffect(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]); // The `useCallback` hook ensures `fetchAndSetUser` is stable, so this effect runs only once

  // The value object provided to the context consumers
  const value = {
    user,
    setUser,
    isLoading,
    fetchAndSetUser, // Expose the fetch function so other components can trigger a refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
