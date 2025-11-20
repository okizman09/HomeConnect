import React from "react";
import { useAuth } from "../context/AuthContext";

const LandlordDashboard = () => {
  const { user, role, logout } = useAuth();

  if (role !== "landlord") {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You must be logged in as a landlord to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Landlord Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name || "Landlord"}!</p>

      {/* Sample content */}
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-2">Your Properties</h2>
        <p>You currently have no listed properties.</p>
      </div>

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default LandlordDashboard;
