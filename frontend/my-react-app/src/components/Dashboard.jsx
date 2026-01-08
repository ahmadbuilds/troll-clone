import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, isGuest, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-gray-700">
            Welcome,{" "}
            <span className="font-semibold">
              {isGuest ? "Guest" : user?.email}
            </span>
            !
          </p>
          {isGuest && (
            <p className="text-sm text-gray-500 mt-1">
              You are viewing this as a guest. Changes will not be saved to the
              database.
            </p>
          )}
          {!isGuest && user?.user_metadata?.role && (
            <p className="text-sm text-gray-500 mt-1">
              Role: {user.user_metadata.role}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Feature 1</h2>
            <p className="text-gray-600">
              This feature is accessible to everyone.
            </p>
          </div>
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Feature 2</h2>
            <p className="text-gray-600">
              This feature is accessible to everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
