// src/components/EmployerSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaPlus, FaSignOutAlt } from "react-icons/fa";

const EmployerSidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5">
      <h2 className="text-xl font-bold mb-8 text-blue-600">Employer Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link
          to="/employer-dashboard"
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive("/employer-dashboard") && "bg-blue-100 dark:bg-blue-700 text-blue-600"
          }`}
        >
          <FaHome /> Dashboard
        </Link>
        <Link
          to="/post-job"
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive("/post-job") && "bg-blue-100 dark:bg-blue-700 text-blue-600"
          }`}
        >
          <FaPlus /> Post Job
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          ⚙️ Settings
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 rounded"
        >
          <FaSignOutAlt /> Logout
        </Link>
      </nav>
    </div>
  );
};

export default EmployerSidebar;
