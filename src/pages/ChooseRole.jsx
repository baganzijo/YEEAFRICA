// src/pages/ChooseRole.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Spinner from "../sections/Spinner";
import { toast } from "react-hot-toast";

// ✅ Updated paths to match your real form routes
const roles = [
  {
    name: "Student",
    path: "/student-form",
    emoji: "🎓",
    description: "Learn new skills and find opportunities.",
    roleKey: "student",
  },
  {
    name: "Tutor",
    path: "/tutor-form",
    emoji: "🧑‍🏫",
    description: "Teach, mentor, and earn through knowledge.",
    roleKey: "tutor",
  },
  {
    name: "Employer",
    path: "/employer-form",
    emoji: "💼",
    description: "Post jobs, find talent, and grow your business.",
    roleKey: "employer",
  },
  {
    name: "Continue as Guest",
    path: "/browse",
    emoji: "👀",
    description: "Explore and buy without an account.",
    isGuest: true,
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
          tutor: "/tutor-profile",
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
    const toastId = toast.loading("Updating your role...");

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, role: roleKey }, { onConflict: "id" });

    toast.dismiss(toastId);

    if (error) {
      toast.error("Failed to update role.");
      console.error("Supabase error:", error.message);
      setUpdating(false);
      return;
    }

    toast.success("Role updated successfully!");
    setUpdating(false);
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Spinner text="Checking your profile..." />
      </div>
    );
  }

  if (updating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Spinner text="Updating your role..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Choose Your Role
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.name}
              onClick={() => handleChoose(role.path, role.isGuest, role.roleKey)}
              className={`cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 transition rounded-lg p-6 text-center border dark:border-gray-600 ${
                role.isGuest ? "border-dashed border-2" : ""
              }`}
            >
              <div className="text-4xl mb-2">{role.emoji}</div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {role.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {role.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
          Guests can browse and buy opportunities but need an account to apply or post.
        </p>
      </div>
    </div>
  );
};

export default ChooseRole;
