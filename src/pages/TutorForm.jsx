import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const africanCountries = ["Uganda", "Kenya", "Nigeria", "Ghana", "Tanzania", "Rwanda", "South Africa"];
const commonLanguages = ["English", "French", "Swahili", "Arabic", "Portuguese", "Hausa", "Amharic", "Zulu", "Other"];

export default function TutorForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const existingData = location.state?.tutor || null;

  const [fullName, setFullName] = useState(existingData?.full_name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(existingData?.phone || '');
  const [dob, setDob] = useState(existingData?.date_of_birth || '');
  const [city, setCity] = useState(existingData?.city || '');
  const [country, setCountry] = useState(existingData?.country || '');
  const [education, setEducation] = useState(existingData?.education || '');
  const [subjects, setSubjects] = useState(existingData?.subjects || []);
  const [experience, setExperience] = useState(existingData?.experience || '');
  const [teachingMode, setTeachingMode] = useState(existingData?.teaching_mode || 'online');
  const [languages, setLanguages] = useState(existingData?.languages || []);
  const [customLanguage, setCustomLanguage] = useState('');
  const [bio, setBio] = useState(existingData?.bio || '');
  const [certUrl, setCertUrl] = useState(existingData?.portfolio_url || null);
  const [profilePicPreview, setProfilePicPreview] = useState(existingData?.profile_picture || null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
        setUserId(user.id);
      }
    }
    fetchUser();
  }, []);

  const handleFileUpload = async (bucket, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`tutors/${Date.now()}-${file.name}`, file, { upsert: true });
    if (error) throw new Error(error.message);
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const publicUrl = await handleFileUpload('avatars', file);
      setProfilePicPreview(publicUrl);
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    }
  };

  const handleCertUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const publicUrl = await handleFileUpload('portfolios', file);
      setCertUrl(publicUrl);
    } catch (err) {
      alert('Certificate upload failed: ' + err.message);
    }
  };

  const toggleLanguage = (lang) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter(l => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submittedLanguages = customLanguage
        ? [...languages.filter(l => l !== 'Other'), customLanguage]
        : languages.filter(l => l !== 'Other');

      const tutorData = {
        id: userId,
        full_name: fullName,
        email,
        phone,
        date_of_birth: dob,
        city,
        country,
        education,
        subjects,
        experience,
        teaching_mode: teachingMode,
        languages: submittedLanguages,
        bio,
        profile_picture: profilePicPreview || null,
        portfolio_url: certUrl || null,
      };

      if (existingData) {
        const { error } = await supabase.from('tutors').update(tutorData).eq('id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tutors').insert([tutorData]);
        if (error) throw error;
      }

      await supabase.from('profiles').update({ profile_complete: true }).eq('id', userId);
      navigate('/tutor-profile');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 mt-12 mb-12  bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        {existingData ? 'Edit Your Tutor Profile' : 'Tutor Registration'}
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 flex flex-col items-center space-y-4">
          <img
            src={profilePicPreview || 'https://via.placeholder.com/150?text=No+Image'}
            alt="Profile Preview"
            className="w-40 h-40 rounded-full object-contain border-2 border-blue-500 shadow"
          />
          <input type="file" accept="image/*" onChange={handleProfilePicChange} className="text-sm" />
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleCertUpload} className="text-sm" />
          {certUrl && (
            <a href={certUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline">
              📄 View Certification
            </a>
          )}
        </div>

        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="input" />
          <input type="email" value={email} readOnly className="bg-gray-200 cursor-not-allowed input" />
          <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="input" />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="input" />
          <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required className="input" />
          <select value={country} onChange={(e) => setCountry(e.target.value)} required className="input">
            <option value="">Select Country</option>
            {africanCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="Education" value={education} onChange={(e) => setEducation(e.target.value)} required className="input col-span-full" />
          <input type="text" placeholder="Subjects (comma-separated)" value={subjects.join(',')} onChange={(e) => setSubjects(e.target.value.split(',').map(s => s.trim()))} required className="input col-span-full" />
          <textarea placeholder="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} className="input col-span-full" />
          <select value={teachingMode} onChange={(e) => setTeachingMode(e.target.value)} className="input col-span-full">
            <option value="online">Online</option>
            <option value="physical">Physical</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700 dark:text-white">Languages Spoken</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {commonLanguages.map(lang => (
            <label key={lang} className="flex items-center gap-2">
              <input type="checkbox" checked={languages.includes(lang)} onChange={() => toggleLanguage(lang)} />
              {lang}
            </label>
          ))}
          {languages.includes('Other') && (
            <input type="text" placeholder="Specify other language" value={customLanguage} onChange={(e) => setCustomLanguage(e.target.value)} className="input col-span-full" />
          )}
        </div>
      </div>

      <textarea placeholder="Short Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="input w-full" />

      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Submitting...' : existingData ? 'Update Profile' : 'Submit'}
      </button>
    </form>
  );
}
