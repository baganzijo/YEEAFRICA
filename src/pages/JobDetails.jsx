import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [application, setApplication] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [loadingApp, setLoadingApp] = useState(true);
  const [errorJob, setErrorJob] = useState(null);
  const [errorApp, setErrorApp] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoadingJob(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) setErrorJob(error.message);
      else setJob(data);

      setLoadingJob(false);
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoadingApp(true);
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
       // setErrorApp('User not logged in');
        setLoadingApp(false);
        return;
      }

      setUser(currentUser);

      const { data, error } = await supabase
        .from('applications')
        .select('id, job_id, user_id, data, status')
        .eq('job_id', jobId)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) setErrorApp(error.message);
      else setApplication(data?.[0] || null);

      setLoadingApp(false);
    };

    fetchApplication();
  }, [jobId]);

  const handleWithdraw = async () => {
    if (!application) return;
    const confirm = window.confirm('Are you sure you want to withdraw your application?');
    if (!confirm) return;

    setWithdrawing(true);
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', application.id);

    if (error) {
      alert('Error withdrawing application: ' + error.message);
    } else {
      alert('Application withdrawn successfully.');
      setApplication(null);
    }

    setWithdrawing(false);
  };

  const handleChat = () => {
    alert('Chat feature coming soon!');
  };

  const getStatusClasses = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === 'accepted') return 'bg-green-100 text-green-800';
    if (normalized === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getDisplayStatus = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === 'pending') return 'Under Review';
    return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
  };

  if (loadingJob) return <p className="text-center py-6">Loading job details...</p>;
  if (errorJob) return <p className="text-red-600 text-center">{errorJob}</p>;
  if (!job) return <p className="text-center">Job not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      {job.company_name && <p className="text-lg mb-2">{job.company_name}</p>}
      <p className="mb-1"><strong>Type:</strong> {job.type}</p>
      <p className="mb-1"><strong>Industry:</strong> {job.industry}</p>
      <p className="mb-1"><strong>Location:</strong> {job.location}</p>
      <p className="mb-1"><strong>Application Deadline:</strong> {new Date(job.application_deadline).toLocaleDateString()}</p>
      <p className="mb-4">  <strong>Salary:</strong>{' '}  {job.salary === '' || job.salary == null ? 'Not specified' : `$${job.salary}`}</p>
      <h2 className="text-xl font-semibold mb-2">Job Description</h2>
      <p className="mb-4 whitespace-pre-line">{job.description}</p>

      <h2 className="text-xl font-semibold mb-2">Requirements</h2>
      <p className="mb-4 whitespace-pre-line">{job.requirements}</p>

      <h2 className="text-xl font-semibold mb-2">Qualifications</h2>
      <ul className="list-disc list-inside mb-4">
        {(job.qualifications || []).map((qual, i) => (
          <li key={i}>{qual}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
      <p className="mb-4 whitespace-pre-line">{job.responsibilities}</p>

      {/* 🔲 Application Section */}
      <div className="mt-8 p-4 rounded bg-gray-50 border dark:bg-gray-800">
        {loadingApp && <p>Loading your application status...</p>}

        {errorApp && <p className="text-red-500">Error: {errorApp}</p>}

        {!loadingApp && !application && (
          <div>
            {/* <p className="text-gray-700">You have not applied to this job yet.</p> */}
            <Link
              to={`/apply/${job.id}`}
              className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Apply Now
            </Link>
          </div>
        )}

        {!loadingApp && application && (
          <>
            <p>
              <strong>Your application status:</strong>{' '}
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(application.status)}`}
              >
                {getDisplayStatus(application.status)}
              </span>
            </p>

            <div className="mt-4 flex gap-4 flex-wrap">
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-full hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
              </button>

              <button
                onClick={handleChat}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-500 hover:text-white"
              >
                Chat with Employer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
