import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import ChatsPage from './pages/ChatsPage';
import CreateListingPage from './pages/CreateListingPage';
import LandlordDashboard from './pages/LandlordDashboard';
import TenantDashboard from './pages/TenantDashboard';
import MaintenancePage from './pages/MaintenancePage';
import ProfileSettings from './pages/ProfileSettings';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Home } from 'lucide-react';
import AIChatAssistant from './components/AIChatAssistant';
import logo from './assets/logo.png';


const AppContent = () => {
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('currentPage') || 'landing');
  const [selectedListing, setSelectedListing] = useState(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  // Check URL on mount for reset password link
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oobCode')) {
      setCurrentPage('reset-password');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <img src={logo} alt="Loading..." className="h-24 w-auto animate-pulse mx-auto mb-4 object-contain" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    // If user selected a listing, show detail page
    if (selectedListing && user) {
      return (
        <ListingDetailPage
          listing={selectedListing}
          onBack={() => setSelectedListing(null)}
        />
      );
    }

    // If not authenticated, show auth pages
    if (!user) {
      switch (currentPage) {
        case 'register':
          return <RegisterPage onNavigate={setCurrentPage} />;

        case 'login':
          return <LoginPage onNavigate={setCurrentPage} />;
        case 'forgot-password':
          return <ForgotPassword onNavigate={setCurrentPage} />;
        case 'reset-password':
          return <ResetPassword onNavigate={setCurrentPage} />;
        case 'landing':

        default:
          return <LandingPage onNavigate={setCurrentPage} />;
      }
    }

    // If authenticated, show app pages
    switch (currentPage) {
      case 'create':
        return <CreateListingPage onNavigate={setCurrentPage} />;
      case 'chats':
        return <ChatsPage />;
      case 'dashboard':
        if (user.role === 'landlord') {
          return <LandlordDashboard onNavigate={setCurrentPage} />;
        } else if (user.role === 'tenant') {
          return <TenantDashboard onNavigate={setCurrentPage} />;
        }
        return <ListingsPage onSelectListing={setSelectedListing} />;
      case 'listings':
        return <ListingsPage onSelectListing={setSelectedListing} />;
      case 'maintenance':
        return <MaintenancePage onNavigate={setCurrentPage} />;
      case 'profile-settings': // Added route for ProfileSettings
        return <ProfileSettings onNavigate={setCurrentPage} />;
      default:
        // Default page based on role
        if (user.role === 'landlord') {
          return <LandlordDashboard onNavigate={setCurrentPage} />;
        }
        return <ListingsPage onSelectListing={setSelectedListing} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />}
      {renderPage()}
      {user && <AIChatAssistant />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;