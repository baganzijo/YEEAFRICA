// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { UserAuth } from '../Context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ authType, onClose, switchAuth }) => {
  if (!authType) return null;

  const { signUpNewUser, signInUser, googleSignIn } = UserAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const handler = authType === 'register' ? signUpNewUser : signInUser;
    const result  = await handler(email, password);

    if (result.success) {
      toast.success(`${authType === 'register' ? 'Registered' : 'Signed in'} successfully`);
      onClose();
      navigate(authType === 'register' ? '/choose-role' : '/home');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >✕</button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          {authType === 'register' ? 'Register' : 'Login'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email} onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={password} onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading
              ? 'Please wait...'
              : authType === 'register'
                ? 'Register'
                : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {authType === 'register' ? (
            <>
              Already have an account?{' '}
              <button onClick={() => switchAuth('login')} className="text-blue-600 underline">
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <button onClick={() => switchAuth('register')} className="text-blue-600 underline">
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
