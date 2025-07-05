import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import placeholderImage from '../assets/job.svg';
import { africanCountries } from './utils.js';

const mainTypes = ['Job', 'Internship'];
const jobSubTypes = ['Full-time', 'Part-time', 'Remote', 'Contract'];
const internshipSubTypes = ['Full-time', 'Part-time', 'Remote'];
const industries = [
  "Aerospace", "Agriculture", "Architecture & Design", "Automotive", "Aviation", "Banking", "Biotechnology", "Chemical", "Clean Energy", "Cloud Computing", "Construction", "Consulting", "Consumer Goods", "Cybersecurity", "Data Science", "Defense", "E-commerce", "Education", "Electronics", "Energy", "Environmental Services", "Event Planning", "Fashion", "Film & Television", "Finance", "Fishing & Aquaculture", "Food & Beverage", "Forestry", "Gaming", "Government", "Green Technology", "Healthcare", "Hospitality", "Human Resources", "Import & Export", "Industrial Automation", "Information Technology", "Insurance", "Interior Design", "International Trade", "Investment Banking", "Journalism", "Legal", "Logistics", "Luxury Goods", "Manufacturing", "Marine & Fisheries", "Marketing", "Media & Entertainment", "Medical Devices", "Mining & Metals", "Mobile Applications", "Nanotechnology", "Non-Profit", "Nuclear Energy", "Oil & Gas", "Online Services", "Pharmaceuticals", "Public Relations", "Publishing", "Real Estate", "Renewable Energy", "Research & Development", "Retail", "Robotics", "Safety & Compliance", "Sales", "Security", "Shipping & Maritime", "Social Services", "Software Development", "Sports & Recreation", "Supply Chain", "Telecommunications", "Textile", "Tourism & Travel", "Transportation", "Utilities", "Video Production", "Waste Management", "Water Management", "Web Development", "Wholesale"
];
const qualifications = ['Primary', 'O-Level', 'A-Level', 'Certificate', 'Diploma', 'Bachelor', 'Masters', 'PhD', 'Professional'];

export default function JobForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyName, setCompanyName] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(''); // Internship or Job
  const [type, setType] = useState(''); // Full-time, etc.
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [qualLevel, setQualLevel] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [salary, setSalary] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return navigate('/signin');
      setUserId(user.id);

      const { data: employer } = await supabase
        .from('employers')
        .select('logo_url, company_name')
        .eq('id', user.id)
        .single();

      setCompanyLogo(employer?.logo_url || null);
      setCompanyName(employer?.company_name || '');
    });
  }, [navigate]);

  useEffect(() => {
    if (!jobId) return;
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) return console.error(error);

      setTitle(data.title);
      setCategory(data.category || '');
      setType(data.type || '');
      setIndustry(data.industry);
      const [jobCity, jobCountry] = (data.location || '').split(',').map(part => part.trim());
      setCity(jobCity || '');
      setCountry(jobCountry || '');
      setDeadline(data.application_deadline || '');
      setDescription(data.description);
      setRequirements(data.requirements);
      setSalary(data.salary);
      setQualLevel(data.qualifications?.[0] || '');
      setResponsibilities(data.responsibilities || '');
      setExistingImageUrl(data.image_url);
      setImagePreviewUrl(data.image_url || null);
    };
    fetchJob();
  }, [jobId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = existingImageUrl;

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const filename = `job-${userId}-${Date.now()}.${ext}`;
        const path = `job-images/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from('job-images')
          .upload(path, imageFile, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('job-images').getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const jobData = {
        title,
        category,
        type,
        industry,
        location: `${city}, ${country}`,
        application_deadline: deadline,
        description,
        requirements,
        qualifications: [qualLevel],
        responsibilities,
        salary,
        image_url: imageUrl,
        employer_id: userId,
        company_logo: companyLogo,
        company_name: companyName,
      };

      const { error } = jobId
        ? await supabase.from('jobs').update(jobData).eq('id', jobId)
        : await supabase.from('jobs').insert(jobData);

      if (error) throw error;

      navigate('/employer-dashboard');
    } catch (err) {
      alert('Error submitting job: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {jobId ? 'Edit Job' : 'Post a Job'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <img
            src={imagePreviewUrl || placeholderImage}
            alt="Job Preview"
            className="w-48 h-32 object-contain border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />

        {/* Main Category */}
        <select
          value={category}
          onChange={e => {
            setCategory(e.target.value);
            setType('');
          }}
          required
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select Job Category</option>
          {mainTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Sub Type */}
        {category && (
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            required
            className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select Type</option>
            {(category === 'Internship' ? internshipSubTypes : jobSubTypes).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}

        <select
          value={industry}
          onChange={e => setIndustry(e.target.value)}
          required
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select Industry</option>
          {industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
            className="w-1/2 border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
            className="w-1/2 border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select Country</option>
            {africanCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          required
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />

        <textarea
          placeholder="Requirements"
          value={requirements}
          onChange={e => setRequirements(e.target.value)}
          rows={3}
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />

        <select
          value={qualLevel}
          onChange={e => setQualLevel(e.target.value)}
          required
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select Qualification Level</option>
          {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
        </select>

        <textarea
          placeholder="Responsibilities"
          value={responsibilities}
          onChange={e => setResponsibilities(e.target.value)}
          rows={3}
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />

        <input
          type="text"
          placeholder="Salary (USD)"
          value={salary}
          onChange={e => setSalary(e.target.value)}
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (jobId ? 'Updating...' : 'Posting...') : jobId ? 'Update Job' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
