'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import TaskModal from '@/components/tasks/TaskModal'
import { authService } from '@/lib/authService'
import { getMockTasks, MockTask } from '@/lib/mock-data'
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  PlusIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TasksPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState<MockTask[]>([])
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<MockTask | null>(null)
  const router = useRouter()

  const itemsPerPage = 10

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          // Load mock tasks
          const mockTasks = getMockTasks()
          setTasks(mockTasks)
        } else {
          router.replace('/auth/signin')
        }
      } catch (error) {
        // console.error('Error fetching tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading tasks..." />
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'TODO':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <ClockIcon className="h-4 w-4" />
      case 'OVERDUE':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'TODO':
        return <CalendarIcon className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // New task management functions
  const handleNewTask = () => {
    setShowNewTaskModal(true)
  }

  const handleEditTask = (task: MockTask) => {
    setEditingTask(task)
    setShowNewTaskModal(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        // For now, just remove from local state since we're using mock data
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
        // In a real app, you would make an API call here:
        // const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
        // if (response.ok) { setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId)) }
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('Failed to delete task')
      }
    }
  }

  const handleSaveTask = async (taskData: Partial<MockTask>) => {
    try {
      if (editingTask) {
        // Update existing task
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === editingTask.id 
              ? { ...task, ...taskData }
              : task
          )
        )
        setEditingTask(null)
      } else {
        // Create new task
        const newTask: MockTask = {
          id: `task-${Date.now()}`,
          title: taskData.title || 'New Task',
          description: taskData.description || '',
          status: taskData.status || 'TODO',
          priority: taskData.priority || 'MEDIUM',
          assignedTo: taskData.assignedTo || { 
            id: `user-${Date.now()}`, 
            name: user?.email?.split('@')[0] || 'You', 
            email: user?.email || '' 
          },
          dueDate: taskData.dueDate || undefined,
          category: taskData.category || 'CONTENT_CREATION',
          createdAt: new Date().toISOString()
        }
        setTasks(prevTasks => [newTask, ...prevTasks])
      }
      setShowNewTaskModal(false)
      // In a real app, you would make an API call here
    } catch (error) {
      console.error('Error saving task:', error)
      alert('Failed to save task')
    }
  }

  // Filter tasks based on status and search term
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  // Paginate tasks
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative p-6 space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rutgers-scarlet/10 to-red-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-soft">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rutgers-scarlet to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Task Management</h1>
                  <p className="text-lg text-gray-600 font-medium">Organize and track your social media tasks and assignments</p>
                </div>
              </div>
              <button className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300" onClick={handleNewTask}>
                <PlusIcon className="h-5 w-5" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters and Search */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300 placeholder-gray-500"
                />
                <SparklesIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                aria-label="Filter tasks by status"
              >
                <option value="all">All Tasks</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Task Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg' 
                  : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/30'
              }`}
            >
              All ({tasks.length})
            </button>
            <button 
              onClick={() => handleFilterChange('TODO')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === 'TODO' 
                  ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg' 
                  : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/30'
              }`}
            >
              To Do ({tasks.filter(t => t.status === 'TODO').length})
            </button>
            <button 
              onClick={() => handleFilterChange('IN_PROGRESS')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === 'IN_PROGRESS' 
                  ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg' 
                  : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/30'
              }`}
            >
              In Progress ({tasks.filter(t => t.status === 'IN_PROGRESS').length})
            </button>
            <button 
              onClick={() => handleFilterChange('COMPLETED')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === 'COMPLETED' 
                  ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg' 
                  : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/30'
              }`}
            >
              Completed ({tasks.filter(t => t.status === 'COMPLETED').length})
            </button>
            <button 
              onClick={() => handleFilterChange('OVERDUE')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === 'OVERDUE' 
                  ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg' 
                  : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/30'
              }`}
            >
              Overdue ({tasks.filter(t => t.status === 'OVERDUE').length})
            </button>
          </div>
        </motion.div>

        {/* Enhanced Tasks List */}
        {paginatedTasks.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-soft">
              <CalendarDaysIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first task</p>
              <button className="btn-primary inline-flex items-center space-x-2" onClick={handleNewTask}>
                <PlusIcon className="h-5 w-5" />
                <span>Create your first task</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {paginatedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4" />
                          <span>Assigned to: {task.assignedTo.name}</span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200" title="Edit task" onClick={() => handleEditTask(task)}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" title="Delete task" onClick={() => handleDeleteTask(task.id)}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{startIndex + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredTasks.length)}</span>
                    {' '}of{' '}
                    <span className="font-medium">{filteredTasks.length}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-xl px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'z-10 bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rutgers-scarlet'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-xl px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showNewTaskModal}
        onClose={() => {
          setShowNewTaskModal(false)
          setEditingTask(null)
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  )
} 