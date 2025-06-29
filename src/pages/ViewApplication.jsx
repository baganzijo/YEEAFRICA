import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import defaultAvatar from "../assets/profile_icon.png";
import Papa from 'papaparse';
import { FaSearch } from 'react-icons/fa';

export default function ViewApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * applicationsPerPage,
    currentPage * applicationsPerPage
  );

  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId) return;

      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data);
        setFilteredApplications(data);
      }

      setLoading(false);
    };

    fetchApplications();
  }, [jobId]);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = applications.filter((app) => {
      const user = app.data || {};
      return (
        user.full_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.city?.toLowerCase().includes(searchLower) ||
        user.country?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredApplications(filtered);
    setCurrentPage(1); // Reset to page 1 on search
  }, [search, applications]);

  const handleStatusUpdate = async (applicationId, status) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    if (error) {
      console.error("Failed to update status:", error);
    } else {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    }
  };

  const handleDownloadCSV = () => {
      const dataToExport = filteredApps.map((app) => {
        const d = app.data || {};
        return {
          FullName: d.full_name || "",
          Email: d.email || "",
          Phone: d.phone || "",
          City: d.city || "",
          Country: d.country || "",
          School: d.school_name || "",
          Course: d.course_or_subjects || "",
          Skills: d.skills || "",
          Status: statusMap[app.id] || "Pending",
          AppliedOn: new Date(app.created_at).toLocaleString(),
        };
      });
  
      const csv = Papa.unparse(dataToExport);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "applications.csv");
    };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className=" mx-auto p-6 bg-white mt-10 w-full dark:bg-gray-950 shadow-lg rounded">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Job Applications
      </h1>

    <div className="w-full p-4 shadow-md flex justify-center items-center mb-10  bg-white dark:bg-gray-950">
      <FaSearch className="text-gray-600 dark:text-gray-300" />
      <input
        type="text"
        placeholder="Search by name, email, city, country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=" text-gray-800 dark:text-white py-1 outline-none flex-auto items-center  bg-gray-100 dark:bg-gray-700 px-4 rounded-full w-full"
        
      />
    </div>

      <div className="flex justify-end mb-5 gap-3"><button
          onClick={handleDownloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download CSV
        </button></div>

      {paginatedApplications.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No applications found.</p>
      ) : (
        <div className="space-y-6">
          {paginatedApplications.map((app) => {
            const user = app.data || {};
            const appliedDate = new Date(app.created_at);

            return (
              <div
                key={app.id}
                className="bg-gray-50 dark:bg-gray-900 p-4 rounded shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profile_picture || defaultAvatar}
                      alt="Applicant"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {user.full_name || "—"}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {user.email || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    Applied on <br />
                    {appliedDate.toLocaleDateString()} at{" "}
                    {appliedDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-300 grid md:grid-cols-2 gap-4 mb-4">
                  <p><strong>Phone:</strong> {user.phone || "—"}</p>
                  <p><strong>City:</strong> {user.city || "—"}</p>
                  <p><strong>Country:</strong> {user.country || "—"}</p>
                  <p><strong>School:</strong> {user.school_name || "—"}</p>
                  <p><strong>Course:</strong> {user.course_or_subjects || "—"}</p>
                  <p><strong>Certifications:</strong> {user.certifications || "—"}</p>
                  <p><strong>Skills:</strong> {user.skills || "—"}</p>
                  <p><strong>Reference:</strong> {user.reference_name || "—"} ({user.reference_contact || "—"})</p>
                  <p><strong>Status:</strong> <span className="capitalize">{app.status || "pending"}</span></p>
                </div>

                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  {user.professional_work && (
                    <a
                      href={user.professional_work}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Work
                    </a>
                  )}
                  {app.cv_url && (
                    <a
                      href={app.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Download CV
                    </a>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleStatusUpdate(app.id, "accepted")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(app.id, "append")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Append
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(app.id, "rejected")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
