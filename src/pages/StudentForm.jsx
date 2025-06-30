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
      alert('Failed to upload your profile picture: ' + error.message);
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
    <form onSubmit={handleSubmit} className="w-full mx-auto mt-10 p-6 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-500 rounded-lg shadow space-y-3">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        {existingData ? 'Edit Your Profile' : 'Register your profile'}
      </h2>
      <p className="text-semibold text-center text-gray-500 dark:text-gray-500">
        {existingData ? "Let's not loose that job. Let's update our information and again" : 'Please be carefull while filling out the form as this information is your gateway to the job opportunies. If there is any feild you do not understand, feel free to call a friend or relative to help you out or else take your time and look for the relevant information needed'}
      </p>

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
      <p>Press the button below to upload your profile picture</p>
      <input type="file" accept="image/*" onChange={handleProfilePicChange} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      <p>Full Names</p>

      <input type="text" placeholder="" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" required />
      <p>Your email address</p>
      <input type="" value={email} readOnly className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white cursor-not-allowed" />
      <p>Phone number which is active</p>
      <input type="tel" placeholder="" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" required />
      <p>Choose your date of birth</p>
      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" required />
      <p>Your updated CV</p>
      
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      Select your level of educationfrom the list below
      

      <select value={schoolLevel} onChange={(e) => setSchoolLevel(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white">
        <option value=""></option>
        {levels.map((lvl) => (
          <option key={lvl} value={lvl}>{lvl}</option>
        ))}
      </select>
      <p>School name</p>
      <input type="text" placeholder="" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      <p>Subjects or course </p>
      <input type="text" placeholder="" value={subjects} onChange={(e) => setSubjects(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      <p>Any certifications or relevant coursework that you hold</p>

      <input type="text" placeholder="" value={certifications} onChange={(e) => setCertifications(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      <p>Do you hold any skill or talent? If so please fill them in</p>
      <input type="text" placeholder="(comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      <p>Do you have any recognisable work that you do? Then give us a link to it</p>
      <p>Only links with "https://... are supported"</p>
      <input type="url" placeholder="Link" value={professionalWork} onChange={(e) => setProfessionalWork(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      <p>Your recommender name</p>
      <input type="text" placeholder="" value={referenceName} onChange={(e) => setReferenceName(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      <p>Recommender phone numder</p>
      <input type="text" placeholder=" (phone or email)" value={referenceContact} onChange={(e) => setReferenceContact(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" />
      <p>Your city/district/state of residence</p>

      <input type="text" placeholder="" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" required />
      Your country name
      <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-900 dark:text-white" required>
        <option value=""></option>
        {africanCountries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-800 disabled:opacity-50">
        {loading ? 'Submitting...' : existingData ? 'Update Profile' : 'Submit'}
      </button>
    </form>
  );
}
