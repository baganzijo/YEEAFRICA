import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Browse = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isGuest = !location.state?.user;
  const tryingToPost = location.state?.tryingToPost;

  // Auto-redirect if guest tries to post
  useEffect(() => {
    if (isGuest && tryingToPost) {
      navigate('/signin', { state: { from: '/post' } }); // optional: pass redirect info
    }
  }, [isGuest, tryingToPost, navigate]);

  // Manual attempt to post (e.g., via button)
  const handleTryToPost = () => {
    if (isGuest) {
      navigate('/signin', { state: { from: '/post' } });
    } else {
      navigate('/post');
    }
  };

  return (
    <div className="p-4">
      {isGuest && (
        <div className="bg-yellow-100 p-4 text-yellow-800 mb-4 rounded">
          You're browsing as a guest. You can view and buy, but need an account to post or apply.
        </div>
      )}

      <button
        onClick={handleTryToPost}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
      >
        Post an Opportunity
      </button>

      {/* Render job listings or items here */}
      <div className="text-gray-700">Browse job listings here...</div>
    </div>
  );
};

export default Browse;
