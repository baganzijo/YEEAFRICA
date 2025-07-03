import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaRegBookmark, FaMapMarkerAlt } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../Context/AuthContext';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { session } = UserAuth();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      if (session?.user?.id) {
        const { data } = await supabase
          .from('saved_jobs')
          .select('user_id, job_id')
          .eq('user_id', session.user.id)
          .eq('job_id', job.id)
          .single();

        setBookmarked(!!data);
      }
    };
    checkIfBookmarked();
  }, [session, job.id]);

  const handleClick = () => {
    navigate(`/job/${job.id}`);
  };

  const toggleBookmark = async (e) => {
    e.stopPropagation();

    if (!session?.user?.id) return;

    if (bookmarked) {
      await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', session.user.id)
        .eq('job_id', job.id);
      setBookmarked(false);
    } else {
      await supabase
        .from('saved_jobs')
        .insert({ user_id: session.user.id, job_id: job.id });
      setBookmarked(true);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-200 relative"
    >
      {/* Bookmark Icon */}
      <div
        onClick={toggleBookmark}
        className="absolute top-3 right-3 text-yellow-500 hover:scale-110 transition"
      >
        {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </div>

      {/* Logo & Title */}
      <div className="flex items-center gap-3 mb-3">
        {job.company_logo && (
          <img
            src={job.company_logo}
            alt={job.company_name}
            className="h-12 w-12 object-contain rounded"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{job.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{job.company_name}</p>
        </div>
      </div>

      {/* Location */}
      {job.location && (
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <FaMapMarkerAlt className="text-xs" />
          {job.location}
        </p>
      )}

      {/* Type badge */}
      {job.type && (
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
            job.type === 'Full-time'
              ? 'bg-green-100 text-green-800'
              : job.type === 'Part-time'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {job.type}
        </span>
      )}

      {/* Salary & Deadline */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-green-600 font-medium">
          {job.salary ? `$${job.salary}` : 'Not specified'}
        </span>
        {job.application_deadline && (
          <span className="text-gray-500 dark:text-gray-400">
            Apply by {formatDate(job.application_deadline)}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
