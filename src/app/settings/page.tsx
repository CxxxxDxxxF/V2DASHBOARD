'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { authService } from '@/lib/authService'
import {
    BellIcon,
    CheckIcon,
    CogIcon,
    EyeIcon,
    EyeSlashIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UserIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const router = useRouter()

  // Form state for profile settings
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'CONTENT_CREATOR'
  })

  // Form state for security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification settings state
  const [notifications, setNotifications] = useState({
    email: true,
    postApproval: true,
    taskReminders: true,
    weeklyReports: false
  })

  // Social media accounts state
  const [socialAccounts, setSocialAccounts] = useState({
    facebook: { connected: false, username: '' },
    instagram: { connected: false, username: '' },
    twitter: { connected: false, username: '' },
    tiktok: { connected: false, username: '' }
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          router.replace('/auth/signin')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/auth/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading settings..." />
  }

  if (!user) {
    return null // Will redirect to signin
  }

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'social', label: 'Social Media', icon: GlobeAltIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon }
  ]

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handleSocialConnect = (platform: string) => {
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        connected: !prev[platform as keyof typeof prev].connected
      }
    }))
  }

  // New save functionality
  const handleSaveChanges = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Validate passwords if changing them
      if (securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
        throw new Error('New passwords do not match')
      }
      
      // Here you would typically make API calls to save the data
      // For now, we'll just simulate success
      console.log('Saving settings:', {
        profile: profileData,
        security: securityData,
        notifications,
        socialAccounts
      })
      
      setSaveStatus('success')
      
      // Clear sensitive data after successful save
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
      
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 5000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: string, value: string) => {
    setSecurityData(prev => ({ ...prev, [field]: value }))
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
                  <CogIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Settings</h1>
                  <p className="text-lg text-gray-600 font-medium">Manage your account and application preferences</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-soft border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-white/20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
                  variants={itemVariants}
                >
                  <UserIcon className="h-6 w-6 text-rutgers-scarlet" />
                  <span>Profile Settings</span>
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select 
                      id="userRole"
                      value={profileData.role}
                      onChange={(e) => handleProfileChange('role', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                      aria-label="Select user role"
                    >
                      <option value="CONTENT_CREATOR">Content Creator</option>
                      <option value="APPROVER">Approver</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-white/20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
                  variants={itemVariants}
                >
                  <BellIcon className="h-6 w-6 text-rutgers-scarlet" />
                  <span>Notification Settings</span>
                </motion.h2>
                
                <div className="space-y-6">
                  {Object.entries(notifications).map(([key, value]) => (
                    <motion.div 
                      key={key}
                      className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30"
                      variants={itemVariants}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {key === 'email' && 'Receive notifications via email'}
                          {key === 'postApproval' && 'Get notified when posts need approval'}
                          {key === 'taskReminders' && 'Receive reminders for upcoming tasks'}
                          {key === 'weeklyReports' && 'Get weekly performance reports'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={value}
                          onChange={() => handleNotificationChange(key)}
                          aria-label={`Enable ${key} notifications`}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rutgers-scarlet/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rutgers-scarlet"></div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-white/20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
                  variants={itemVariants}
                >
                  <GlobeAltIcon className="h-6 w-6 text-rutgers-scarlet" />
                  <span>Social Media Accounts</span>
                </motion.h2>
                
                <div className="space-y-4">
                  {Object.entries(socialAccounts).map(([platform, account]) => (
                    <motion.div 
                      key={platform}
                      className="flex items-center justify-between p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30"
                      variants={itemVariants}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                          platform === 'facebook' ? 'bg-blue-600' :
                          platform === 'instagram' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                          platform === 'twitter' ? 'bg-blue-400' :
                          'bg-black'
                        }`}>
                          {platform === 'facebook' ? 'F' :
                           platform === 'instagram' ? 'I' :
                           platform === 'twitter' ? 'T' : '🎵'}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">{platform}</h3>
                          <p className="text-sm text-gray-500">
                            {account.connected ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSocialConnect(platform)}
                        className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                          account.connected
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {account.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-white/20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
                  variants={itemVariants}
                >
                  <ShieldCheckIcon className="h-6 w-6 text-rutgers-scarlet" />
                  <span>Security Settings</span>
                </motion.h2>
                
                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 pr-12 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Save Button */}
        <motion.div 
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            {/* Status Messages */}
            {saveStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl"
              >
                <CheckIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Settings saved successfully!</span>
              </motion.div>
            )}
            
            {saveStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl"
              >
                <XMarkIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Error saving settings. Please try again.</span>
              </motion.div>
            )}
            
            <button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Enhanced Coming Soon Notice */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Settings Features</h3>
              <div className="text-blue-800 space-y-2">
                <p>This is a preview of the settings page. Full functionality will be available once the database is properly configured.</p>
                <p className="text-sm">Coming soon: Two-factor authentication, advanced privacy controls, data export, and account recovery options.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 