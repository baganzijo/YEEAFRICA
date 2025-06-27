import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);

  // 🔁 Reusable redirect logic
  const fetchUserProfileAndRedirect = async (userId, navigate) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role, profile_complete")
      .eq("id", userId)
      .single();

    if (!data || error) {
      console.warn("User profile not found — signing out...");
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setRole(null);
      setProfile(null);
      return;
    }

    if (!data.profile_complete) {
      return navigate("/choose-role");
    }

    const redirectMap = {
      student: "/student-profile",
      tutor: "/tutor-profile",
      employer: "/employer-dashboard",
    };

    return navigate(redirectMap[data.role] || "/choose-role");
  };

  const fetchFullProfile = async (userId) => {
    const { data: roleData, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (roleData?.role) {
      setRole(roleData.role);

      const { data: profileData } = await supabase
        .from(roleData.role + "s")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);
    }
  };

  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    return { success: !error, error: error?.message };
  };

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
    setProfile(null);
    return { success: !error, error };
  };

  useEffect(() => {
    // Load session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        setUser(data.session.user);
        fetchFullProfile(data.session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        fetchFullProfile(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
      }
    });

    return () => listener.subscription?.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        profile,
        signUpNewUser,
        signInUser,
        googleSignIn,
        signOutUser,
        fetchUserProfileAndRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
