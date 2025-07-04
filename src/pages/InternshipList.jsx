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
    job.qualifications?.some((q) =>
      q.toLowerCase() === filters.qualification.toLowerCase()
    )
  );
}


    setFilteredJobs(result);
  }, [search, filters, internships]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Internships</h1>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow mb-6 grid md:grid-cols-4 gap-4">
        {/* Search */}
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
          <option value="Algeria">Algeria</option>
  <option value="Angola">Angola</option>
  <option value="Benin">Benin</option>
  <option value="Botswana">Botswana</option>
  <option value="Burkina Faso">Burkina Faso</option>
  <option value="Burundi">Burundi</option>
  <option value="Cabo Verde">Cabo Verde (Cape Verde)</option>
  <option value="Cameroon">Cameroon</option>
  <option value="Central African Republic">Central African Republic</option>
  <option value="Chad">Chad</option>
  <option value="Comoros">Comoros</option>
  <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
  <option value="Republic of the Congo">Republic of the Congo</option>
  <option value="Côte d'Ivoire">Côte d'Ivoire (Ivory Coast)</option>
  <option value="Djibouti">Djibouti</option>
  <option value="Egypt">Egypt</option>
  <option value="Equatorial Guinea">Equatorial Guinea</option>
  <option value="Eritrea">Eritrea</option>
  <option value="Eswatini">Eswatini (Swaziland)</option>
  <option value="Ethiopia">Ethiopia</option>
  <option value="Gabon">Gabon</option>
  <option value="Gambia">The Gambia</option>
  <option value="Ghana">Ghana</option>
  <option value="Guinea">Guinea</option>
  <option value="Guinea-Bissau">Guinea-Bissau</option>
  <option value="Kenya">Kenya</option>
  <option value="Lesotho">Lesotho</option>
  <option value="Liberia">Liberia</option>
  <option value="Libya">Libya</option>
  <option value="Madagascar">Madagascar</option>
  <option value="Malawi">Malawi</option>
  <option value="Mali">Mali</option>
  <option value="Mauritania">Mauritania</option>
  <option value="Mauritius">Mauritius</option>
  <option value="Morocco">Morocco</option>
  <option value="Mozambique">Mozambique</option>
  <option value="Namibia">Namibia</option>
  <option value="Niger">Niger</option>
  <option value="Nigeria">Nigeria</option>
  <option value="Rwanda">Rwanda</option>
  <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
  <option value="Senegal">Senegal</option>
  <option value="Seychelles">Seychelles</option>
  <option value="Sierra Leone">Sierra Leone</option>
  <option value="Somalia">Somalia</option>
  <option value="South Africa">South Africa</option>
  <option value="South Sudan">South Sudan</option>
  <option value="Sudan">Sudan</option>
  <option value="Tanzania">Tanzania</option>
  <option value="Togo">Togo</option>
  <option value="Tunisia">Tunisia</option>
  <option value="Uganda">Uganda</option>
  <option value="Zambia">Zambia</option>
  <option value="Zimbabwe">Zimbabwe</option>
        </select>

        {/* Industry Filter */}
        <select
          value={filters.industry}
          onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
          className="border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Industries</option>
         <option value="Agriculture">Agriculture</option>
  <option value="Automotive">Automotive</option>
  <option value="Banking & Finance">Banking & Finance</option>
  <option value="Biotechnology">Biotechnology</option>
  <option value="Construction">Construction</option>
  <option value="Consulting">Consulting</option>
  <option value="Consumer Goods">Consumer Goods</option>
  <option value="Creative Arts & Design">Creative Arts & Design</option>
  <option value="Customer Service">Customer Service</option>
  <option value="Education">Education</option>
  <option value="Energy">Energy (Oil, Gas, Renewable)</option>
  <option value="Engineering">Engineering</option>
  <option value="Entertainment & Media">Entertainment & Media</option>
  <option value="Environmental Services">Environmental Services</option>
  <option value="Fashion">Fashion</option>
  <option value="Food & Beverage">Food & Beverage</option>
  <option value="Government">Government & Public Administration</option>
  <option value="Healthcare">Healthcare</option>
  <option value="Hospitality">Hospitality & Tourism</option>
  <option value="Human Resources">Human Resources</option>
  <option value="Information Technology">Information Technology (IT)</option>
  <option value="Insurance">Insurance</option>
  <option value="Legal">Legal Services</option>
  <option value="Logistics">Logistics & Supply Chain</option>
  <option value="Manufacturing">Manufacturing</option>
  <option value="Marketing">Marketing & Advertising</option>
  <option value="Mining & Metals">Mining & Metals</option>
  <option value="Nonprofit">Nonprofit & NGO</option>
  <option value="Pharmaceuticals">Pharmaceuticals</option>
  <option value="Real Estate">Real Estate</option>
  <option value="Retail">Retail</option>
  <option value="Sales">Sales</option>
  <option value="Science & Research">Science & Research</option>
  <option value="Security">Security & Law Enforcement</option>
  <option value="Sports & Recreation">Sports & Recreation</option>
  <option value="Telecommunications">Telecommunications</option>
  <option value="Transportation">Transportation</option>
  <option value="Utilities">Utilities</option>
  <option value="Writing & Editing">Writing & Editing</option>
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
        </select>

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

      {/* Internship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-gray-600 dark:text-gray-400 col-span-full">No internships found.</p>
        )}
      </div>
    </div>
  );
};

export default InternshipList;
