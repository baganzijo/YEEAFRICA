import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-hot-toast";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error("No session found after login.");
        return navigate("/login");
      }

      const user = session.user;

      // Try to get the user's profile
      const { data, error } = await supabase
        .from("profiles")
        .select("role, profile_complete")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        // Profile does not exist — create a blank one and send to choose-role
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, profile_complete: false }]);

        if (insertError) {
          toast.error("Failed to create profile.");
          return navigate("/login");
        }

        toast.success("Welcome! Please choose your role.");
        return navigate("/choose-role");
      }

      // Redirect based on role and profile completion
      if (!data.profile_complete) {
        return navigate("/choose-role");
      } else {
        return navigate(`/${data.role}-profile`);
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-500">Logging in...</p>
    </div>
  );
}
