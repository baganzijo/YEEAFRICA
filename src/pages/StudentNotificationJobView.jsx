import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const StudentNotificationJobView = () => {
  const { id } = useParams(); // this is the notification ID
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchJobFromNotification = async () => {
      // Step 1: Get job_id from notification
      const { data: notification, error: notifError } = await supabase
        .from('notifications')
        .select('job_id')
        .eq('id', id)
        .single();

      if (notifError || !notification?.job_id) {
        setErrorMsg('Notification or job ID not found.');
        setLoading(false);
        return;
      }

      // Step 2: Fetch job details using job_id
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', notification.job_id)
        .single();

      if (jobError || !jobData) {
        setErrorMsg('Job details could not be fetched.');
      } else {
        setJob(jobData);
      }

      setLoading(false);
    };

    fetchJobFromNotification();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading job info...</div>;
  if (errorMsg) return <div className="p-6 text-red-600">{errorMsg}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white dark:bg-gray-950 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{job.title}</h1>

      <div className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
        <p><strong>Company:</strong> {job.company_name}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Type:</strong> {job.type}</p>
        <p><strong>Industry:</strong> {job.industry}</p>
        <p><strong>Salary:</strong> ${job.salary}</p>
        <p><strong>Deadline:</strong> {new Date(job.application_deadline).toLocaleDateString()}</p>
      </div>

      <div className="text-gray-700 dark:text-gray-200 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Job Description</h2>
          <p>{job.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Requirements</h2>
          <p>{job.requirements}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Responsibilities</h2>
          <p>{job.responsibilities}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Qualifications</h2>
          <ul className="list-disc pl-6">
            {job.qualifications?.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentNotificationJobView;
