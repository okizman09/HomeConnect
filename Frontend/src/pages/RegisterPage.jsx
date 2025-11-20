import React, { useState } from 'react';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks';
import { USER_ROLES } from '../constants';
import { validateEmail, validatePassword, validatePhone } from '../utils';

const RegisterPage = ({ onNavigate }) => {
  const { register, loading, error: authError } = useAuth();
  const [localError, setLocalError] = useState('');

  const {
    values,
    errors,
    handleChange,
    handleSubmit: formHandleSubmit,
    loading: formLoading,
  } = useForm(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      location: '',
      role: USER_ROLES.TENANT,
    },
    async (formValues) => {
      setLocalError('');

      // Validation
      if (!formValues.name.trim()) {
        setLocalError('Name is required');
        return;
      }

      if (!validateEmail(formValues.email)) {
        setLocalError('Invalid email address');
        return;
      }

      if (!validatePassword(formValues.password)) {
        setLocalError('Password must be at least 8 characters');
        return;
      }

      if (formValues.password !== formValues.confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }

      if (!validatePhone(formValues.phone)) {
        setLocalError('Invalid phone number');
        return;
      }

      if (!formValues.location.trim()) {
        setLocalError('Location is required');
        return;
      }

      try {
        await register({
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          phone: formValues.phone,
          location: formValues.location,
          role: formValues.role,
        });

        onNavigate('listings');
      } catch (err) {
        setLocalError(err.message || 'Registration failed');
      }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    formHandleSubmit(e);
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Create Account</h2>

        {displayError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="John Doe"
                value={values.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Min 8 characters"
                value={values.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Confirm password"
                value={values.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="10+ digits"
              value={values.phone}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="location"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="City or area"
                value={values.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={USER_ROLES.TENANT}
                  checked={values.role === USER_ROLES.TENANT}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600"
                />
                <span>Tenant</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={USER_ROLES.LANDLORD}
                  checked={values.role === USER_ROLES.LANDLORD}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600"
                />
                <span>Landlord</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || formLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading || formLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
