import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const africanCountries = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
            "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
            "Democratic Republic of the Congo", "Republic of the Congo", "Côte d'Ivoire",
            "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia",
            "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho",
            "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
            "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe",
            "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan",
            "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"/* ... same countries as before ... */];
const levels = ["Primary", "Secondary", "College", "Tertiary", "University", "International Student"];
const qualificationLevels = [
  "Primary", "O-Level", "A-Level", "Certificate", "Diploma",
  "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Professional Qualification"
];

export default function StudentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const existingData = location.state?.student || null;

  const [fullName, setFullName] = useState(existingData?.full_name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(existingData?.phone || '');
  const [dob, setDob] = useState(existingData?.date_of_birth || '');
  const [schoolLevel, setSchoolLevel] = useState(existingData?.school_level || '');
  const [qualification, setQualification] = useState(existingData?.qualification || '');
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
  const firstName = fullName?.split(' ')[0];

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
    const { data, error } = await supabase.storage.from('avatars')
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
    const { data, error } = await supabase.storage.from('cvs')
      .upload(`students/${Date.now()}-${file.name}`, file, { upsert: true });
    if (error) {
      alert('Failed to upload your CV: ' + error.message);
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
        qualification,
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
        const { error } = await supabase.from('students').update(studentData).eq('id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('students').insert([studentData]);
        if (error) throw error;
      }

      await supabase.from('profiles').update({ profile_complete: true }).eq('id', userId);
      navigate('/home');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-12 mb-12 p-6 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-300 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        {existingData ? 'Edit Your Profile' : 'Register Your Profile'}
      </h2>

      {firstName && (
        <p className="text-center text-blue-600 font-medium">Welcome, {firstName}!</p>
      )}

      <div className="flex flex-col items-center space-y-2">
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

      {/* Profile picture */}
      <div>
        <label className="font-semibold block">Upload Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      {/* Fields */}
      <div>
        <label className="font-semibold block">Full Name</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Email</label>
        <input type="email" value={email} readOnly className="w-full px-4 py-2 rounded bg-gray-200 cursor-not-allowed text-gray-600" />
      </div>

      <div>
        <label className="font-semibold block">Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Upload CV</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Level of Education</label>
        <select value={schoolLevel} onChange={(e) => setSchoolLevel(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white">
          <option value="">Select your level</option>
          {levels.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
        </select>
      </div>

      <div>
        <label className="font-semibold block">Highest Qualification</label>
        <select value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white">
          <option value="">Select qualification</option>
          {qualificationLevels.map((q) => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      <div>
        <label className="font-semibold block">School Name</label>
        <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Course / Subjects</label>
        <input type="text" value={subjects} onChange={(e) => setSubjects(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Certifications</label>
        <input type="text" value={certifications} onChange={(e) => setCertifications(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Skills</label>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="comma separated" className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Professional Work Link</label>
        <input type="url" value={professionalWork} onChange={(e) => setProfessionalWork(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Recommender Name</label>
        <input type="text" value={referenceName} onChange={(e) => setReferenceName(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Recommender Contact</label>
        <input type="text" value={referenceContact} onChange={(e) => setReferenceContact(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">City / District</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" />
      </div>

      <div>
        <label className="font-semibold block">Country</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900" required>
          <option value="">Select Country</option>
          {africanCountries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-800 disabled:opacity-50">
        {loading ? 'Submitting...' : existingData ? 'Update Profile' : 'Submit'}
      </button>
    </form>
  );
}
