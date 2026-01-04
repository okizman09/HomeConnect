import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { User, MapPin, Phone, Mail, FileText, ChevronRight, Save } from 'lucide-react';

export default function ProfileSettings({ onNavigate }) {
    const { user, updateProfile: updateAuthUser } = useAuth();
    // const navigate = useNavigate(); // Remove this line
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                location: user.location || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const response = await usersAPI.updateProfile(formData);
            if (response.success) {
                setSuccess('Profile updated successfully');
                updateAuthUser(response.user); // Update context
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => {
                        // Assuming 'dashboard' is the safe default back navigation
                        // Or we can check user role if needed, but dashboard is safe
                        onNavigate('dashboard');
                    }}
                    className="mb-6 flex items-center text-gray-600 hover:text-indigo-600 transition"
                >
                    <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                    Back
                </button>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-600 px-6 py-8 text-white">
                        <h1 className="text-2xl font-bold flex items-center">
                            <User className="w-6 h-6 mr-3" />
                            Profile Settings
                        </h1>
                        <p className="mt-2 text-indigo-100 opacity-90">
                            Manage your personal information
                        </p>
                    </div>

                    <div className="p-6 md:p-8">
                        {success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email (Immutable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address (Cannot be changed)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="pl-10 block w-full bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500 cursor-not-allowed py-2.5"
                                    />
                                </div>
                            </div>

                            {/* Role (Immutable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={user?.role || ''}
                                        disabled
                                        className="pl-10 block w-full bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500 cursor-not-allowed capitalize py-2.5"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6"></div>

                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 transition ease-in-out duration-150 border hover:border-indigo-300"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 transition ease-in-out duration-150 border hover:border-indigo-300"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location / City
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 transition ease-in-out duration-150 border hover:border-indigo-300"
                                        placeholder="New York, NY"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
