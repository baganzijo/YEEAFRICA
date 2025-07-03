import React, { useState } from "react";

const faqData = [
  {
    question: "What is YEE Africa?",
    answer:
      "YEE Africa is a platform that empowers African youth with internships, jobs, entrepreneurship opportunities, and digital skills to boost career readiness and growth.",
  },
  {
    question: "How do I apply for a job or internship?",
    answer:
      "Simply create an account as a student, complete your profile, and click 'Apply' on any job or internship you're interested in.",
  },
  {
    question: "Do I need a CV to apply?",
    answer:
      "No, applications are still accepted if your profile is complete, but we recommend uploading a CV to increase your chances especially if you are applying for a job.",
  },
  {
    question: "How can employers post jobs?",
    answer:
      "Employers can register, fill in their company profile, and post opportunities from the Employer Dashboard.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Go to the Login page and click 'Forgot password'. You'll receive an email to reset it.",
  },
  {
    question: "Can I unsubscribe from the newsletter?",
    answer:
      "Yes, each newsletter email contains an unsubscribe link at the bottom.",
  },
  {
    question: "How is my data protected?",
    answer:
      "We prioritize user privacy. All your information is securely stored and only accessible to relevant employers when you apply.",
  },
  {
    question: "How do I check my application status?",
    answer:
      "Login to your dashboard and navigate to 'Applied Jobs'. Each listing shows the current status of your application.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mt-12 mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-t-lg"
            >
              {item.question}
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
