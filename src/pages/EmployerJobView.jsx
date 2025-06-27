// src/pages/ViewJob.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import defaultJobImage from '../assets/job.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewJo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error.message);
        return toast.error('Failed to load job.');
      }

      setJob(data);
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this job?');
    if (!confirm) return;

    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) return toast.error('Failed to delete job.');
    toast.success('Job deleted.');
    setTimeout(() => navigate('/employer-dashboard'), 1500);
  };

  const handleArchive = async () => {
    const { error } = await supabase
      .from('jobs')
      .update({ is_archived: true })
      .eq('id', id);
    if (error) return toast.error('Failed to archive job.');
    toast.success('Job archived.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        Loading job...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-600">
        Job not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      {/* Job Image */}
      <div className="flex justify-center mb-6">
        <img
          src={job.image_url || defaultJobImage}
          alt={job.title}
          className="w-full max-w-md h-64 object-contain rounded shadow"
        />
      </div>

      {/* Job Details */}
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {job.location} • {new Date(job.created_at).toLocaleDateString()}
      </p>

      <p className="mb-4 whitespace-pre-wrap">{job.description}</p>

      {job.requirements && (
        <>
          <h2 className="text-lg font-semibold mt-6 mb-2">Requirements</h2>
          <p className="whitespace-pre-wrap">{job.requirements}</p>
        </>
      )}

      {job.salary && (
        <>
          <h2 className="text-lg font-semibold mt-6 mb-2">Salary</h2>
          <p>{job.salary}</p>
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to={`/job-applicants/${job.id}`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Applicants
        </Link>
        <Link
          to={`/edit-job/${job.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Job
        </Link>
        <button
          onClick={handleArchive}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Archive
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      <ToastContainer position="bottom-center" />
    </div>
  );
}
