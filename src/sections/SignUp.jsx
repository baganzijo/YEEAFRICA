import React, { useState } from 'react';
import { UserAuth } from '../Context/AuthContext';
import { FaGoogle } from 'react-icons/fa';

export default function SignUp({ onClose, switchToLogin }) {
  const { signUpNewUser, googleSignIn, fetchUserProfileAndRedirect } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signUpNewUser(email, password);
    if (result.success) {
      fetchUserProfileAndRedirect(result.data.user.id);
      onClose?.();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const result = await googleSignIn();
    if (!result.success) setError(result.error);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black py-2 rounded"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full flex items-center justify-center gap-2 border py-2 rounded"
      >
        <FaGoogle /> Sign up with Google
      </button>
      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <button onClick={switchToLogin} className="text-blue-600 underline">Login</button>
      </p>
    </div>
  );
}
