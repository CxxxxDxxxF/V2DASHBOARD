'use client'

import { MockTask } from '@/lib/mock-data'
import {
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

interface TaskListProps {
  tasks: MockTask[]
}

export default function TaskList({ tasks }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed' | 'overdue'>('all')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'IN_PROGRESS':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'OVERDUE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500'
      case 'HIGH':
        return 'bg-orange-500'
      case 'MEDIUM':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'CONTENT_CREATION':
        return 'bg-purple-100 text-purple-800'
      case 'ENGAGEMENT':
        return 'bg-blue-100 text-blue-800'
      case 'ANALYTICS':
        return 'bg-green-100 text-green-800'
      case 'MAINTENANCE':
        return 'bg-gray-100 text-gray-800'
      case 'EVENTS':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status.toLowerCase().replace('_', '') === filter
  })

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  }

  const expandVariants = {
    collapsed: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    expanded: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <motion.h3 
            className="text-lg font-semibold text-gray-900"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Tasks & Projects
          </motion.h3>
          <motion.div 
            className="flex space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {(['all', 'todo', 'in_progress', 'completed', 'overdue'] as const).map((filterOption, index) => (
              <motion.button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  filter === filterOption
                    ? 'bg-rutgers-scarlet text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filterOption.replace('_', ' ').toUpperCase()}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="divide-y divide-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div 
              key={task.id} 
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                backgroundColor: "#f9fafb",
                transition: { duration: 0.2 }
              }}
              layout
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getStatusIcon(task.status)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <motion.h4 
                        className="text-sm font-medium text-gray-900 truncate"
                        whileHover={{ color: "#dc2626" }}
                        transition={{ duration: 0.2 }}
                      >
                        {task.title}
                      </motion.h4>
                      <motion.div 
                        className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      />
                      {task.category && (
                        <motion.span 
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(task.category)}`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {task.category.replace('_', ' ')}
                        </motion.span>
                      )}
                    </div>
                    
                    {task.description && (
                      <motion.p 
                        className="text-sm text-gray-600 mb-2 line-clamp-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {task.description}
                      </motion.p>
                    )}

                    <motion.div 
                      className="flex items-center space-x-4 text-xs text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Assigned to:</span>
                        <span>{task.assignedTo.name}</span>
                      </div>
                      {task.dueDate && (
                        <motion.div 
                          className={`flex items-center space-x-1 ${isOverdue(task.dueDate) ? 'text-red-600' : ''}`}
                          animate={isOverdue(task.dueDate) ? { 
                            scale: [1, 1.05, 1],
                            transition: { duration: 1, repeat: Infinity }
                          } : {}}
                        >
                          <span className="font-medium">Due:</span>
                          <span>{formatDate(task.dueDate)}</span>
                          {isOverdue(task.dueDate) && (
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <ExclamationTriangleIcon className="h-3 w-3" />
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                      {task.estimatedHours && (
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Est:</span>
                          <span>{task.estimatedHours}h</span>
                        </div>
                      )}
                    </motion.div>

                    <AnimatePresence>
                      {expandedTasks.has(task.id) && (
                        <motion.div 
                          className="mt-3 p-3 bg-gray-50 rounded-lg overflow-hidden"
                          variants={expandVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                        >
                          <motion.div 
                            className="grid grid-cols-2 gap-4 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div>
                              <span className="font-medium text-gray-700">Status:</span>
                              <span className={`ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Priority:</span>
                              <span className="ml-2 text-gray-600">{task.priority}</span>
                            </div>
                            {task.category && (
                              <div>
                                <span className="font-medium text-gray-700">Category:</span>
                                <span className="ml-2 text-gray-600">{task.category.replace('_', ' ')}</span>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-700">Created:</span>
                              <span className="ml-2 text-gray-600">{formatDate(task.createdAt)}</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.button
                  onClick={() => toggleTaskExpansion(task.id)}
                  className="ml-4 p-1 rounded-md hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ rotate: expandedTasks.has(task.id) ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expandedTasks.has(task.id) ? (
                      <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {filteredTasks.length === 0 && (
          <motion.div 
            className="p-6 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <XCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            </motion.div>
            <motion.h3 
              className="mt-2 text-sm font-medium text-gray-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              No tasks found
            </motion.h3>
            <motion.p 
              className="mt-1 text-sm text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              No tasks match the current filter criteria.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 