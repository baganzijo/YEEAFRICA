// src/pages/EmployerForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import defaultLogo from '../assets/profile_icon.png'; // fallback placeholder image

const africanCountries = ["Uganda", "Kenya", "Nigeria", "Ghana", "Tanzania", "Rwanda", "South Africa"];

const industries = ["Agriculture", "Banking & Finance", "Education", "Healthcare",
  "Information Technology", "Manufacturing", "Retail", "Telecom",
  "Tourism & Hospitality", "Other"/* ... industries ... */];

export default function EmployerForm() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return navigate('/signin');
      setUserId(user.id);
      setEmail(user.email);
    });
  }, [navigate]);

  // ✅ Fetch employer data if editing
  useEffect(() => {
    const fetchEmployerData = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Failed to fetch employer data:', error.message);
        return;
      }

      if (data) {
        setCompanyName(data.company_name || '');
        setContactPerson(data.contact_person || '');
        setPhone(data.phone || '');
        setWebsite(data.website || '');
        setIndustry(data.industry || '');
        setDescription(data.description || '');
        setCity(data.city || '');
        setCountry(data.country || '');
        if (data.logo_url) {
          setLogoPreviewUrl(data.logo_url); // ✅ FIXED: correct function name
        }
      }
    };

    fetchEmployerData();
  }, [userId]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setLogoPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = logoPreviewUrl;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(filePath, logoFile, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData, error: urlError } = supabase
          .storage
          .from('company-logos')
          .getPublicUrl(filePath);

        if (urlError) throw urlError;
        logoUrl = urlData.publicUrl;
      }

      const { error: upsertErr } = await supabase
        .from('employers')
        .upsert({
          id: userId,
          company_name: companyName,
          contact_person: contactPerson,
          email,
          phone,
          website,
          industry,
          description,
          city,
          country,
          logo_url: logoUrl,
        });

      if (upsertErr) throw upsertErr;

      const { error: profErr } = await supabase
        .from('profiles')
        .update({ profile_complete: true })
        .eq('id', userId);

      if (profErr) throw profErr;

      navigate('/employer-profile');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        Employer Registration
      </h2>

      {/* Logo preview */}
      <div className="flex flex-col items-center">
        <img
          src={logoPreviewUrl || defaultLogo}
          alt="Logo Preview"
          className="w-32 h-32 rounded-full object-contain border-2 border-gray-300"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="mt-2"
        />
      </div>

      <input type="text" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
      <input type="text" placeholder="Contact Person" value={contactPerson} onChange={e => setContactPerson(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
      <input type="email" value={email} readOnly className="w-full px-4 py-2 border bg-gray-100 dark:bg-gray-800 dark:text-white cursor-not-allowed" />
      <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
      <input type="url" placeholder="Website (https://...)" value={website} onChange={e => setWebsite(e.target.value)} className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />

      <select value={industry} onChange={e => setIndustry(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white">
        <option value="">Select Industry</option>
        {industries.map(i => <option key={i} value={i}>{i}</option>)}
      </select>

      <textarea placeholder="Brief Description of Your Business" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
      <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />

      <select value={country} onChange={e => setCountry(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white">
        <option value="">Select Country</option>
        {africanCountries.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
