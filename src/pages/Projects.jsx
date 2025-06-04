import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../App';
import ProjectManagement from '../components/ProjectManagement';
import ApperIcon from '../components/ApperIcon';

const Projects = ({ darkMode, toggleDarkMode }) => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="glass-effect sticky top-0 z-40 backdrop-blur-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <ApperIcon name="FolderOpen" className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Projects
                </h1>
                <p className="text-xs text-surface-600 dark:text-surface-400 hidden sm:block">
                  Project Management
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden sm:flex items-center space-x-3">
                  <span className="text-sm text-surface-600 dark:text-surface-400">
                    Welcome, {user.firstName || user.emailAddress}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100"
                  >
                    Logout
                  </button>
                </div>
              )}
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="h-5 w-5 text-surface-700 dark:text-surface-300" 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ProjectManagement />
      </motion.main>
    </div>
  );
};

export default Projects;