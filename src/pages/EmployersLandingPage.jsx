// src/pages/EmployersLanding.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const EmployersLanding = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Find the Right Talent for Your Organization
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Post internships or jobs and connect with Africa’s brightest students and fresh graduates.
          </p>
          <Link
            to="/employer-form"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-10 text-center mb-16">
          <div className="p-6 rounded shadow bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">Post Jobs & Internships</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Share opportunities directly with young talent across Africa.
            </p>
          </div>
          <div className="p-6 rounded shadow bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Our algorithm helps you discover qualified candidates faster.
            </p>
          </div>
          <div className="p-6 rounded shadow bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">Employer Dashboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage your postings and applicants all in one place.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Join hundreds of employers hiring smart!</h2>
          <Link
            to="/employer-form"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            Create Employer Account
          </Link>
        </section>
      </div>
    </div>
  );
};

export default EmployersLanding;
