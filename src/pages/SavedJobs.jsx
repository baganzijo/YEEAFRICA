import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../Context/AuthContext';
import JobCard from './JobCard';

const SavedJobs = () => {
  const { session } = UserAuth();
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job:job_id(*)')
        .eq('user_id', session.user.id);

      if (!error) {
        setSavedJobs(data.map((entry) => entry.job));
      }
    };

    fetchSavedJobs();
  }, [session]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
            You haven't saved any jobs yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
