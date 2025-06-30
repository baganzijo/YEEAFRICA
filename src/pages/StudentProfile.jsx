import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) setStudent(data);
      setLoading(false);
    };

    fetchStudent();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!student) return <p className="text-center mt-10">No profile found.</p>;

  return (
     <div className="w-full mx-auto mt-10 bg-white dark:bg-gray-950  space-y-6 relative">
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-950 rounded-lg shadow space-y-2 relative">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">My Profile</h2>

      <div className="flex flex-col items-center space-y-4">
        <img
          src={student.profile_picture || 'https://via.placeholder.com/150?text=No+Image'}
          alt="Profile"
          className="w-40 h-40 rounded-full object-contain border-2 border-blue-500 shadow"
        />
        <a href={student.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {student.cv_url ? 'View CV' : 'No CV Uploaded'}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <p><strong>Full Name:</strong> {student.full_name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>Date of Birth:</strong> {student.date_of_birth}</p>
        <p><strong>City:</strong> {student.city}</p>
        <p><strong>Country:</strong> {student.country}</p>

        <p><strong>School Level:</strong> {student.school_level}</p>
        <p><strong>School Name:</strong> {student.school_name}</p>
        <p><strong>Course/Subjects:</strong> {student.course_or_subjects}</p>

        <p><strong>Certifications:</strong> {student.certifications || '—'}</p>
        <p><strong>Skills:</strong> {student.skills || '—'}</p>
        <p><strong>Reference:</strong> {student.reference_name || '—'} ({student.reference_contact || '—'})</p>

        {student.professional_work && (
          <p>
            <strong>Professional Work:</strong>{' '}
            <a
              href={student.professional_work}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Work
            </a>
          </p>
        )}
      </div>

      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => navigate('/student-form', { state: { student } })}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
        >
          Edit Profile
        </button>
      </div>
    </div>
 </div>
  );
}
