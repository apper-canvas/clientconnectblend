import React from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = ({ darkMode, toggleDarkMode }) => {
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
                  <ApperIcon name="Users" className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ClientConnect
                </h1>
                <p className="text-xs text-surface-600 dark:text-surface-400 hidden sm:block">
                  CRM Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
              
              <div className="hidden sm:flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Demo</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative py-12 sm:py-20 lg:py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-surface-900 dark:text-surface-100 mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Manage Customer
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Relationships
              </span>
              Like Never Before
            </motion.h2>
            
            <motion.p 
              className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 mb-8 max-w-2xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Track leads, manage sales pipelines, and build stronger customer relationships with our comprehensive CRM platform.
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { icon: "Users", label: "Contact Management" },
                { icon: "TrendingUp", label: "Sales Pipeline" },
                { icon: "Calendar", label: "Activity Tracking" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-surface-800/50 rounded-full border border-surface-200 dark:border-surface-700">
                  <ApperIcon name={feature.icon} className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{feature.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Feature Section */}
      <MainFeature />

      {/* Footer */}
      <motion.footer 
        className="bg-surface-900 dark:bg-surface-950 text-surface-100 py-12 mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">ClientConnect</h3>
            </div>
            <p className="text-surface-400 text-sm">
              © 2024 ClientConnect CRM. Built for modern businesses.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home