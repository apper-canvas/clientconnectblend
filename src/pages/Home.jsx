import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';

const Home = ({ darkMode, toggleDarkMode }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4">
            Welcome to ClientConnect CRM
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            Please log in to access your CRM dashboard
          </p>
          <Link 
            to="/login"
            className="btn-primary"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  ClientConnect CRM
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-8">
                <span className="text-primary font-medium">Home</span>
                <Link 
                  to="/projects"
                  className="text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors duration-200"
                >
                  Projects
                </Link>
                <Link 
                  to="/tasks"
                  className="text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors duration-200"
                >
                  Tasks
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.firstName?.[0] || user.emailAddress?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              )}
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="h-5 w-5 text-surface-600 dark:text-surface-400" 
                />
              </motion.button>
              <motion.button
                onClick={logout}
                className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="LogOut" className="h-5 w-5 text-surface-600 dark:text-surface-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="pt-8 pb-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-surface-100 mb-6">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ClientConnect</span> CRM
            </h1>
            <p className="text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
              Streamline your customer relationships, manage projects, and boost your sales with our comprehensive CRM solution.
            </p>
          </div>
        </section>

        <MainFeature />
      </main>
    </div>
  );
};

export default Home;