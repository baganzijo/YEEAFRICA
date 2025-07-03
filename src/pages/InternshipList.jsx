import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import JobCard from '../pages/JobCard'; // use your existing card
import { FaSearch } from 'react-icons/fa';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchInternships = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('type', 'Internship');

      if (!error) setInternships(data);
    };

    fetchInternships();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Internships</h1>
      {/* <SearchFilterBar /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {internships.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default InternshipList;
