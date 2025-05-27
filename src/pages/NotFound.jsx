import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <motion.div 
        className="text-center p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertCircle" className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">404</h1>
        <p className="text-lg text-surface-600 dark:text-surface-400 mb-8">Page not found</p>
        <Link to="/" className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200">
          <ApperIcon name="Home" className="h-4 w-4" />
          <span>Go Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;