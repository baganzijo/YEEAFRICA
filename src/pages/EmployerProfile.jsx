import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function EmployerProfile() {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmployerProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching employer profile:', error.message);
      } else {
        setEmployer(data);
      }

      setLoading(false);
    }

    fetchEmployerProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-gray-700 dark:text-white">
        Loading profile...
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Employer profile not found.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate('/employer-form')}
        >
          Create Profile
        </button>
      </div>
    );
  }

  const {
    company_name,
    contact_person,
    email,
    phone,
    website,
    industry,
    description,
    city,
    country,
    logo_url
  } = employer;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="flex flex-col items-center mb-6">
        <img
          src={logo_url || 'https://via.placeholder.com/150?text=Logo'}
          alt="Company Logo"
          className="w-40 h-40 object-contain rounded-full border-2 border-blue-500 shadow"
        />
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
          {company_name}
        </h2>
        <p className="text-gray-500 dark:text-gray-300">{email}</p>
        <p className="text-gray-500 dark:text-gray-300">{phone}</p>
      </div>

      <div className="space-y-3 text-gray-800 dark:text-white">
        <p><strong>Contact Person:</strong> {contact_person}</p>
        <p><strong>Industry:</strong> {industry}</p>
        <p><strong>Website:</strong> <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{website}</a></p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Location:</strong> {city}, {country}</p>
      </div>

      <div className="mt-6 text-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/employer-form', { state: { employer } })}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
