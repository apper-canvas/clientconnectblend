import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ApperIcon name="AlertTriangle" className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-surface-900 dark:text-surface-100 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-2">Page Not Found</h2>
            <p className="text-surface-600 dark:text-surface-400 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="Home" className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound