// src/components/Spinner.jsx
import React from 'react';

const Spinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="text-gray-700 dark:text-gray-300 text-lg">{text}</p>
    </div>
  );
};

export default Spinner;
