import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import JobCard from '../pages/JobCard';
import { FaSearch } from 'react-icons/fa';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    industry: '',
    type: '',
    qualification: '',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('category', 'Job') // ✅ KEY FIX: now using `category`
        .order('created_at', { ascending: false });

      if (!error) {
        setJobs(data);
        setFilteredJobs(data);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let result = [...jobs];

    if (search) {
      result = result.filter((job) =>
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter((job) =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.industry) {
      result = result.filter((job) =>
        job.industry?.toLowerCase() === filters.industry.toLowerCase()
      );
    }

    if (filters.type) {
      result = result.filter((job) =>
        job.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters.qualification) {
  result = result.filter((job) =>
    Array.isArray(job.qualifications) &&
    job.qualifications.some(
      (q) =>
        typeof q === 'string' &&
        q.toLowerCase() === filters.qualification.toLowerCase()
    )
  );
}


    setFilteredJobs(result);
  }, [search, filters, jobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Job Opportunities</h1>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow mb-6 grid md:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="relative col-span-2">
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded text-sm dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Location Filter */}
        <select
          value={filters.location}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
          className="border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Locations</option>
          {/* Keep your country list here */}
          <option value="Uganda">Uganda</option>
          <option value="Kenya">Kenya</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Ghana">Ghana</option>
          {/* ... other countries */}
        </select>

        {/* Industry Filter */}
        <select
          value={filters.industry}
          onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
          className="border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Industries</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Engineering">Engineering</option>
          {/* ...other industries */}
        </select>

        {/* Job Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          className="border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>

        {/* Qualification Filter */}
        <select
          value={filters.qualification}
          onChange={(e) => setFilters((prev) => ({ ...prev, qualification: e.target.value }))}
          className="border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Qualifications</option>
          <option value="Primary">Primary</option>
          <option value="O-Level">O-Level</option>
          <option value="A-Level">A-Level</option>
          <option value="Certificate">Certificate</option>
          <option value="Diploma">Diploma</option>
          <option value="Bachelor">Bachelor's Degree</option>
          <option value="Masters">Master's Degree</option>
          <option value="PhD">PhD / Doctorate</option>
          <option value="Professional">Professional Qualification</option>
        </select>
      </div>

      {/* Job Listings */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
            No jobs match your search or filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
