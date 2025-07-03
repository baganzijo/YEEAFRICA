import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission (e.g., via Supabase or email API)
    setTimeout(() => {
      toast.success('Message sent successfully!');
      setFormData({ full_name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-white">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Have a question, partnership proposal, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      {/* Form & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="text-gray-600 dark:text-gray-300">support@yeeafrica.com</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Phone</h3>
            <p className="text-gray-600 dark:text-gray-300">+256 700 123 456</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Address</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Plot 12, Innovation Hub Rd,<br />
              Kampala, Uganda
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:text-blue-500">LinkedIn</a>
              <a href="#" className="hover:text-blue-500">Twitter</a>
              <a href="#" className="hover:text-blue-500">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
