import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    studentId: "123456",
    department: "CSE",
    profilePic: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setUser({ ...user, profilePic: URL.createObjectURL(file) });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);
  const handleLogout = () => console.log("User logged out");

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Profile
        </h2>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center lg:w-1/3">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-md">
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
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="mt-4"
              />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 w-full space-y-4 lg:w-2/3">
            {[
              { label: "Name", name: "name" },
              { label: "Email", name: "email" },
              { label: "Student ID", name: "studentId" },
              { label: "Department", name: "department" },
            ].map((field) => (
              <div key={field.name}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {field.label}
                </h3>
                {isEditing ? (
                  field.name === "department" ? (
                    <select
                      name={field.name}
                      value={user[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                    >
                      <option>CSE</option>
                      <option>EEE</option>
                      <option>ME</option>
                      <option>CE</option>
                    </select>
                  ) : (
                    <input
                      name={field.name}
                      value={user[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                    />
                  )
                ) : (
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {user[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          {isEditing ? (
            <>
              <Button className="flex-1 py-2" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="destructive"
                className="!bg-red-500 !hover:bg-red-600 !text-white"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button className="flex-1 py-2" onClick={handleEditToggle}>
                Edit Profile
              </Button>
              <Button
                variant="destructive"
                className="flex-1 py-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
