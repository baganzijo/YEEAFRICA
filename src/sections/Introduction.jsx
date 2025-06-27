import React, { useState } from 'react';
import AuthModal from './AuthModal';
import heroImage from '../assets/intro.png';
import card1 from '../assets/internships.jpg';
import card2 from '../assets/jobs.jpg';
import card3 from '../assets/courses.jpg';
import card4 from '../assets/entrepreneurship.png';
import step1 from '../assets/signup.png';
import step2 from '../assets/profile.png';
import step3 from '../assets/apply.png';

const cards = [
  { title: 'Internships', desc: 'We connect you...', image: card1 },
  { title: 'Jobs', desc: 'We help and connect...', image: card2 },
  { title: 'Courses', desc: 'We provide...', image: card3 },
  { title: 'Entrepreneur', desc: 'We created this platform...', image: card4 },
];

const steps = [
  { title: 'Create Your Profile', desc: 'Sign up...', image: step1 },
  { title: 'Discover Opportunities', desc: 'Browse a wide range...', image: step2 },
  { title: 'Apply Or Start your online business', desc: 'Once you land...', image: step3 },
];

const Introduction = () => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authView, setAuthView] = useState('login');

  const onOpenAuthModal = (view = 'login') => {
    setAuthView(view);
    setAuthModalVisible(true);
  };

  return (
    <main className="bg-blue-900 mt-10 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors">
      {/* Auth Modal */}
      {authModalVisible && (
        <AuthModal
          authType={authView}
          onClose={() => setAuthModalVisible(false)}
          switchAuth={(type) => setAuthView(type)}
        />
      )}

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col-reverse md:flex-row items-center justify-between gap-8 bg-gradient-to-tr from-blue-900 via-blue-500 to-slate-700 dark:bg-gray-950 text-center md:text-left px-6 py-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 dark:text-yellow-500 mb-4">
            Welcome our fellow youth to a platform built with youth in mind.
          </h1>
          <p className="text-lg md:text-xl text-white dark:text-gray-300 max-w-xl mb-6">
            We are YEE Africa (Youth Employment and Entrepreneurship Africa). This platform helps African youth access internships, jobs, short on-demand courses, and even launch businesses.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button onClick={() => onOpenAuthModal('login')} className="bg-red-600 hover:bg-red-400 text-white px-6 py-2 rounded-full text-lg transition">
              Login
            </button>
            <button onClick={() => onOpenAuthModal('register')} className="bg-yellow-500 hover:bg-yellow-300 text-black px-6 py-2 rounded-full text-lg transition">
              Register
            </button>
           
          </div>
        </div>
        <div className="flex-1">
          <img src={heroImage} alt="YEE Africa Hero" className="w-full   max-w-md mx-auto" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-300 dark:text-yellow-300 mb-12">
            Who we are
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden shadow-lg group">
                <img src={card.image} alt={card.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#323da1] to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 text-white z-10">
                  <h3 className="text-lg font-bold">{card.title}</h3>
                  <p className="text-sm">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-tl from-blue-900 via-blue-500  dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-300 dark:text-yellow-300 mb-12">
            Only Three steps and you're in
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <img src={step.image} alt={step.title} className="mx-auto mb-4 w-24 h-24 object-contain" />
                <h3 className="text-xl font-semibold mb-2 text-[#f4f5f7] dark:text-white">{step.title}</h3>
                <p className="text-white dark:text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#0a2540] dark:bg-gray-950 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">Join YEE Africa and take the next step in your career journey.</p>
        <button
          onClick={() => onOpenAuthModal('register')}
          className="bg-yellow-500 text-[#08121b] px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Join Now
        </button>
      </section>
    </main>
  );
};

export default Introduction;
