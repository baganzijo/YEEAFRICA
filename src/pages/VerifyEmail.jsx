// src/pages/VerifyEmail.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Check your email 📩
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
        We’ve sent a verification link to your email. Click the link to verify your account.
        Once verified, you can log in and complete your profile.
      </p>
      <Link
        to="/"
        className="mt-6 text-blue-600 hover:underline dark:text-blue-400"
      >
        Back to Home
      </Link>
    </div>
  );
}
