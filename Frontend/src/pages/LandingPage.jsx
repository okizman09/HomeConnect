import React from "react";
import { Home, Search, MessageSquare } from "lucide-react";

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Home className="w-20 h-20 text-indigo-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Welcome to HomeConnect
          </h1>
          <p className="text-2xl text-gray-600 mb-12">
            Connect landlords and tenants seamlessly
          </p>

          <div className="flex justify-center space-x-6 mb-16">
            <button
              onClick={() => onNavigate("register")}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 shadow-lg border-2 border-indigo-600"
            >
              Sign In
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Search className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Find Your Home</h3>
              <p className="text-gray-600">Browse through quality listings in your area</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <MessageSquare className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Direct Messaging</h3>
              <p className="text-gray-600">Chat directly with landlords in real-time</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Home className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">List Properties</h3>
              <p className="text-gray-600">Landlords can easily list and manage properties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
