import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });

    if (error) {
      setError('Something went wrong. Please check your email and try again.');
    } else {
      setMessage('A secure password reset link has been sent to your email. Please check your inbox.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Reset Your Password</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mb-4 px-3 py-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>

          {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
