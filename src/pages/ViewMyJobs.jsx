// src/pages/ViewMyJobs.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/job_placeholder.png'; // fallback image

const ViewMyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserAndJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/signin');
      setUserId(user.id);

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error.message);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    };

    getUserAndJobs();
  }, [navigate]);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  if (jobs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        You haven’t posted any jobs yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Job Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map(job => (
          <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <img
              src={job.logo_url || defaultImage}
              alt={job.title}
              className="w-full h-40 object-contain"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{job.location} — {job.type}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{job.description}</p>
              <div className="mt-4 flex justify-between text-sm text-blue-600">
                <button
                  className="hover:underline"
                  onClick={() => navigate(`/edit-job/${job.id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this job?')) {
                      await supabase.from('jobs').delete().eq('id', job.id);
                      setJobs(jobs.filter(j => j.id !== job.id));
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMyJobs;
