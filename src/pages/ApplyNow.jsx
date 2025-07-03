import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthModal from "../sections/AuthModal"; // Make sure path is correct
import { UserAuth } from "../Context/AuthContext";

export default function ApplyNow() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { session } = UserAuth();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [job, setJob] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role) {
        setRole(profile.role);
        const { data: detailedProfile } = await supabase
          .from(`${profile.role}s`)
          .select("*")
          .eq("id", user.id)
          .single();

        setProfileData(detailedProfile || {});
      }
    };

    const loadJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("title, employer_id")
        .eq("id", jobId)
        .single();

      if (!error) setJob(data);
    };

    loadUser();
    loadJob();
  }, [jobId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      localStorage.setItem("redirectAfterLogin", `/apply-now/${jobId}`);
      setShowAuthModal(true); // 👈 open auth modal if not logged in
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    setShowConfirm(false);

    try {
      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        job_id: jobId,
        data: profileData,
        role,
        cv_url: profileData.cv_url || null,
      });

      if (error) throw error;

      const notifications = [];

      if (user?.id && job?.title) {
        notifications.push({
          user_id: user.id,
          message: `You have successfully applied for the job: ${job.title}`,
          is_read: false,
          job_id: jobId,
          link: `/job/${jobId}`,
        });
      }

      if (job?.employer_id && job?.title) {
        notifications.push({
          user_id: job.employer_id,
          message: `New application received for: ${job.title}`,
          is_read: false,
          job_id: jobId,
          link: `/employer/view-job/${jobId}/applicants`,
        });
      }

      if (notifications.length > 0) {
        const { error: notificationError } = await supabase
          .from("notifications")
          .insert(notifications);

        if (notificationError) {
          console.error("Notification insert error:", notificationError.message);
        }
      }

      toast.success("Application submitted successfully!", {
        autoClose: 3000,
        onClose: () => navigate("/home"),
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-between items-center mx-auto p-6 bg-white dark:bg-gray-950 mt-12 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Preview your details before submitting your application
      </h2>

      <div className="space-y-4 text-gray-600 dark:text-gray-400 w-full max-w-2xl">
        <ProfileField label="Profile Picture">
          <img
            src={profileData.profile_picture || "/default-avatar.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        </ProfileField>

        <ProfileField label="Full Name" value={profileData.full_name} />
        <ProfileField label="Email" value={profileData.email} />
        <ProfileField label="Phone Number" value={profileData.phone} />
        <ProfileField label="Date of Birth" value={profileData.date_of_birth} />
        <ProfileField label="School Level" value={profileData.school_level} />
        <ProfileField label="School Name" value={profileData.school_name} />
        <ProfileField label="Course / Subjects" value={profileData.course_or_subjects} />
        <ProfileField label="City" value={profileData.city} />
        <ProfileField label="Country" value={profileData.country} />
        <ProfileField label="Certifications" value={profileData.certifications} />
        <ProfileField label="Skills" value={profileData.skills} />
        <ProfileField label="Professional Work">
          {profileData.professional_work ? (
            <a
              href={profileData.professional_work}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Portfolio
            </a>
          ) : (
            "—"
          )}
        </ProfileField>
        <ProfileField label="Reference">
          {profileData.reference_name || "—"} ({profileData.reference_contact || "—"})
        </ProfileField>

        <ProfileField label="CV">
          {profileData.cv_url ? (
            <a
              href={profileData.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View CV
            </a>
          ) : (
            "No CV uploaded"
          )}
        </ProfileField>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded transition ${
            !user
              ? "bg-gray-600 text-white hover:bg-gray-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Submitting..."
            : user
            ? "Submit Application"
            : "Login to Apply"}
        </button>
      </form>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Submission
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to submit your application? You won’t be able to edit it after submission.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          authType="login"
          onClose={() => setShowAuthModal(false)}
          switchAuth={() => {}}
        />
      )}
    </div>
  );
}

function ProfileField({ label, value, children }) {
  return (
    <div className="flex items-center gap-3">
      <label className="w-40 font-medium text-gray-700 dark:text-gray-50">{label}:</label>
      {children ?? (
        <span className="text-gray-600 dark:text-gray-400">
          {value || "Not provided"}
        </span>
      )}
    </div>
  );
}
