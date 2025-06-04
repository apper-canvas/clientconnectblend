import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-6">
          Page Not Found
        </h2>
        <Link 
          to="/"
          className="btn-primary"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;