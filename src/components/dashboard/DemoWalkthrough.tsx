'use client'

import {
    BackwardIcon,
    ChartBarIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    ForwardIcon,
    PauseIcon,
    PlayIcon,
    RocketLaunchIcon,
    SparklesIcon,
    UserGroupIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface DemoStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  icon: any
  highlight?: boolean
  pulse?: boolean
}

const demoSteps: DemoStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Rutgers Golf Dashboard',
    description: 'This is a comprehensive social media management dashboard designed for golf courses. Let me show you around!',
    target: 'dashboard-stats',
    position: 'center',
    icon: SparklesIcon,
    highlight: true,
    pulse: true
  },
  {
    id: 'analytics',
    title: 'Real-time Analytics',
    description: 'Track your social media performance with detailed metrics. Switch between Overview, Growth, and Audience insights.',
    target: 'dashboard-stats',
    position: 'bottom',
    icon: ChartBarIcon,
    highlight: true
  },
  {
    id: 'posts',
    title: 'Content Management',
    description: 'View and manage your social media posts across multiple platforms. See engagement metrics and post status.',
    target: 'recent-posts',
    position: 'top',
    icon: DocumentTextIcon,
    highlight: true
  },
  {
    id: 'approvals',
    title: 'Content Approval Workflow',
    description: 'Review and approve pending posts before they go live. Maintain quality control over your content.',
    target: 'pending-approvals',
    position: 'top',
    icon: CheckCircleIcon,
    highlight: true
  },
  {
    id: 'tasks',
    title: 'Task Management',
    description: 'Organize your team\'s work with detailed task tracking. Filter by status, priority, and category.',
    target: 'task-list',
    position: 'top',
    icon: UserGroupIcon,
    highlight: true
  },
  {
    id: 'features',
    title: 'Key Features',
    description: 'This demo showcases: Multi-platform posting, Analytics tracking, Team collaboration, Content approval, and Real-time monitoring.',
    target: 'demo-notice',
    position: 'top',
    icon: RocketLaunchIcon,
    highlight: true
  }
]

export default function DemoWalkthrough() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)
  const controls = useAnimation()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startWalkthrough = async () => {
    setIsActive(true)
    setCurrentStep(0)
    setIsPlaying(false)
    setShowHighlight(true)
    
    // Animate in
    await controls.start({
      opacity: 1,
      scale: 1,
              transition: { duration: 0.5, ease: "easeOut" as const }
    })
  }

  const stopWalkthrough = async () => {
    setShowHighlight(false)
    await controls.start({
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3, ease: "easeIn" }
    })
    setIsActive(false)
    setIsPlaying(false)
  }

  const nextStep = async () => {
    if (currentStep < demoSteps.length - 1) {
      // Animate out current step
      await controls.start({
        opacity: 0,
        x: -20,
        transition: { duration: 0.2 }
      })
      
      setCurrentStep(currentStep + 1)
      
      // Animate in next step
      await controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, delay: 0.1 }
      })
    } else {
      await stopWalkthrough()
    }
  }

  const prevStep = async () => {
    if (currentStep > 0) {
      // Animate out current step
      await controls.start({
        opacity: 0,
        x: 20,
        transition: { duration: 0.2 }
      })
      
      setCurrentStep(currentStep - 1)
      
      // Animate in previous step
      await controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, delay: 0.1 }
      })
    }
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  const goToStep = async (index: number) => {
    if (index === currentStep) return
    
    await controls.start({
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    })
    
    setCurrentStep(index)
    
    await controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, delay: 0.1 }
    })
  }

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying && isActive) {
      timerRef.current = setTimeout(() => {
        nextStep()
      }, 4000)
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isPlaying, isActive, currentStep])

  // Highlight target element
  useEffect(() => {
    if (isActive && showHighlight) {
      const targetElement = document.getElementById(demoSteps[currentStep].target)
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }
  }, [currentStep, isActive, showHighlight])

  if (!isActive) {
    return (
      <motion.div 
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={startWalkthrough}
          className="bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <PlayIcon className="h-5 w-5" />
          </motion.div>
          <span className="font-semibold">Start Demo Tour</span>
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.button>
      </motion.div>
    )
  }

  const currentStepData = demoSteps[currentStep]

  // Calculate position based on target element
  const getPosition = () => {
    const targetElement = document.getElementById(currentStepData.target)
    if (!targetElement) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }

    const rect = targetElement.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    let top, left, transform

    switch (currentStepData.position) {
      case 'top':
        top = Math.max(rect.top - 20, 20)
        left = rect.left + rect.width / 2
        transform = 'translate(-50%, -100%)'
        break
      case 'bottom':
        top = Math.min(rect.bottom + 20, windowHeight - 300)
        left = rect.left + rect.width / 2
        transform = 'translate(-50%, 0)'
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = Math.max(rect.left - 20, 20)
        transform = 'translate(-100%, -50%)'
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = Math.min(rect.right + 20, windowWidth - 400)
        transform = 'translate(0, -50%)'
        break
      default: // center
        top = '50%'
        left = '50%'
        transform = 'translate(-50%, -50%)'
    }

    return { top: `${top}px`, left: `${left}px`, transform }
  }

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40" 
        onClick={stopWalkthrough}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Highlight overlay for target element */}
      {showHighlight && currentStepData.highlight && (
        <motion.div
          className="fixed z-45 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <motion.div
            className="absolute border-2 border-rutgers-scarlet rounded-lg shadow-2xl"
            animate={currentStepData.pulse ? {
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 0 0 0 rgba(220, 38, 38, 0.4)",
                "0 0 0 10px rgba(220, 38, 38, 0)",
                "0 0 0 0 rgba(220, 38, 38, 0)"
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </motion.div>
      )}
      
      {/* Walkthrough Card */}
      <motion.div 
        className="fixed z-50 bg-white rounded-2xl shadow-2xl max-w-md p-6 border border-gray-200 backdrop-blur-sm"
        style={getPosition()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={controls}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={currentStepData.pulse ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <currentStepData.icon className="h-6 w-6 text-rutgers-scarlet" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-900">{currentStepData.title}</h3>
          </div>
          <motion.button
            onClick={stopWalkthrough}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Close walkthrough"
            aria-label="Close walkthrough"
          >
            <XMarkIcon className="h-5 w-5" />
          </motion.button>
        </motion.div>

        {/* Content */}
        <motion.p 
          className="text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentStepData.description}
        </motion.p>

        {/* Progress */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep + 1} of {demoSteps.length}</span>
            <span>{Math.round(((currentStep + 1) / demoSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-rutgers-scarlet to-red-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
            />
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex space-x-2">
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Previous step"
              aria-label="Previous step"
            >
              <BackwardIcon className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={toggleAutoPlay}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isPlaying ? "Pause auto-play" : "Start auto-play"}
              aria-label={isPlaying ? "Pause auto-play" : "Start auto-play"}
            >
              {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </motion.button>
            <motion.button
              onClick={nextStep}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Next step"
              aria-label="Next step"
            >
              <ForwardIcon className="h-4 w-4" />
            </motion.button>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Previous
            </motion.button>
            <motion.button
              onClick={nextStep}
              className="px-4 py-1 text-sm bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white rounded-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === demoSteps.length - 1 ? 'Finish' : 'Next'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Step Indicators */}
      <motion.div 
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex space-x-2 bg-white rounded-xl shadow-lg px-4 py-3 backdrop-blur-sm">
          {demoSteps.map((step, index) => (
            <motion.button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-gradient-to-r from-rutgers-scarlet to-red-500 shadow-lg' 
                  : index < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              title={`Go to step ${index + 1}`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 