import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import defaultLogo from '../assets/profile_icon.png';
import { africanCountries } from './utils';

const industries = ["Aerospace", "Agriculture", "Architecture & Design", "Automotive", "Aviation", "Banking", "Biotechnology", "Chemical", "Clean Energy", "Cloud Computing", "Construction", "Consulting", "Consumer Goods", "Cybersecurity", "Data Science", "Defense", "E-commerce", "Education", "Electronics", "Energy", "Environmental Services", "Event Planning", "Fashion", "Film & Television", "Finance", "Fishing & Aquaculture", "Food & Beverage", "Forestry", "Gaming", "Government", "Green Technology", "Healthcare", "Hospitality", "Human Resources", "Import & Export", "Industrial Automation", "Information Technology", "Insurance", "Interior Design", "International Trade", "Investment Banking", "Journalism", "Legal", "Logistics", "Luxury Goods", "Manufacturing", "Marine & Fisheries", "Marketing", "Media & Entertainment", "Medical Devices", "Mining & Metals", "Mobile Applications", "Nanotechnology", "Non-Profit", "Nuclear Energy", "Oil & Gas", "Online Services", "Pharmaceuticals", "Public Relations", "Publishing", "Real Estate", "Renewable Energy", "Research & Development", "Retail", "Robotics", "Safety & Compliance", "Sales", "Security", "Shipping & Maritime", "Social Services", "Software Development", "Sports & Recreation", "Supply Chain", "Telecommunications", "Textile", "Tourism & Travel", "Transportation", "Utilities", "Video Production", "Waste Management", "Water Management", "Web Development", "Wholesale"];
const companySizes = ["1-10", "11-50", "51-100","101-200","201-500", "501-700", "701-1000", "1001+"];
const companyTypes = ["Private", "Public", "Government", "NGO", "Startup", "Other"];

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

  // Additional Fields
  const [companySize, setCompanySize] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [address, setAddress] = useState('');
  const [acceptsInterns, setAcceptsInterns] = useState(false);

  const firstName = contactPerson?.split(' ')[0];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return navigate('/signin');
      setUserId(user.id);
      setEmail(user.email);
    });
  }, [navigate]);

  useEffect(() => {
    const fetchEmployerData = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching employer:', error.message);
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
        setLogoPreviewUrl(data.logo_url || '');

        setCompanySize(data.company_size || '');
        setCompanyType(data.company_type || '');
        setRegistrationNumber(data.registration_number || '');
        setLinkedInUrl(data.linkedin_url || '');
        setAddress(data.address || '');
        setAcceptsInterns(data.accepts_interns || false);
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
          company_size: companySize,
          company_type: companyType,
          registration_number: registrationNumber,
          linkedin_url: linkedInUrl,
          address,
          accepts_interns: acceptsInterns,
        });

      if (upsertErr) throw upsertErr;

      await supabase
        .from('profiles')
        .update({ profile_complete: true })
        .eq('id', userId);

      navigate('/home');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6 mt-10"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        {companyName ? 'Update Your Employer Profile' : 'Employer Registration'}
      </h2>

      {firstName && (
        <p className="text-center text-blue-600 font-medium">
          Welcome back, <strong>{firstName}</strong>!
        </p>
      )}

      <div className="flex flex-col items-center space-y-2">
        <img
          src={logoPreviewUrl || defaultLogo}
          alt="Logo Preview"
          className="w-32 h-32 rounded-full object-contain border-2 border-blue-400 shadow"
        />
        <label className="text-sm font-semibold">Upload Company Logo</label>
        <input type="file" accept="image/*" onChange={handleLogoChange} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-semibold block mb-1">Company Name</label>
          <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Contact Person</label>
          <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Email</label>
          <input type="email" value={email} readOnly className="w-full px-4 py-2 border bg-gray-100 dark:bg-gray-800 dark:text-white cursor-not-allowed" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Phone Number</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Website</label>
          <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Industry</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white">
            <option value="">Select Industry</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Company Size</label>
          <select value={companySize} onChange={e => setCompanySize(e.target.value)} className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white">
            <option value="">Select Size</option>
            {companySizes.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Company Type</label>
          <select value={companyType} onChange={e => setCompanyType(e.target.value)} className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white">
            <option value="">Select Type</option>
            {companyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Registration Number</label>
          <input type="text" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">LinkedIn or Social Link</label>
          <input type="url" value={linkedInUrl} onChange={e => setLinkedInUrl(e.target.value)} className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Brief Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Office Address</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">City</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Country</label>
          <select value={country} onChange={e => setCountry(e.target.value)} required className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white">
            <option value="">Select Country</option>
            {africanCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" checked={acceptsInterns} onChange={() => setAcceptsInterns(prev => !prev)} />
          <label className="text-sm dark:text-white">We accept internship applications</label>
        </div>

        <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Submitting...' : companyName ? 'Update Profile' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
