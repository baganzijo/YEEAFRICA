import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import defaultLogo from "../assets/job.svg";
import { Link } from 'react-router-dom';

export default function ViewJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching job:", error);
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!job) return <p className="text-center mt-10 text-red-500">Job not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 mt-10 rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={job.company_logo || defaultLogo}
          alt="Company Logo"
          className="w-16 h-16 object-contain rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{job.title}</h2>
          <p className="text-gray-500">{job.company_name}</p>
        </div>
      </div>

      {/* Job Info */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <p><strong>Type:</strong> {job.type}</p>
        <p><strong>Industry:</strong> {job.industry}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Deadline:</strong> {job.application_deadline}</p>
        <p><strong>Salary:</strong> ${job.salary}</p>
        <p><strong>Qualification:</strong> {job.qualifications?.[0]}</p>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Job Description</h3>
        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{job.description}</p>
      </div>

      {/* Requirements */}
      {job.requirements && (
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Requirements</h3>
          <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{job.requirements}</p>
        </div>
      )}

      {/* Responsibilities */}
      {job.responsibilities && (
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Responsibilities</h3>
          <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{job.responsibilities}</p>
        </div>
      )}

      {/* Apply Button */}
      <div className="mt-6 text-center">
        <Link 
        to={`/apply/${job.id}`} className="btn-primarypx-6 py-2 px-4 bg-blue-600 text-white  hover:bg-blue-700">
          Apply Now
        </Link>
      </div>
    </div>
  );
}
