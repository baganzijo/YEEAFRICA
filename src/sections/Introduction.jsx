import React, { useState } from 'react';
import AuthModal from './AuthModal';
import heroImage from '../assets/intro.png';
import card1 from '../assets/internships.jpg';
import card2 from '../assets/jobs.jpg';
import card3 from '../assets/3.jpg';
import card4 from '../assets/entrepreneurship.png';
import step1 from '../assets/1.jpg';
import step3 from '../assets/internships.jpg';
import step2 from '../assets/2.jpg';

const cards = [
  { title: 'Find the right Internship for your career ', desc: 'We search and locate you to best internships all over your country so that you can easily gain experience for your dream job.', image: card1 },
  { title: 'Discover Opportunities across Africa', desc: 'We connect you to your dream Internship or job across Africa.', image: card2 },
  { title: 'Save time and money', desc: 'Save time and money while searching for a job by uploading your documents at once and only wait for internship and job alerts. ', image: card3 },
  { title: 'Connect to any job type with no limits', desc: 'The freedom is all yours to connect to any company in any location you feel like as long as we host.', image: card4 },
];

const steps = [
  { title: 'Sign up to create your account', desc: 'Use your email to create your account', image: step1 },
  { title: 'Fill out the form', desc: 'Simply provide relevant information about your career as a student and click Submit, all will be done', image: step2 },
  { title: 'Discover Internships and jobs', desc: 'Browse thousands of internships and jobs across Africa right at your fingertips', image: step3 },
];

const Introduction = () => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authView, setAuthView] = useState('login');

  const onOpenAuthModal = (view = 'login') => {
    setAuthView(view);
    setAuthModalVisible(true);
  };

  return (
    <main className="bg-white mt-10 dark:bg-gray-950 text-gray-950 dark:text-gray-100 transition-colors">
      {/* Auth Modal */}
      {authModalVisible && (
        <AuthModal
          authType={authView}
          onClose={() => setAuthModalVisible(false)}
          switchAuth={(type) => setAuthView(type)}
        />
      )}

      // video section
       <div className="relative w-full h-[100vh]  overflow-hidden">
      {/* ✅ Video Background (mobile-first optimization) */}
      <video
      autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
         poster="/fallback.png"// fallback image while video loads
         >
           < source src="/bg-video.mp4" type="video/mp4" />
         </video>

      {/* ✅ Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* ✅ Foreground Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <h1 className="text-5xl sm:text-3xl md:text-5xl font-bold leading-tight mb-4">
          Let's be part of that celebration by finding the right Opportunity for you
        </h1>
        <p className="text-sm sm:text-base md:text-lg mb-6">
          Discover hundreds of Opportunities right from your fingertips
        </p>
        <button onClick={() => onOpenAuthModal('register')} className="bg-white text-black px-6 py-2 rounded-md text-sm sm:text-base font-medium hover:bg-gray-200 transition">
          Discover Now
        </button>
      </div>
    </div>
    
      

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col-reverse md:flex-row items-center justify-between gap-8 bg-gradient-to-tr from-blue-950 via-blue-500 to-gray-950 dark:bg-gray-950 text-center md:text-left px-6 py-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 dark:text-yellow-500 mb-4">
            Welcome!
          </h1>
          <p className="text-lg md:text-xl text-white dark:text-gray-300 max-w-xl mb-6">
            We are YEE Africa. Your long-term partner in Internships and Jobs. We built this platform with a focus to connect students access and apply to internships and job opportunies across Africa.
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-950 dark:text-white mb-12">
            Why register with us;
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
      <section className="py-16 bg-gray-800 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-300 dark:text-yellow-300 mb-12">
            Only three steps to get started
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <img src={step.image} alt={step.title} className="mx-auto mb-4 w-40 h-24 object-cover rounded" />
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
        <p className="mb-6">Join YEE Africa and take the next step in your career journey. We are here for you from the start of your career journey</p>
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


 
