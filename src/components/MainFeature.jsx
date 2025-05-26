import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('contacts')
  const [contacts, setContacts] = useState([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      position: 'Marketing Director',
      tags: ['VIP', 'Hot Lead'],
      stage: 'qualified'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@example.com',
      phone: '+1 (555) 987-6543',
      company: 'StartupXYZ',
      position: 'CEO',
      tags: ['Decision Maker'],
      stage: 'proposal'
    }
  ])

  const [opportunities, setOpportunities] = useState([
    {
      id: '1',
      title: 'Enterprise Software Deal',
      contactId: '1',
      value: 50000,
      stage: 'negotiation',
      probability: 75,
      assignedTo: 'Sales Team A'
    },
    {
      id: '2',
      title: 'Consulting Services',
      contactId: '2',
      value: 25000,
      stage: 'proposal',
      probability: 60,
      assignedTo: 'Sales Team B'
    }
  ])

  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: ''
  })

  const [showAddContact, setShowAddContact] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  const tabs = [
    { id: 'contacts', label: 'Contacts', icon: 'Users' },
    { id: 'pipeline', label: 'Sales Pipeline', icon: 'TrendingUp' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ]

  const pipelineStages = [
    { id: 'lead', label: 'Leads', color: 'bg-surface-400' },
    { id: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
    { id: 'proposal', label: 'Proposal', color: 'bg-yellow-500' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
    { id: 'closed', label: 'Closed Won', color: 'bg-green-500' }
  ]

  const handleAddContact = () => {
    if (!newContact.firstName || !newContact.lastName || !newContact.email) {
      toast.error('Please fill in required fields')
      return
    }

    const contact = {
      ...newContact,
      id: Date.now().toString(),
      tags: [],
      stage: 'lead'
    }

    setContacts([...contacts, contact])
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: ''
    })
    setShowAddContact(false)
    toast.success('Contact added successfully!')
  }

  const handleDeleteContact = (contactId) => {
    setContacts(contacts.filter(c => c.id !== contactId))
    setSelectedContact(null)
    toast.success('Contact deleted successfully!')
  }

  const moveOpportunity = (oppId, newStage) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === oppId ? { ...opp, stage: newStage } : opp
    ))
    toast.success('Opportunity moved successfully!')
  }

  const getStageContacts = (stage) => {
    return contacts.filter(contact => contact.stage === stage)
  }

  const getStageOpportunities = (stage) => {
    return opportunities.filter(opp => opp.stage === stage)
  }

  return (
    <motion.section 
      className="py-16 sm:py-20 lg:py-24"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-center mb-12">
          <div className="flex bg-white dark:bg-surface-800 rounded-2xl p-2 shadow-card border border-surface-200 dark:border-surface-700 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name={tab.icon} className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                    Contact Management
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    Manage your customer database and relationships
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowAddContact(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ApperIcon name="Plus" className="h-4 w-4" />
                  <span>Add Contact</span>
                </motion.button>
              </div>

              {/* Contact List */}
              <div className="grid gap-4 md:gap-6">
                {contacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                            {contact.firstName} {contact.lastName}
                          </h4>
                          <p className="text-surface-600 dark:text-surface-400 text-sm">
                            {contact.position} at {contact.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-sm text-surface-500 dark:text-surface-400">
                              {contact.email}
                            </span>
                            {contact.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => setSelectedContact(contact)}
                          className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ApperIcon name="Eye" className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Contact Modal */}
              <AnimatePresence>
                {showAddContact && (
                  <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-surface-200 dark:border-surface-700"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                    >
                      <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
                        Add New Contact
                      </h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="First Name *"
                            value={newContact.firstName}
                            onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                            className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                          />
                          <input
                            type="text"
                            placeholder="Last Name *"
                            value={newContact.lastName}
                            onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                            className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                          />
                        </div>
                        <input
                          type="email"
                          placeholder="Email *"
                          value={newContact.email}
                          onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                          className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={newContact.company}
                          onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                          className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={newContact.position}
                          onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                          className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div className="flex items-center space-x-3 mt-6">
                        <motion.button
                          onClick={handleAddContact}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Add Contact
                        </motion.button>
                        <motion.button
                          onClick={() => setShowAddContact(false)}
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
            </motion.div>
          )}

          {activeTab === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                  Sales Pipeline
                </h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Track opportunities through your sales process
                </p>
              </div>

              {/* Pipeline Board */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 overflow-x-auto">
                {pipelineStages.map((stage) => (
                  <div key={stage.id} className="min-w-64 lg:min-w-0">
                    <div className={`${stage.color} text-white p-3 rounded-t-xl`}>
                      <h4 className="font-semibold text-center">{stage.label}</h4>
                      <p className="text-xs text-center opacity-90 mt-1">
                        {getStageOpportunities(stage.id).length} opportunities
                      </p>
                    </div>
                    <div className="bg-surface-50 dark:bg-surface-800 rounded-b-xl p-4 min-h-96 space-y-3 border-2 border-t-0 border-surface-200 dark:border-surface-700">
                      {getStageOpportunities(stage.id).map((opportunity) => (
                        <motion.div
                          key={opportunity.id}
                          className="bg-white dark:bg-surface-700 p-4 rounded-xl shadow-card border border-surface-200 dark:border-surface-600 cursor-move hover:shadow-soft transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          drag
                          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        >
                          <h5 className="font-semibold text-surface-900 dark:text-surface-100 mb-2">
                            {opportunity.title}
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-surface-600 dark:text-surface-400">Value:</span>
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                ${opportunity.value.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-surface-600 dark:text-surface-400">Probability:</span>
                              <span className="font-semibold">{opportunity.probability}%</span>
                            </div>
                            <div className="mt-3">
                              <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${opportunity.probability}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-surface-500 dark:text-surface-400">
                              {opportunity.assignedTo}
                            </span>
                            <div className="flex space-x-1">
                              {pipelineStages.map((targetStage) => (
                                targetStage.id !== stage.id && (
                                  <motion.button
                                    key={targetStage.id}
                                    onClick={() => moveOpportunity(opportunity.id, targetStage.id)}
                                    className="p-1 rounded text-xs bg-surface-100 dark:bg-surface-600 hover:bg-surface-200 dark:hover:bg-surface-500 transition-colors duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title={`Move to ${targetStage.label}`}
                                  >
                                    <ApperIcon name="ArrowRight" className="h-3 w-3" />
                                  </motion.button>
                                )
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Monitor your sales performance and metrics
                </p>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Total Contacts',
                    value: contacts.length,
                    change: '+12%',
                    icon: 'Users',
                    color: 'text-blue-600'
                  },
                  {
                    title: 'Active Opportunities',
                    value: opportunities.length,
                    change: '+8%',
                    icon: 'TrendingUp',
                    color: 'text-green-600'
                  },
                  {
                    title: 'Pipeline Value',
                    value: `$${opportunities.reduce((sum, opp) => sum + opp.value, 0).toLocaleString()}`,
                    change: '+15%',
                    icon: 'DollarSign',
                    color: 'text-purple-600'
                  },
                  {
                    title: 'Conversion Rate',
                    value: '24%',
                    change: '+3%',
                    icon: 'Target',
                    color: 'text-orange-600'
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${metric.color} bg-opacity-10`}>
                        <ApperIcon name={metric.icon} className={`h-6 w-6 ${metric.color}`} />
                      </div>
                      <span className="text-green-500 text-sm font-semibold">{metric.change}</span>
                    </div>
                    <h4 className="text-surface-600 dark:text-surface-400 text-sm font-medium mb-1">
                      {metric.title}
                    </h4>
                    <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                      {metric.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Pipeline Overview */}
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700">
                <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6">
                  Pipeline Overview
                </h4>
                <div className="space-y-4">
                  {pipelineStages.map((stage) => {
                    const stageOpps = getStageOpportunities(stage.id)
                    const stageValue = stageOpps.reduce((sum, opp) => sum + opp.value, 0)
                    const percentage = opportunities.length > 0 ? (stageOpps.length / opportunities.length) * 100 : 0
                    
                    return (
                      <div key={stage.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                          <span className="text-surface-700 dark:text-surface-300 font-medium">
                            {stage.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-surface-600 dark:text-surface-400">
                            {stageOpps.length} opportunities
                          </span>
                          <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                            ${stageValue.toLocaleString()}
                          </span>
                          <div className="w-24 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                            <motion.div 
                              className={`h-2 rounded-full ${stage.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8 }}
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Detail Modal */}
        <AnimatePresence>
          {selectedContact && (
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
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                    Contact Details
                  </h4>
                  <motion.button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="X" className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedContact.firstName[0]}{selectedContact.lastName[0]}
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        {selectedContact.firstName} {selectedContact.lastName}
                      </h5>
                      <p className="text-surface-600 dark:text-surface-400">
                        {selectedContact.position} at {selectedContact.company}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Email</label>
                      <p className="text-surface-900 dark:text-surface-100">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Phone</label>
                      <p className="text-surface-900 dark:text-surface-100">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Tags</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedContact.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

export default MainFeature