import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import OneSignal from 'react-onesignal';
import { supabase } from './supabaseClient';

import Navbar from './sections/Navbar';
import Footer from './sections/Footer';
import SignIn from './sections/SignIn';
import SignUp from './sections/SignUp';
import Spinner from './sections/Spinner';

import Introduction from './sections/Introduction';
import ChooseRole from './pages/ChooseRole';
import Browse from './pages/Browse';
import Home from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import VerifyEmail from './pages/VerifyEmail';

import StudentForm from './pages/StudentForm';
import StudentProfile from './pages/StudentProfile';
import StudentDashboard from './pages/StudentDashboard';
import Internships from './pages/Internships';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';

import TutorForm from './pages/TutorForm';
import TutorProfile from './pages/TutorProfile';
import EmployerForm from './pages/EmployerForm';
import EmployerProfile from './pages/EmployerProfile';
import PostJob from './pages/PostJob';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployersLandingPage from './pages/EmployersLandingPage';
import EmployerJobView from './pages/EmployerJobView';
import ViewJob from './pages/ViewJob';
import ApplyNow from './pages/ApplyNow';
import ViewApplication from './pages/ViewApplication';
import NotificationsPage from './pages/NotificationsPage';
import StudentNotificationJobView from './pages/StudentNotificationJobView';

function App() {
  const [user, setUser] = useState(null);
  const [authType, setAuthType] = useState(null); // 'login', 'register', or null

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    // ✅ Initialize OneSignal inside an async IIFE
    (async () => {
      await OneSignal.init({
        appId: 'f7760689-6a81-45a8-8f52-cebd16b74421', // ✅ Replace with your real app ID
        notifyButton: { enable: true },
        serviceWorkerPath: '/OneSignalSDKWorker.js',
        allowLocalhostAsSecureOrigin: true,
      });

      // ✅ Set external user ID if logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        OneSignal.setExternalUserId(session.user.id);
      }
    })();

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription?.unsubscribe();
    };
  }, []);

  const closeAuthModal = () => setAuthType(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenAuthModal={setAuthType} />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/student-form" element={<StudentForm />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/notification/job/:id" element={<StudentNotificationJobView />} />
          <Route path="/tutor-form" element={<TutorForm />} />
          <Route path="/tutor-profile" element={<TutorProfile />} />
          <Route path="/employer-form" element={<EmployerForm />} />
          <Route path="/employer-profile" element={<EmployerProfile />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/edit-job/:jobId" element={<PostJob />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/employers" element={<EmployersLandingPage />} />
          <Route path="/employer/job/:id" element={<EmployerJobView />} />
          <Route path="/apply/:jobId" element={<ApplyNow />} />
          <Route path="/employer/view-job/:jobId/applicants" element={<ViewApplication />} />
          <Route path="/job/:id" element={<ViewJob />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>

      {/* ✅ Auth Modal (Login/Register popup) */}
      {authType === 'login' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <SignIn
            onClose={closeAuthModal}
            switchToRegister={() => setAuthType('register')}
          />
        </div>
      )}

      {authType === 'register' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <SignUp
            onClose={closeAuthModal}
            switchToLogin={() => setAuthType('login')}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
