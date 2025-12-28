import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks';
import { validateEmail } from '../utils';

const LoginPage = ({ onNavigate }) => {
  const { login, loading, error: authError } = useAuth();
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    handleChange,
    handleSubmit: formHandleSubmit,
    loading: formLoading,
  } = useForm(
    { email: '', password: '' },
    async (formValues) => {
      setLocalError('');

      if (!validateEmail(formValues.email)) {
        setLocalError('Invalid email address');
        return;
      }

      if (!formValues.password) {
        setLocalError('Password is required');
        return;
      }

      try {
        await login(formValues.email, formValues.password);
        onNavigate('listings');
      } catch (err) {
        setLocalError(err.message || 'Login failed');
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
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Welcome Back</h2>

        {displayError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter password"
                value={values.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <button
            type="button"
            onClick={() => onNavigate('forgot-password')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Forgot Password?
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || formLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading || formLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
