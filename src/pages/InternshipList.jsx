import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import JobCard from '../pages/JobCard';
import { FaSearch } from 'react-icons/fa';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    industry: '',
    type: '',
    qualification: '',
  });

  useEffect(() => {
    const fetchInternships = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('category', 'Internship')
        .order('created_at', { ascending: false });

      if (!error) {
        setInternships(data);
        setFilteredJobs(data);
      }
    };

    fetchInternships();
  }, []);

  useEffect(() => {
    let result = internships;

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
        job.qualifications?.some(
          (q) => q.toLowerCase() === filters.qualification.toLowerCase()
        )
      );
    }

    setFilteredJobs(result);
  }, [search, filters, internships]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8  bg-white dark:bg-gray-950 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">🎓 Available Internships</h1>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative col-span-1 sm:col-span-2">
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
          className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Locations</option>
          {[
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
            "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
            "Democratic Republic of the Congo", "Republic of the Congo", "Côte d'Ivoire",
            "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia",
            "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho",
            "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
            "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe",
            "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan",
            "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
          ].map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        {/* Industry Filter */}
        <select
          value={filters.industry}
          onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
          className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Industries</option>
          {[
            "Aerospace", "Agriculture", "Architecture & Design", "Automotive", "Aviation", "Banking", "Biotechnology", "Chemical", "Clean Energy", "Cloud Computing", "Construction", "Consulting", "Consumer Goods", "Cybersecurity", "Data Science", "Defense", "E-commerce", "Education", "Electronics", "Energy", "Environmental Services", "Event Planning", "Fashion", "Film & Television", "Finance", "Fishing & Aquaculture", "Food & Beverage", "Forestry", "Gaming", "Government", "Green Technology", "Healthcare", "Hospitality", "Human Resources", "Import & Export", "Industrial Automation", "Information Technology", "Insurance", "Interior Design", "International Trade", "Investment Banking", "Journalism", "Legal", "Logistics", "Luxury Goods", "Manufacturing", "Marine & Fisheries", "Marketing", "Media & Entertainment", "Medical Devices", "Mining & Metals", "Mobile Applications", "Nanotechnology", "Non-Profit", "Nuclear Energy", "Oil & Gas", "Online Services", "Pharmaceuticals", "Public Relations", "Publishing", "Real Estate", "Renewable Energy", "Research & Development", "Retail", "Robotics", "Safety & Compliance", "Sales", "Security", "Shipping & Maritime", "Social Services", "Software Development", "Sports & Recreation", "Supply Chain", "Telecommunications", "Textile", "Tourism & Travel", "Transportation", "Utilities", "Video Production", "Waste Management", "Water Management", "Web Development", "Wholesale"
          ].map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
        </select>

        {/* Qualification Filter */}
        <select
          value={filters.qualification}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, qualification: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
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

      {/* Internship Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-400">
            More internship offers coming soon. Please stay tuned.
          </p>
        )}
      </div>
    </div>
  );
};

export default InternshipList;
