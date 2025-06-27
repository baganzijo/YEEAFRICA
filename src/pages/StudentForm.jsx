import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const africanCountries = ["Uganda", "Kenya", "Nigeria", "Ghana", "Tanzania", "Rwanda", "South Africa"];
const levels = ["Primary", "Secondary", "College", "Tertiary", "University", "International Student"];

export default function StudentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const existingData = location.state?.student || null;

  const [fullName, setFullName] = useState(existingData?.full_name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(existingData?.phone || '');
  const [dob, setDob] = useState(existingData?.date_of_birth || '');
  const [schoolLevel, setSchoolLevel] = useState(existingData?.school_level || '');
  const [schoolName, setSchoolName] = useState(existingData?.school_name || '');
  const [subjects, setSubjects] = useState(existingData?.course_or_subjects || '');
  const [city, setCity] = useState(existingData?.city || '');
  const [country, setCountry] = useState(existingData?.country || '');

  const [certifications, setCertifications] = useState(existingData?.certifications || '');
  const [skills, setSkills] = useState(existingData?.skills || '');
  const [professionalWork, setProfessionalWork] = useState(existingData?.professional_work || '');
  const [referenceName, setReferenceName] = useState(existingData?.reference_name || '');
  const [referenceContact, setReferenceContact] = useState(existingData?.reference_contact || '');

  const [profilePicPreview, setProfilePicPreview] = useState(existingData?.profile_picture || null);
  const [cvFile, setCvFile] = useState(existingData?.cv_url ? { name: 'CV', url: existingData.cv_url } : null);

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
        setUserId(user.id);
      }
    }
    fetchUser();
  }, []);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`students/${Date.now()}-${file.name}`, file, { upsert: true });

    if (error) {
      alert('Failed to upload profile picture: ' + error.message);
      return;
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path);
    setProfilePicPreview(urlData.publicUrl);
  };

  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from('cvs')
      .upload(`students/${Date.now()}-${file.name}`, file, { upsert: true });

    if (error) {
      alert('Failed to upload CV: ' + error.message);
      return;
    }

    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(data.path);
    setCvFile({ name: file.name, url: urlData.publicUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const studentData = {
        id: userId,
        full_name: fullName,
        email,
        phone,
        date_of_birth: dob,
        profile_picture: profilePicPreview || null,
        cv_url: cvFile?.url || null,
        school_level: schoolLevel,
        school_name: schoolName,
        course_or_subjects: subjects,
        certifications,
        skills,
        professional_work: professionalWork,
        reference_name: referenceName,
        reference_contact: referenceContact,
        city,
        country,
      };

      if (existingData) {
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('students').insert([studentData]);
        if (error) throw error;
      }

      await supabase
        .from('profiles')
        .update({ profile_complete: true })
        .eq('id', userId);

      navigate('/student-profile');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        {existingData ? 'Edit Your Profile' : 'Student Registration'}
      </h2>

      <div className="flex flex-col items-center space-y-4">
        <img
          src={profilePicPreview || 'https://via.placeholder.com/150?text=No+Image'}
          alt="Profile"
          className="w-40 h-40 rounded-full object-contain border-2 border-blue-500 shadow"
        />
        {cvFile?.url && (
          <a href={cvFile.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline">
            📄 {cvFile.name}
          </a>
        )}
      </div>

      <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" required />
      <input type="email" value={email} readOnly className="w-full px-4 py-2 rounded border bg-gray-100 dark:bg-gray-800 dark:text-white cursor-not-allowed" />
      <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" required />
      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" required />
      <input type="file" accept="image/*" onChange={handleProfilePicChange} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />

      <select value={schoolLevel} onChange={(e) => setSchoolLevel(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white">
        <option value="">Select School Level</option>
        {levels.map((lvl) => (
          <option key={lvl} value={lvl}>{lvl}</option>
        ))}
      </select>
      <input type="text" placeholder="School Name" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />
      <input type="text" placeholder="Subjects / Course" value={subjects} onChange={(e) => setSubjects(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />

      <input type="text" placeholder="Certifications or Relevant Coursework" value={certifications} onChange={(e) => setCertifications(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />
      <input type="text" placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />
      <input type="url" placeholder="Professional Work Link" value={professionalWork} onChange={(e) => setProfessionalWork(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />
      <input type="text" placeholder="Reference Name" value={referenceName} onChange={(e) => setReferenceName(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />
      <input type="text" placeholder="Reference Contact (phone or email)" value={referenceContact} onChange={(e) => setReferenceContact(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" />

      <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" required />
      <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white" required>
        <option value="">Select Country</option>
        {africanCountries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Submitting...' : existingData ? 'Update Profile' : 'Submit'}
      </button>
    </form>
  );
}
