import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white py-16 px-6 max-w-6xl mx-auto">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Empowering Africa’s Next Generation</h1>
        <p className="text-lg max-w-2xl mx-auto">
          YEE Africa is a career and internship hub bridging students, young professionals, and employers across Africa and beyond.
        </p>
      </section>

      {/* Who We Are */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Who We Are</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Born out of a passion to connect opportunity with potential, YEE Africa is a platform designed to help students and early-career individuals across Africa discover meaningful internships and jobs. We also empower employers with access to verified, skilled talent through a modern, data-driven system.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-600 dark:text-gray-400">
            To accelerate youth employment in Africa by streamlining access to internships, job opportunities, and career resources — one profile at a time.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-gray-600 dark:text-gray-400">
            A thriving African ecosystem where every young person has access to real-world opportunities that shape their future.
          </p>
        </div>
      </section>

      {/* Impact */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Impact So Far</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>🎓 Over 10,000+ students supported across 15+ African countries</li>
          <li>🏢 500+ companies onboarded with trusted internship and job listings</li>
          <li>📈 Real-time application tracking and feedback systems</li>
        </ul>
      </section>

      {/* Join Us / CTA */}
      <section className="text-center mt-12">
        <h3 className="text-xl font-semibold mb-2">Ready to Make an Impact?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Whether you’re a student, a mentor, or an employer — we invite you to join our mission.
        </p>
        <Link to="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition">
          Join YEE Africa
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;
