import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const getPasswordStrength = (password) => {
  if (password.length < 6) return 'Too short';
  if (password.length < 8) return 'Weak';
  if (/\d/.test(password) && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    return 'Strong';
  }
  return 'Medium';
};

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirm) {
      setError("The passwords you entered do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("An error occurred while resetting your password. Please try again.");
    } else {
      setMessage("Your password has been successfully updated. Redirecting to login...");
      setTimeout(() => navigate('/login'), 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white text-center">
          Create New Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
          Please enter and confirm your new password below.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          {/* Password field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              className="w-full px-4 py-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {password && (
              <p className={`mt-1 text-xs font-medium ${
                strength === 'Strong' ? 'text-green-600' :
                strength === 'Medium' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                Strength: {strength}
              </p>
            )}
          </div>

          {/* Confirm password field */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
          >
            Reset Password
          </button>

          {message && <p className="text-sm text-green-600 text-center mt-2">{message}</p>}
          {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
