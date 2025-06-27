import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import defaultLogo from "../assets/job.svg";
import heartIcon from "../assets/star_icon.png";
import ad1 from "../assets/internships.jpg"; // replace with your custom adverts
import ad2 from "../assets/jobs.jpg"
import ad3 from "../assets/contact_img.png"
import ad4 from "../assets/courses.jpg"
import ad5 from "../assets/contact_img.png"

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const categories = [
  "Tech Jobs", "Design Jobs", "Work From Home", "Media Jobs",
  "Construction", "Hospitality", "Data Science", "Part Time",
  "Full Time", "Health Care", "Education", "Engineering",
  "Marketing", "Agriculture", "Human Resource"
];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [greeting, setGreeting] = useState("");
  const userName = "Friend"; // replace when user info available
  

  useEffect(() => {
    const hr = new Date().getHours();
    setGreeting(hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setJobs(data);
        setFilteredJobs(data);
      }
    };
    fetchJobs();
  }, []);

  const advertImages = [ad1, ad2, ad3, ad4, ad5];

  const handleSearchChange = (e) => {
    const v = e.target.value.toLowerCase();
    setQuery(v);
    setShowFilters(!!v);

    setFilteredJobs(jobs.filter((j) =>
      j.title?.toLowerCase().includes(v) ||
      j.company_name?.toLowerCase().includes(v) ||
      j.type?.toLowerCase().includes(v) ||
      j.location?.toLowerCase().includes(v)
    ));
  };

  const handleCategoryClick = (cat) => {
    const v = cat.toLowerCase();
    setFilteredJobs(jobs.filter((j) =>
      j.industry?.toLowerCase().includes(v) ||
      j.type?.toLowerCase().includes(v) ||
      j.title?.toLowerCase().includes(v)
    ));
  };

  return (
    <div className="p-6 max-w- mx-auto bg-white dark:bg-gray-950 text-black dark:text-white space-y-10">
      <div className="text-2xl mt-12 font-semibold text-gray-950 dark:text-white">
        👋 {greeting}, {userName}
      </div>

      <div className="relative w-full max-w-3xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search for jobs, companies, or locations"
          className="w-full p-3 rounded-full bg-white outline-none dark:bg-gray-700 shadow-md border  border-gray-300"
        />
      </div>

      <Swiper
  modules={[Autoplay]}
  autoplay={{ delay: 3000 }}
  spaceBetween={10}
  slidesPerView={1}
  loop
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


      <section>
        <h2 className="text-xl font-bold mb-4">Recommended Jobs for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {filteredJobs.slice(0,6).map(job => <JobCard key={job.id} job={job} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">New & Updated</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0,6).map(job => <JobCard key={job.id} job={job} />)}
        </div>
      </section>
      
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4 text-white dark:text-black">Sponsored Ads</h3>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={3000}
        grabCursor={true}
        className="w-full"
      >
        {advertImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Ad ${idx}`}
              className="w-full h-40 object-cover rounded-md shadow"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Explore by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="px-4 py-2 rounded-full  bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4 text-white dark:text-black">Sponsored Ads</h3>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={3000}
        grabCursor={true}
        className="w-full"
      >
        {advertImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Ad ${idx}`}
              className="w-full h-40 object-cover rounded-md shadow"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="p-[2px] rounded-lg w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 max-w-md mx-auto">
      <div className=" rounded-lg shadow-md p-4 h-full w-full mim-h-[320px] flex flex-col justify-between bg-white dark:bg-gray-950">
      <div className="flex justify-between items-center mb-2">
        <img src={job.company_logo || defaultLogo} alt="Logo"
             className="w-12 h-12 object-contain rounded-full bg-slate-100" />
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
          {job.type || "Job Type"}
        </span>
      </div>
      <h2 className="text-md font-bold text-gray-900 dark:text-white mb-1">{job.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {job.company_name || "Company"} <span className="mx-1">•</span> {job.location || "Location"}
      </p>
      <div className="flex justify-between items-center mt-4">
        <Link to={`/job/${job.id}`} className="text-blue-600 hover:underline text-sm font-semibold">
          View Details
        </Link>
        <img src={heartIcon} alt="Favorite" className="w-5 h-5" />
      </div>
      {job.salary && (
        <p className="text-center mt-4 text-sm font-semibold text-green-600">
          ${job.salary} USD
        </p>
      )}
    </div>
    </div>
    
  );
}
