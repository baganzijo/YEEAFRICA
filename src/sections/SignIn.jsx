import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Context/AuthContext';
import { FaGoogle } from 'react-icons/fa';

export default function SignIn({ onClose, switchToRegister }) {
  const navigate = useNavigate();
  const { signInUser, googleSignIn, fetchUserProfileAndRedirect } = UserAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signInUser(email, password);

    if (result.success) {
      const userId = result.data.user.id;
      await fetchUserProfileAndRedirect(result.data.user.id, navigate);
      onClose?.();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const result = await googleSignIn();
    if (!result.success) setError(result.error);
    // redirection handled in /auth-callback
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">Sign In</h2>

      {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <FaGoogle className="text-red-500" /> Sign in with Google
      </button>

      <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
        Don't have an account?{' '}
        <button
          onClick={switchToRegister}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Register
        </button>
      </p>
    </div>
  );
}
