import DashboardStats from '@/components/dashboard/DashboardStats'
import DemoWalkthrough from '@/components/dashboard/DemoWalkthrough'
import PendingApprovals from '@/components/dashboard/PendingApprovals'
import RecentPosts from '@/components/dashboard/RecentPosts'
import TaskList from '@/components/dashboard/TaskList'
import { requireAuth } from '@/lib/auth-server'
import { getMockAnalytics, getMockPosts, getMockTasks } from '@/lib/mock-data'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  try {
    const user = await requireAuth()

    // Use mock data for demo purposes
    const posts = getMockPosts()
    const pendingApprovals = getMockPosts('PENDING_APPROVAL')
    const tasks = getMockTasks()
    const analytics = getMockAnalytics()

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative p-6 space-y-8">
          {/* Enhanced Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rutgers-scarlet/10 to-red-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold gradient-text mb-2">
                    Welcome back, {user.email?.split('@')[0]}! 👋
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    Here's what's happening with your social media dashboard today
                  </p>
                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">System Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Live Data</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <div className="text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div id="dashboard-stats" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-2xl"></div>
            <div className="relative">
              <DashboardStats analytics={analytics} />
            </div>
          </div>
          
          {/* Content Grid with Enhanced Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Posts - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2 space-y-8">
              <div id="recent-posts" className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative">
                  <RecentPosts posts={posts.slice(0, 3)} />
                </div>
              </div>
              
              <div id="task-list" className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative">
                  <TaskList tasks={tasks.slice(0, 5)} />
                </div>
              </div>
            </div>
            
            {/* Pending Approvals - Takes 1 column on xl screens */}
            <div className="xl:col-span-1">
              <div id="pending-approvals" className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-3xl blur-2xl"></div>
                <div className="relative">
                  <PendingApprovals approvals={pendingApprovals} />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Demo Notice */}
          <div id="demo-notice" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-3xl p-8 shadow-soft">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Demo Mode - Interactive Showcase</h3>
                  <div className="text-blue-800 space-y-4">
                    <p className="text-lg leading-relaxed">
                      This is a comprehensive demo showcasing the social media dashboard functionality for golf courses. 
                      All data shown is realistic mock data for demonstration purposes.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                      <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
                        <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                          <span className="text-2xl mr-2">🎯</span>
                          Key Features Demonstrated
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Multi-platform social media management
                          </li>
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Real-time analytics and insights
                          </li>
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Content approval workflows
                          </li>
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Team task management
                          </li>
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            Audience engagement tracking
                          </li>
                        </ul>
                      </div>
                      <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
                        <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                          <span className="text-2xl mr-2">🚀</span>
                          Interactive Elements
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                            Tabbed analytics dashboard
                          </li>
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                            Expandable task details
                          </li>
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                            Filterable content views
                          </li>
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                            Real-time status updates
                          </li>
                          <li className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                            Responsive design
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-blue-100/50 rounded-2xl border border-blue-200/50">
                      <p className="text-sm text-blue-800 font-medium">
                        💡 In production, this would connect to real social media APIs, databases, and live data streams.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Walkthrough Component */}
          <DemoWalkthrough />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    // If there's an error, redirect to sign in
    redirect('/auth/signin')
  }
} 