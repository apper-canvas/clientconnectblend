import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';
import { projectService } from '../services/projectService';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showEditProject, setShowEditProject] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'medium',
    status: 'active',
    due_date: '',
    tags: []
  });

  const [editProject, setEditProject] = useState({
    id: '',
    name: '',
    description: '',
    priority: 'medium',
    status: 'active',
    due_date: '',
    tags: []
  });

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-500' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-yellow-500' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  // Load projects from database
  const loadProjects = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const projectsData = await projectService.fetchProjects(filters);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError(error.message);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const filters = {};
    if (filterStatus) filters.status = filterStatus;
    if (filterPriority) filters.priority = filterPriority;
    loadProjects(filters);
  }, [filterStatus, filterPriority]);

  const handleAddProject = async () => {
    if (!newProject.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsLoading(true);
    try {
      const projectData = [{
        name: newProject.name,
        description: newProject.description,
        priority: newProject.priority,
        status: newProject.status,
        due_date: newProject.due_date || null,
        tags: newProject.tags
      }];

      await projectService.createProjects(projectData);
      
      // Reset form
      setNewProject({
        name: '',
        description: '',
        priority: 'medium',
        status: 'active',
        due_date: '',
        tags: []
      });
      setShowAddProject(false);
      
      // Reload projects
      await loadProjects();
      toast.success('Project created successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = async () => {
    if (!editProject.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsLoading(true);
    try {
      const projectData = [{
        Id: editProject.id,
        name: editProject.name,
        description: editProject.description,
        priority: editProject.priority,
        status: editProject.status,
        due_date: editProject.due_date || null,
        tags: editProject.tags
      }];

      await projectService.updateProjects(projectData);
      
      setShowEditProject(false);
      setSelectedProject(null);
      
      // Reload projects
      await loadProjects();
      toast.success('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setIsLoading(true);
    try {
      await projectService.deleteProjects([projectId]);
      setSelectedProject(null);
      await loadProjects();
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (project) => {
    setEditProject({
      id: project.Id,
      name: project.Name || '',
      description: project.description || '',
      priority: project.priority || 'medium',
      status: project.status || 'active',
      due_date: project.due_date ? project.due_date.split('T')[0] : '',
      tags: project.Tags ? project.Tags.split(',').filter(tag => tag.trim()) : []
    });
    setShowEditProject(true);
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(opt => opt.value === priority);
    return priorityOption ? priorityOption.color : 'text-gray-600';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Project Management
          </h3>
          <p className="text-surface-600 dark:text-surface-400">
            Organize and track your projects efficiently
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddProject(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>New Project</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value="">All Priorities</option>
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Project List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">Error loading projects: {error}</div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-surface-600 dark:text-surface-400">
              No projects found. Create your first project to get started.
            </div>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project.Id}
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                layout
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        {project.Name}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                        {statusOptions.find(opt => opt.value === project.status)?.label || project.status}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                        {priorityOptions.find(opt => opt.value === project.priority)?.label || project.priority} Priority
                      </span>
                    </div>
                    <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">
                      {project.description || 'No description provided'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="h-4 w-4" />
                        <span>Due: {formatDate(project.due_date)}</span>
                      </div>
                      {project.Tags && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Tag" className="h-4 w-4" />
                          <div className="flex flex-wrap gap-1">
                            {project.Tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => setSelectedProject(project)}
                      className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Details"
                    >
                      <ApperIcon name="Eye" className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                    </motion.button>
                    <motion.button
                      onClick={() => openEditModal(project)}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit Project"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteProject(project.Id)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete Project"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-surface-200 dark:border-surface-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
                Create New Project
              </h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name *"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="date"
                  value={newProject.due_date}
                  onChange={(e) => setNewProject({...newProject, due_date: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  onClick={handleAddProject}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Creating...' : 'Create Project'}
                </motion.button>
                <motion.button
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-3 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-surface-200 dark:border-surface-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
                Edit Project
              </h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name *"
                  value={editProject.name}
                  onChange={(e) => setEditProject({...editProject, name: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <textarea
                  placeholder="Project Description"
                  value={editProject.description}
                  onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={editProject.priority}
                    onChange={(e) => setEditProject({...editProject, priority: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select
                    value={editProject.status}
                    onChange={(e) => setEditProject({...editProject, status: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="date"
                  value={editProject.due_date}
                  onChange={(e) => setEditProject({...editProject, due_date: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  onClick={handleEditProject}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Updating...' : 'Update Project'}
                </motion.button>
                <motion.button
                  onClick={() => setShowEditProject(false)}
                  className="px-4 py-3 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-surface-200 dark:border-surface-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  Project Details
                </h4>
                <motion.button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                </motion.button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h5 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                    {selectedProject.Name}
                  </h5>
                  <p className="text-surface-600 dark:text-surface-400">
                    {selectedProject.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedProject.status)}`}>
                        {statusOptions.find(opt => opt.value === selectedProject.status)?.label || selectedProject.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Priority</label>
                    <p className={`text-surface-900 dark:text-surface-100 mt-1 font-medium ${getPriorityColor(selectedProject.priority)}`}>
                      {priorityOptions.find(opt => opt.value === selectedProject.priority)?.label || selectedProject.priority}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Due Date</label>
                    <p className="text-surface-900 dark:text-surface-100 mt-1">{formatDate(selectedProject.due_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Created</label>
                    <p className="text-surface-900 dark:text-surface-100 mt-1">{formatDate(selectedProject.CreatedOn)}</p>
                  </div>
                </div>
                
                {selectedProject.Tags && (
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProject.Tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectManagement;