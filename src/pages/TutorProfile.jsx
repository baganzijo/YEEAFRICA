import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function TutorProfile() {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTutorProfile() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Error fetching user:', userError?.message);
        return;
      }

      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching tutor profile:', error.message);
      } else {
        setTutor(data);
      }

      setLoading(false);
    }

    fetchTutorProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-700 dark:text-white">Loading profile...</div>;
  }

  if (!tutor) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Tutor profile not found.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate('/tutor-form')}
        >
          Create Profile
        </button>
      </div>
    );
  }

  const {
    full_name,
    email,
    phone,
    date_of_birth,
    city,
    country,
    education,
    subjects,
    experience,
    teaching_mode,
    languages,
    bio,
    profile_picture,
    portfolio_url,
  } = tutor;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12 mb-12  bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg shadow">
      <div className="flex flex-col items-center mb-6">
        <img
          src={profile_picture || 'https://via.placeholder.com/150?text=No+Image'}
          alt="Profile"
          className="w-40 h-40 rounded-full object-contain border-2 border-blue-500 shadow"
        />
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">{full_name}</h2>
        <p className="text-gray-500 dark:text-gray-300">{email}</p>
        <p className="text-gray-500 dark:text-gray-300">{phone}</p>
      </div>

      <div className="space-y-3 text-gray-800 dark:text-white">
        <p><strong>Date of Birth:</strong> {date_of_birth}</p>
        <p><strong>Location:</strong> {city}, {country}</p>
        <p><strong>Education:</strong> {education}</p>
        <p><strong>Subjects:</strong> {Array.isArray(subjects) ? subjects.join(', ') : subjects}</p>
        <p><strong>Experience:</strong> {experience}</p>
        <p><strong>Teaching Mode:</strong> {teaching_mode}</p>
        <p><strong>Languages:</strong> {Array.isArray(languages) ? languages.join(', ') : languages}</p>
        <p><strong>Bio:</strong> {bio}</p>
        {portfolio_url && (
          <p>
            <strong>Certification/Portfolio:</strong>{' '}
            <a
              href={portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Document
            </a>
          </p>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/tutor-form', { state: { tutor } })}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
