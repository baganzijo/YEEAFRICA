// src/pages/ChooseRole.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Spinner from "../sections/Spinner";
import { toast } from "react-hot-toast";

// ✅ Updated paths to match your real form routes
const roles = [
  {
    name: " I'm a Student",
    path: "/student-form",
    emoji: "🎓",
    description: "This section is for scholars and non scholars who are looking for internships and jobs.",
    roleKey: "student",
  },
  {
    name: " I'm an Employer",
    path: "/employer-form",
    emoji: "💼",
    description: "This section is for employers only who need to find interns and talented employees for their businesses.",
    roleKey: "employer",
  },
];

const ChooseRole = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from("profiles")
        .select("role, profile_complete")
        .eq("id", session.user.id)
        .single();

      if (error) {
        setLoading(false);
        return;
      }

      if (data.profile_complete && data.role) {
        const redirectMap = {
          student: "/student-profile",
          employer: "/employer-dashboard",
        };
        navigate(redirectMap[data.role] || "/choose-role");
        return;
      }

      setLoading(false);
    };

    checkUserProfile();
  }, [navigate]);

  const handleChoose = async (path, isGuest, roleKey) => {
    if (isGuest || !user) {
      navigate(path);
      return;
    }

    setUpdating(true);
    const toastId = toast.loading("Updating your profile please wait...");

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, role: roleKey }, { onConflict: "id" });

    toast.dismiss(toastId);

    if (error) {
      toast.error("Failed to update profile.");
      console.error("Supabase error:", error.message);
      setUpdating(false);
      return;
    }

    toast.success("Profile updated successfully!");
    setUpdating(false);
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Spinner text="Checking your profile..." />
      </div>
    );
  }

  if (updating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Spinner text="Updating your profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-0 py-0">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-950 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-950 dark:text-white mb-6">
          Choose Your Profile to continue
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.name}
              onClick={() => handleChoose(role.path, role.isGuest, role.roleKey)}
              className={`cursor-pointer bg-white dark:bg-gray-950 hover:bg-gray-200 dark:hover:bg-gray-800 transition rounded-lg p-6 text-center border dark:border-gray-600 ${
                role.isGuest ? "border-dashed border-2" : ""
              }`}
            >
              <div className="text-4xl mb-2">{role.emoji}</div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {role.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
