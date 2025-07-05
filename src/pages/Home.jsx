import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import defaultLogo from "../assets/job.svg";
import ad1 from "../assets/internships.jpg";
import ad2 from "../assets/jobs.jpg";
import ad3 from "../assets/contact_img.png";
import ad4 from "../assets/courses.jpg";
import ad5 from "../assets/contact_img.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { UserAuth } from "../Context/AuthContext";

const advertImages = [ad1, ad2, ad3, ad4, ad5];

const industries = [/* same industry array */];
const countries = [/* same country array */];

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function JobCard({ job }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { session } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmark = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("job_id", job.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Bookmark fetch error:", error.message);
      }
      setBookmarked(!!data);
    };
    fetchBookmark();
  }, [session, job.id]);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!session?.user?.id) return;

    if (bookmarked) {
      await supabase
        .from("saved_jobs")
        .delete()
        .match({ user_id: session.user.id, job_id: job.id });
    } else {
      await supabase.from("saved_jobs").insert([
        {
          user_id: session.user.id,
          job_id: job.id,
        },
      ]);
    }
    setBookmarked(!bookmarked);
  };

  return (
    <div
      onClick={() => navigate(`/job/${job.id}`)}
      className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-200 relative"
    >
      <div
        onClick={handleBookmark}
        className="absolute top-3 right-3 text-yellow-500 hover:scale-110 transition"
      >
        {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <img
          src={job.company_logo || defaultLogo}
          alt={job.company_name}
          className="h-12 w-12 object-contain rounded"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {job.company_name}
          </p>
        </div>
      </div>

      {job.location && (
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <FaMapMarkerAlt className="text-xs" />
          {job.location}
        </p>
      )}

      {job.type && (
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
            job.type === "Full-time"
              ? "bg-green-100 text-green-800"
              : job.type === "Part-time"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {job.type}
        </span>
      )}

      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-green-600 font-medium">
          {job.salary ? `$${job.salary}` : "Not specified"}
        </span>
        {job.application_deadline && (
          <span className="text-gray-500 dark:text-gray-400">
            Apply by {formatDate(job.application_deadline)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { session } = UserAuth();
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    industry: "",
    type: "",
  });
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hr = new Date().getHours();
    setGreeting(
      hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening"
    );
  }, []);

  useEffect(() => {
    const fetchStudentAndJobs = async () => {
      if (!session?.user?.id) return;

      const { data: studentData, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) console.error("Student fetch error:", error.message);
      setStudent(studentData);

      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobsError) console.error("Jobs fetch error:", jobsError.message);

      if (jobsData) {
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      }
    };

    fetchStudentAndJobs();
  }, [session]);

  useEffect(() => {
    let result = jobs;

    if (search) {
      result = result.filter(
        (job) =>
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
      result = result.filter(
        (job) =>
          job.industry?.toLowerCase() === filters.industry.toLowerCase()
      );
    }

    if (filters.type) {
      result = result.filter(
        (job) => job.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    setFilteredJobs(result);
  }, [search, filters, jobs]);

  const internshipsOnly = filteredJobs.filter(
    (job) => job.category?.toLowerCase() === "internship"
  );
  const jobsOnly = filteredJobs.filter(
    (job) => job.category?.toLowerCase() === "job"
  );
  const allJobs = filteredJobs;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        👋 {greeting}, {student?.full_name || "Friend"}
      </h1>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

        <select
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location: e.target.value }))
          }
          className="border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Locations</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filters.industry}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, industry: e.target.value }))
          }
          className="border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Industries</option>
          {industries.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="border px-3 py-2 rounded text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Carousel */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        spaceBetween={10}
        slidesPerView={1}
        loop
        className="mb-10"
      >
        {advertImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Ad ${idx}`}
              className="w-full h-40 object-cover rounded"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Urgently Hiring */}
      <h2 className="text-xl font-bold mb-4">Urgently Hiring Now</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allJobs.length > 0 ? (
          allJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
            No jobs match your search or filters.
          </p>
        )}
      </div>

      {/* Internships Only */}
      <h2 className="text-xl font-bold mt-12 mb-4">For Interns Only</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internshipsOnly.length > 0 ? (
          internshipsOnly.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
            No internships match your search or filters.
          </p>
        )}
      </div>

      {/* Jobs Only */}
      <h2 className="text-xl font-bold mt-12 mb-4">Hot Jobs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobsOnly.length > 0 ? (
          jobsOnly.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
            No jobs match your search or filters.
          </p>
        )}
      </div>
    </div>
  );
}
