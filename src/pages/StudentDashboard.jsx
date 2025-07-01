// StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../Context/AuthContext';
import JobCard from '../pages/JobCard';
import filterIcon from '../assets/filter.svg';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { session } = UserAuth();
  const [student, setStudent] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  const [appliedFilters, setAppliedFilters] = useState({ jobType: '', industry: '', location: '' });
  const [recommendedFilters, setRecommendedFilters] = useState({ jobType: '', industry: '', location: '' });
  const [appliedSortAsc, setAppliedSortAsc] = useState(true);
  const [recommendedSortAsc, setRecommendedSortAsc] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchStudent = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (!error) setStudent(data);
    };
    fetchStudent();
  }, [session]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from('applications')
        .select('*, jobs(*)')
        .eq('user_id', session.user.id);

      if (!error && Array.isArray(data)) {
        const seen = new Set();
        const jobsWithStatus = data
          .filter(app => app.jobs && !seen.has(app.jobs.id) && seen.add(app.jobs.id))
          .map(app => ({
            ...app.jobs,
            applicationStatus: app.status?.toLowerCase() === 'pending' ? 'Under Review' : app.status
          }));
        setAppliedJobs(jobsWithStatus);
      }
    };
    fetchAppliedJobs();
  }, [session]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) setAllJobs(data);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (student && allJobs.length > 0) {
      const recommended = allJobs.filter((job) => {
        const matchIndustry = job.industry === student.industry;
        const matchLocation = job.location?.toLowerCase().includes(student.country?.toLowerCase() || '');
        const matchQualification =
          typeof job.qualifications === 'string' &&
          job.qualifications.toLowerCase().includes(student.course?.toLowerCase() || '');
        const matchSkills =
          Array.isArray(student.skills) &&
          student.skills.some(skill => job.description?.toLowerCase().includes(skill.toLowerCase()));
        return matchIndustry || matchLocation || matchQualification || matchSkills;
      });
      setRecommendedJobs(recommended);
    }
  }, [student, allJobs]);

  const handleFilterChange = (e, target) => {
    const { name, value } = e.target;
    if (target === 'applied') {
      setAppliedFilters(prev => ({ ...prev, [name]: value }));
    } else {
      setRecommendedFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const filterAndSort = (jobs, filters, sortAsc) => {
    return jobs
      .filter(job =>
        (filters.jobType ? job.job_type?.toLowerCase().includes(filters.jobType.toLowerCase()) : true) &&
        (filters.industry ? job.industry?.toLowerCase().includes(filters.industry.toLowerCase()) : true) &&
        (filters.location ? job.location?.toLowerCase().includes(filters.location.toLowerCase()) : true)
      )
      .sort((a, b) =>
        sortAsc
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
  };

  const filteredAppliedJobs = filterAndSort(appliedJobs, appliedFilters, appliedSortAsc);
  const filteredRecommendedJobs = filterAndSort(recommendedJobs, recommendedFilters, recommendedSortAsc);

  const renderStatusBadge = (status) => {
    const normalized = status?.toLowerCase();
    let color = 'bg-gray-200 text-gray-700';
    if (normalized === 'accepted') color = 'bg-green-100 text-green-800';
    else if (normalized === 'rejected') color = 'bg-red-100 text-red-800';
    else if (normalized === 'under review') color = 'bg-yellow-100 text-yellow-800';

    return (
      <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="px-4 py-6 max-w-7xl mt-12 mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">
        {getGreeting()}{student?.full_name ? `, ${student.full_name}` : ''}
      </h1>

      {/* Applied Jobs Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Applied Internships & Jobs</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {appliedJobs.length} Applied
          </span>
        </div>

        {/* Applied Filters */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <input type="text" name="jobType" value={appliedFilters.jobType} onChange={(e) => handleFilterChange(e, 'applied')} placeholder="Job Type" className="border px-2 py-1 rounded text-sm" />
            <input type="text" name="industry" value={appliedFilters.industry} onChange={(e) => handleFilterChange(e, 'applied')} placeholder="Industry" className="border px-2 py-1 rounded text-sm" />
            <input type="text" name="location" value={appliedFilters.location} onChange={(e) => handleFilterChange(e, 'applied')} placeholder="Location" className="border px-2 py-1 rounded text-sm" />
          </div>
          <img src={filterIcon} alt="Sort" title={`Sort ${appliedSortAsc ? 'A–Z' : 'Z–A'}`} onClick={() => setAppliedSortAsc(!appliedSortAsc)} className="w-6 h-6 cursor-pointer" />
        </div>

        {filteredAppliedJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppliedJobs.map((job) => (
              <div key={`${job.id}-${job.created_at}`} className="relative">
                <JobCard job={job} />
                {renderStatusBadge(job.applicationStatus)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven’t applied to any positions yet.</p>
        )}
      </section>

      {/* Recommended Jobs Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Recommended for You</h2>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            {recommendedJobs.length} Recommended
          </span>
        </div>

        {/* Recommended Filters */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <input type="text" name="jobType" value={recommendedFilters.jobType} onChange={(e) => handleFilterChange(e, 'recommended')} placeholder="Job Type" className="border px-2 py-1 rounded text-sm" />
            <input type="text" name="industry" value={recommendedFilters.industry} onChange={(e) => handleFilterChange(e, 'recommended')} placeholder="Industry" className="border px-2 py-1 rounded text-sm" />
            <input type="text" name="location" value={recommendedFilters.location} onChange={(e) => handleFilterChange(e, 'recommended')} placeholder="Location" className="border px-2 py-1 rounded text-sm" />
          </div>
          <img src={filterIcon} alt="Sort" title={`Sort ${recommendedSortAsc ? 'A–Z' : 'Z–A'}`} onClick={() => setRecommendedSortAsc(!recommendedSortAsc)} className="w-6 h-6 cursor-pointer" />
        </div>

        {filteredRecommendedJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecommendedJobs.map((job) => (
              <div key={`${job.id}-${job.created_at}`} className="relative">
                <JobCard job={job} />
                <div className="absolute bottom-2 left-2">
                  <Link to={`/apply/${job.id}`} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-500 hover:text-white">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-2">No specific recommendations found. Showing all jobs:</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allJobs.map((job) => (
                <JobCard key={`${job.id}-${job.created_at}`} job={job} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
