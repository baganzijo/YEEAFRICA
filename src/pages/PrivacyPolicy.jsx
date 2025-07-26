import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 mt-12 mb-12  bg-white dark:bg-gray-950 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-6">
        This Privacy Policy explains how YEE Africa collects, uses, and protects your personal information when you use our platform.
        By using our services, you agree to the terms described in this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect the following information:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Personal details (name, email, phone number, profile picture)</li>
        <li>Educational background, work history, and CV information</li>
        <li>Usage data (pages visited, job applications, search behavior)</li>
        <li>IP address, device information, and cookies</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-2">2. How We Use Your Information</h2>
      <p className="mb-6">
        We use your information to:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Match students with jobs and internships</li>
        <li>Help employers find suitable candidates</li>
        <li>Improve our services and personalize your experience</li>
        <li>Communicate important updates or job notifications</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-2">3. Sharing Your Information</h2>
      <p className="mb-6">
        We do not sell your data. We may share your data:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>With employers (only your job application details)</li>
        <li>With service providers helping us run the platform</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-2">4. Data Security</h2>
      <p className="mb-6">
        We implement security measures such as encryption and access controls to protect your personal data. However, no online platform can guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-2">5. Your Rights</h2>
      <p className="mb-6">
        You have the right to access, update, or delete your personal data at any time. Please contact us to make a request or manage your data from your account settings.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-2">6. Cookies</h2>
      <p className="mb-6">
        We use cookies to enhance your experience. You can disable cookies in your browser settings, but this may affect how our site functions.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-2">7. Changes to This Policy</h2>
      <p className="mb-6">
        We may update this policy to reflect changes in our practices. When we do, we will update the date below and notify users if the changes are significant.
      </p>

      <p className="italic mb-6">Last updated: July 3, 2025</p>

      <h2 className="text-2xl font-semibold mt-10 mb-2">8. Contact Us</h2>
      <p className="mb-6">
        If you have questions or concerns about this policy, contact us at:
      </p>
      <p className="text-blue-600 dark:text-blue-400">
        gritsavvy@gmail.com
      </p>
    </div>
  );
};

export default PrivacyPolicy;
