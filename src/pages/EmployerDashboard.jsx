import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FiEdit, FiTrash2, FiArchive } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultJobImage from '../assets/job.svg';

export default function EmployerDashboard() {
  const [userId, setUserId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();
  const menuRefs = useRef({});
   const [greeting, setGreeting] = useState("");

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside = Object.keys(menuRefs.current).every((id) => {
        const ref = menuRefs.current[id];
        return ref && !ref.contains(event.target);
      });
      if (clickedOutside) setMenuOpenId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  //Greetings
  useEffect(() => {
      const hr = new Date().getHours();
      setGreeting(hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening");
    }, []);
  

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/signin');
      setUserId(user.id);
    };
    getUser();
  }, [navigate]);

  // Fetch employer info and jobs
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) return;

      const { data: employerData } = await supabase
        .from('employers')
        .select('company_name')
        .eq('id', userId)
        .single();

      if (employerData?.company_name) setCompanyName(employerData.company_name);

      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', userId)
        .order('created_at', { ascending: false });

      setJobs(jobData || []);
    };

    fetchDashboardData();
  }, [userId]);

  const toggleMenu = (id) => {
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (jobId) => {
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) {
      toast.error('Failed to delete job');
    } else {
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      toast.success('Job deleted');
    }
    setMenuOpenId(null);
  };

  const handleArchive = async (jobId) => {
    const { error } = await supabase
      .from('jobs')
      .update({ archived: true })
      .eq('id', jobId);

    if (error) {
      toast.error('Failed to archive job');
    } else {
      toast.success('Job archived');
    }
    setMenuOpenId(null);
  };

  return (
    <div className="min-h-screen  bg-gray-100 dark:bg-gray-950 mt-12 mmb-12">
      <main className="max-w-7xl mx-auto p-4 mt-12 md:p-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
        {greeting}, {companyName || 'Friend'}
        </h1>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
            Your Posted Jobs
          </h2>
          <Link
            to="/post-job"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Post a Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            You haven't posted any jobs yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-visible"
              >
                <img
                  src={job.image_url || defaultJobImage}
                  alt={job.title}
                  className="w-full h-40 object-contain"
                />

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {job.location} • {new Date(job.created_at).toLocaleDateString()}
                  </p>

                  <div className="mt-3 flex justify-between text-sm items-center">
                    <div className="flex gap-4">
                      <Link
                        to={`/employer/job/${job.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Job
                      </Link>
                      <Link
                       to={`/employer/view-job/${job.id}/applicants`} 
                        className="text-green-600 hover:underline"
                      >
                        View Applicants
                      </Link>
                    </div>

                    {/* Three-dot menu */}
                    <div
                      className="relative"
                      ref={(el) => (menuRefs.current[job.id] = el)}
                    >
                      <button
                        onClick={() => toggleMenu(job.id)}
                        className="text-gray-600 dark:text-white"
                      >
                        <HiOutlineDotsVertical />
                      </button>

                      {menuOpenId === job.id && (
                        <div className="absolute top-8 right-0 w-44 bg-white dark:bg-gray-700 shadow-lg rounded z-50">
                          <Link
                            to={`/edit-job/${job.id}`}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-white"
                          >
                            <FiEdit /> Edit
                          </Link>
                          <button
                            onClick={() => handleArchive(job.id)}
                            className="flex w-full items-center gap-2 px-4 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-600 text-sm text-yellow-700 dark:text-yellow-200"
                          >
                            <FiArchive /> Archive
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-600 text-sm text-red-600 dark:text-red-300"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnFocusLoss
          theme="colored"
        />
      </main>
    </div>
  );
}
