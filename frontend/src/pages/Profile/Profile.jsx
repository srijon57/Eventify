import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import api from "../../lib/api";

const ProfilePage = () => {
    const { user: authUser, setUser } = useContext(AuthContext);
    const [user, setUserState] = useState({
        username: "",
        email: "",
        profilePic: null,
        profilePicFile: null,
    });
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/current-user", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`,
                    },
                });
                const userData = response.data.data;
                setUserState({
                    username: userData.username || "",
                    email: userData.email || "", // Set email from response
                    profilePic:
                        userData.avatar || userData.profileImage || null,
                    profilePicFile: null,
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        if (authUser) fetchUser();
    }, [authUser]);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserState({
                ...user,
                profilePic: URL.createObjectURL(file),
                profilePicFile: file,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserState({ ...user, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    const handleSave = async () => {
        setError(null);
        setSuccess(null);
        try {
            if (user.username !== authUser.username) {
                await api.patch(
                    "/auth/update-account",
                    { username: user.username },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                            )}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
            if (user.profilePicFile) {
                const formData = new FormData();
                formData.append("avatar", user.profilePicFile);
                await api.patch("/auth/update-avatar", formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`,
                    },
                });
            }
            if (passwords.oldPassword && passwords.newPassword) {
                await api.post(
                    "/auth/change-password",
                    {
                        oldPassword: passwords.oldPassword,
                        newPassword: passwords.newPassword,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                            )}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setSuccess("Password updated successfully!");
            }
            const response = await api.get("/auth/current-user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                    )}`,
                },
            });
            setUser(response.data.data);
            setUserState((prev) => ({
                ...prev,
                username: response.data.data.username || "",
                email: response.data.data.email || "", // Update email after save
                profilePic:
                    response.data.data.avatar ||
                    response.data.data.profileImage ||
                    null,
                profilePicFile: null,
            }));
            setSuccess("Profile updated successfully!");
            setIsEditing(false);
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(
                error.response?.data?.message ||
                    "Update failed. Please try again."
            );
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-3xl">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                    Profile
                </h2>
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
                        {success}
                    </div>
                )}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                    <div className="flex flex-col items-center lg:w-1/3">
                        <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-md border-2 border-gray-300 dark:border-gray-600">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full text-gray-500 dark:text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <div className="relative mt-4 w-full">
                                <label
                                    htmlFor="profile-pic-upload"
                                    className="block w-full text-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 cursor-pointer"
                                >
                                    {user.profilePicFile
                                        ? user.profilePicFile.name
                                        : "Choose a Profile Picture"}
                                </label>
                                <input
                                    id="profile-pic-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                    className="sr-only"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 w-full space-y-4 lg:w-2/3">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                Username
                            </h3>
                            {isEditing ? (
                                <input
                                    name="username"
                                    value={user.username}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white mt-1"
                                />
                            ) : (
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                    {user.username}
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                Email
                            </h3>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                {user.email}
                            </p>
                        </div>
                        {isEditing && (
                            <>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                        Old Password
                                    </h3>
                                    <input
                                        name="oldPassword"
                                        type="password"
                                        value={passwords.oldPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white mt-1"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                        New Password
                                    </h3>
                                    <input
                                        name="newPassword"
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white mt-1"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    {isEditing ? (
                        <>
                            <Button
                                className="flex-1 py-2"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                variant="destructive"
                                className="!bg-red-500 !hover:bg-red-600 !text-white"
                                onClick={() => {
                                    setIsEditing(false);
                                    setPasswords({
                                        oldPassword: "",
                                        newPassword: "",
                                    });
                                    setUserState((prev) => ({
                                        ...prev,
                                        profilePicFile: null,
                                    }));
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="w-1/3 py-2"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
