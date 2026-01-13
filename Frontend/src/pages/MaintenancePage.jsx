import React, { useState, useEffect } from 'react';
import { Bot, AlertTriangle, CheckCircle, ArrowLeft, Home } from 'lucide-react';
import { maintenanceAPI, listingsAPI } from '../services/api';

const MaintenancePage = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        listingId: '',
        description: '',
        images: [] // Image upload implementation simplified for MVP
    });

    const [listings, setListings] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch listings on mount
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await listingsAPI.getAll();
                if (response.success) {
                    setListings(response.listings || []);
                    // Auto-select first listing if available and not set
                    if (response.listings?.length > 0 && !formData.listingId) {
                        setFormData(prev => ({ ...prev, listingId: response.listings[0]._id }));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch listings", err);
            }
        };
        fetchListings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.listingId) {
            setError('Please select a property.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await maintenanceAPI.create(formData);
            if (response.success) {
                setResult(response.data);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <h1 className="text-2xl font-bold flex items-center">
                            <Bot className="w-8 h-8 mr-3" />
                            AI Maintenance Assistant
                        </h1>
                        <p className="mt-2 text-indigo-100">
                            Describe your issue, and our AI will classify it and provide immediate safety advice.
                        </p>
                    </div>

                    <div className="p-6 md:p-8">
                        {!result ? (
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Property Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Property
                                    </label>
                                    <div className="relative">
                                        <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <select
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                                            value={formData.listingId}
                                            onChange={(e) => setFormData({ ...formData, listingId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select a property...</option>
                                            {listings.map(l => (
                                                <option key={l._id} value={l._id}>
                                                    {l.title} - {l.location}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {listings.length === 0 && (
                                        <p className="text-xs text-yellow-600 mt-1">
                                            No listings found. Please ensure there are listings in the system.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Describe the Issue
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g., The pipe under my kitchen sink is leaking water rapidly..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Be specific about what is happening and where.
                                    </p>
                                </div>

                                {/* Image upload placeholder */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 text-sm">
                                    Image upload coming soon
                                </div>

                                {error && (
                                    <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm flex items-center">
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !formData.listingId}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-70 flex items-center justify-center disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Analyzing...' : 'Submit Request'}
                                </button>
                            </form>
                        ) : (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center text-green-600 mb-6">
                                    <CheckCircle className="w-8 h-8 mr-3" />
                                    <span className="text-xl font-bold">Request Submitted</span>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                                    <h3 className="font-bold text-gray-900 border-b pb-2">AI Analysis</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500 block">Category</span>
                                            <span className="font-medium text-indigo-600">{result.category}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500 block">Urgency</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.urgency === 'High' ? 'bg-red-100 text-red-800' :
                                                    result.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {result.urgency}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <span className="text-sm text-blue-700 font-bold block mb-1">Recommended Action</span>
                                        <p className="text-blue-900">{result.aiRecommendation}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setResult(null)}
                                    className="w-full mt-6 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
