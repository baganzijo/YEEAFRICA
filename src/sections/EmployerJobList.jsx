// src/components/EmployerJobList.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const EmployerJobList = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="p-4 bg-white dark:bg-gray-800 shadow rounded-md border"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.location}</p>
            <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">
              {job.description}
            </p>
            <div className="mt-4 flex gap-2">
              <button className="text-sm bg-blue-600 text-white px-4 py-1 rounded">Edit</button>
              <button className="text-sm bg-red-600 text-white px-4 py-1 rounded">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EmployerJobList;
