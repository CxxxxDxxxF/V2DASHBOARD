'use client'

import { MockPost } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

interface PendingApprovalsProps {
  approvals: MockPost[]
}

export default function PendingApprovals({ approvals }: PendingApprovalsProps) {
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

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="/posts" 
            className="text-sm text-rutgers-scarlet hover:text-red-700 transition-colors"
          >
            View all
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {approvals.length === 0 ? (
            <motion.p 
              key="no-approvals"
              className="text-gray-500 text-center py-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              No pending approvals
            </motion.p>
          ) : (
            approvals.map((post, index) => (
              <motion.div 
                key={post.id} 
                className="border-b border-gray-200 pb-4 last:border-b-0 cursor-pointer group"
                variants={itemVariants}
                whileHover={{ 
                  backgroundColor: "#fef3c7",
                  x: 5,
                  transition: { duration: 0.2 }
                }}
                layout
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <motion.p 
                      className="text-sm font-medium text-gray-900 truncate group-hover:text-yellow-800 transition-colors"
                      whileHover={{ color: "#92400e" }}
                      transition={{ duration: 0.2 }}
                    >
                      {post.caption.substring(0, 80)}
                      {post.caption.length > 80 && '...'}
                    </motion.p>
                    <motion.div 
                      className="flex items-center mt-1 space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <motion.span 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        animate={{
                          scale: [1, 1.05, 1],
                          transition: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                        }}
                      >
                        Pending Approval
                      </motion.span>
                      <motion.span 
                        className="text-xs text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
} 