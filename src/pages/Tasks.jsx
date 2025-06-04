import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';
import ApperIcon from '../components/ApperIcon';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';

const Tasks = ({ darkMode, toggleDarkMode }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditTask, setShowEditTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProject, setFilterProject] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: '',
    category: 'work',
    project_id: '',
    assignee_id: '',
    subtasks: '',
    comments: '',
    tags: []
  });

  const [editTask, setEditTask] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: '',
    category: 'work',
    project_id: '',
    assignee_id: '',
    subtasks: '',
    comments: '',
    tags: []
  });

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'bg-gray-500' },
    { value: 'progress', label: 'In Progress', color: 'bg-blue-500' },
    { value: 'review', label: 'Review', color: 'bg-yellow-500' },
    { value: 'done', label: 'Done', color: 'bg-green-500' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  const categoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'learning', label: 'Learning' }
  ];

  // Load tasks from database
  const loadTasks = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const tasksData = await taskService.fetchTasks(filters);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(error.message);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Load projects for assignment
  const loadProjects = async () => {
    setIsProjectsLoading(true);
    try {
      const projectsData = await projectService.fetchProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsProjectsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadTasks();
    loadProjects();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const filters = {};
    if (filterStatus) filters.status = filterStatus;
    if (filterPriority) filters.priority = filterPriority;
    if (filterCategory) filters.category = filterCategory;
    if (filterProject) filters.project_id = filterProject;
    loadTasks(filters);
  }, [filterStatus, filterPriority, filterCategory, filterProject]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsLoading(true);
    try {
      const taskData = [{
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        due_date: newTask.due_date || null,
        category: newTask.category,
        project_id: newTask.project_id || null,
        assignee_id: newTask.assignee_id || null,
        subtasks: newTask.subtasks,
        comments: newTask.comments,
        tags: newTask.tags
      }];

      await taskService.createTasks(taskData);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        due_date: '',
        category: 'work',
        project_id: '',
        assignee_id: '',
        subtasks: '',
        comments: '',
        tags: []
      });
      setShowAddTask(false);
      
      // Reload tasks
      await loadTasks();
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = async () => {
    if (!editTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsLoading(true);
    try {
      const taskData = [{
        Id: editTask.id,
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        status: editTask.status,
        due_date: editTask.due_date || null,
        category: editTask.category,
        project_id: editTask.project_id || null,
        assignee_id: editTask.assignee_id || null,
        subtasks: editTask.subtasks,
        comments: editTask.comments,
        tags: editTask.tags
      }];

      await taskService.updateTasks(taskData);
      
      setShowEditTask(false);
      setSelectedTask(null);
      
      // Reload tasks
      await loadTasks();
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsLoading(true);
    try {
      await taskService.deleteTasks([taskId]);
      setSelectedTask(null);
      await loadTasks();
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (task) => {
    setEditTask({
      id: task.Id,
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
      category: task.category || 'work',
      project_id: task.project_id || '',
      assignee_id: task.assignee_id || '',
      subtasks: task.subtasks || '',
      comments: task.comments || '',
      tags: task.Tags ? task.Tags.split(',').filter(tag => tag.trim()) : []
    });
    setShowEditTask(true);
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

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    return project ? project.Name : 'No project';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4">
            Please log in to access Tasks
          </h1>
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
                <Link 
                  to="/"
                  className="text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors duration-200"
                >
                  Home
                </Link>
                <Link 
                  to="/projects"
                  className="text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors duration-200"
                >
                  Projects
                </Link>
                <span className="text-primary font-medium">Tasks</span>
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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
                Task Management
              </h1>
              <p className="text-surface-600 dark:text-surface-400">
                Organize and track your tasks efficiently
              </p>
            </div>
            <motion.button
              onClick={() => setShowAddTask(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>New Task</span>
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
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.Id} value={project.Id}>{project.Name}</option>
              ))}
            </select>
          </div>

          {/* Task List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">Error loading tasks: {error}</div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-surface-600 dark:text-surface-400">
                  No tasks found. Create your first task to get started.
                </div>
              ) : (
                tasks.map((task) => (
                  <motion.div
                    key={task.Id}
                    className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-200"
                    whileHover={{ scale: 1.01 }}
                    layout
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                            {task.title || task.Name}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(task.status)}`}>
                            {statusOptions.find(opt => opt.value === task.status)?.label || task.status}
                          </span>
                          <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {priorityOptions.find(opt => opt.value === task.priority)?.label || task.priority} Priority
                          </span>
                        </div>
                        <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">
                          {task.description || 'No description provided'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" className="h-4 w-4" />
                            <span>Due: {formatDate(task.due_date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Briefcase" className="h-4 w-4" />
                            <span>{categoryOptions.find(opt => opt.value === task.category)?.label || task.category}</span>
                          </div>
                          {task.project_id && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="FolderOpen" className="h-4 w-4" />
                              <span>{getProjectName(task.project_id)}</span>
                            </div>
                          )}
                          {task.Tags && (
                            <div className="flex items-center space-x-2">
                              <ApperIcon name="Tag" className="h-4 w-4" />
                              <div className="flex flex-wrap gap-1">
                                {task.Tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
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
                          onClick={() => setSelectedTask(task)}
                          className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="View Details"
                        >
                          <ApperIcon name="Eye" className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                        </motion.button>
                        <motion.button
                          onClick={() => openEditModal(task)}
                          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit Task"
                        >
                          <ApperIcon name="Edit" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteTask(task.Id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Task"
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
        </div>
      </main>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-surface-200 dark:border-surface-700 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
                Create New Task
              </h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title *"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <textarea
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select
                    value={newTask.project_id}
                    onChange={(e) => setNewTask({...newTask, project_id: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="">No Project</option>
                    {projects.map(project => (
                      <option key={project.Id} value={project.Id}>{project.Name}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <textarea
                  placeholder="Subtasks"
                  value={newTask.subtasks}
                  onChange={(e) => setNewTask({...newTask, subtasks: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <textarea
                  placeholder="Comments"
                  value={newTask.comments}
                  onChange={(e) => setNewTask({...newTask, comments: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  onClick={handleAddTask}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Creating...' : 'Create Task'}
                </motion.button>
                <motion.button
                  onClick={() => setShowAddTask(false)}
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

      {/* Edit Task Modal */}
      <AnimatePresence>
        {showEditTask && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-surface-200 dark:border-surface-700 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
                Edit Task
              </h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title *"
                  value={editTask.title}
                  onChange={(e) => setEditTask({...editTask, title: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <textarea
                  placeholder="Task Description"
                  value={editTask.description}
                  onChange={(e) => setEditTask({...editTask, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={editTask.priority}
                    onChange={(e) => setEditTask({...editTask, priority: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select
                    value={editTask.status}
                    onChange={(e) => setEditTask({...editTask, status: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={editTask.category}
                    onChange={(e) => setEditTask({...editTask, category: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select
                    value={editTask.project_id}
                    onChange={(e) => setEditTask({...editTask, project_id: e.target.value})}
                    className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="">No Project</option>
                    {projects.map(project => (
                      <option key={project.Id} value={project.Id}>{project.Name}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="date"
                  value={editTask.due_date}
                  onChange={(e) => setEditTask({...editTask, due_date: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <textarea
                  placeholder="Subtasks"
                  value={editTask.subtasks}
                  onChange={(e) => setEditTask({...editTask, subtasks: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
                <textarea
                  placeholder="Comments"
                  value={editTask.comments}
                  onChange={(e) => setEditTask({...editTask, comments: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  onClick={handleEditTask}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Updating...' : 'Update Task'}
                </motion.button>
                <motion.button
                  onClick={() => setShowEditTask(false)}
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

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
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
                  Task Details
                </h4>
                <motion.button
                  onClick={() => setSelectedTask(null)}
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
                    {selectedTask.title || selectedTask.Name}
                  </h5>
                  <p className="text-surface-600 dark:text-surface-400">
                    {selectedTask.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedTask.status)}`}>
                        {statusOptions.find(opt => opt.value === selectedTask.status)?.label || selectedTask.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Priority</label>
                    <p className={`text-surface-900 dark:text-surface-100 mt-1 font-medium ${getPriorityColor(selectedTask.priority)}`}>
                      {priorityOptions.find(opt => opt.value === selectedTask.priority)?.label || selectedTask.priority}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Due Date</label>
                    <p className="text-surface-900 dark:text-surface-100 mt-1">{formatDate(selectedTask.due_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Category</label>
                    <p className="text-surface-900 dark:text-surface-100 mt-1">
                      {categoryOptions.find(opt => opt.value === selectedTask.category)?.label || selectedTask.category}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Project</label>
                    <p className="text-surface-900 dark:text-surface-100 mt-1">{getProjectName(selectedTask.project_id)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Created</label>
                    <p className="text-surface-900 dark:text-surface-100 mt-1">{formatDate(selectedTask.CreatedOn)}</p>
                  </div>
                </div>
                
                {selectedTask.subtasks && (
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Subtasks</label>
                    <p className="text-surface-900 dark:text-surface-100 mt-1">{selectedTask.subtasks}</p>
                  </div>
                )}
                
                {selectedTask.comments && (
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Comments</label>
                    <p className="text-surface-900 dark:text-surface-100 mt-1">{selectedTask.comments}</p>
                  </div>
                )}
                
                {selectedTask.Tags && (
                  <div>
                    <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTask.Tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
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

export default Tasks;