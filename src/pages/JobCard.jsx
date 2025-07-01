import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white relative">
      <h2 className="text-lg font-semibold">{job.title}</h2>
      {job.company_name && (
        <p className="text-gray-600 text-sm mb-1">{job.company_name}</p>
      )}
      <p className="text-sm">{job.job_type} | {job.location}</p>
      <p className="font-semibold mt-2">${job.salary}</p>
      <Link
        to={`/job/${job.id}`}
        className="inline-block mt-3 text-blue-500 underline text-sm"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
