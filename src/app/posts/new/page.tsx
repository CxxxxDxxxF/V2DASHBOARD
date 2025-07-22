'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  CalendarIcon,
  SparklesIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { authService } from '@/lib/authService'
import { User } from '@supabase/supabase-js'

interface Platform {
  id: string
  name: string
  icon: string
  color: string
  selected: boolean
}

const platforms: Platform[] = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'social-facebook', selected: false },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'social-instagram', selected: false },
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'social-twitter', selected: false },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'social-tiktok', selected: false },
]

export default function NewPostPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [caption, setCaption] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(platforms)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [postStatus, setPostStatus] = useState<'draft' | 'scheduled' | 'immediate'>('draft')

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    }
    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (user === null) {
      router.push('/auth/signin')
    }
  }, [user, router])

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, selected: !platform.selected }
          : platform
      )
    )
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateCaption = async () => {
    if (!caption.trim()) return

    setIsGeneratingCaption(true)
    try {
      const response = await fetch('/api/ai/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: caption,
          platforms: selectedPlatforms.filter(p => p.selected).map(p => p.id)
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCaption(data.caption)
      }
    } catch (error) {
      console.error('Error generating caption:', error)
    } finally {
      setIsGeneratingCaption(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/auth/signin')
      return
    }

    const selectedPlatformIds = selectedPlatforms.filter(p => p.selected).map(p => p.id)
    if (selectedPlatformIds.length === 0) {
      alert('Please select at least one platform')
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('caption', caption)
      formData.append('platforms', JSON.stringify(selectedPlatformIds))
      formData.append('status', postStatus)
      
      if (scheduledDate) {
        formData.append('scheduledAt', scheduledDate)
      }
      
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        router.push('/posts')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading if not authenticated
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600">Compose and schedule your social media content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform Selection */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedPlatforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformToggle(platform.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  platform.selected
                    ? `border-${platform.color} bg-${platform.color} bg-opacity-10`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{platform.icon}</div>
                <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                {platform.selected && (
                  <CheckIcon className="h-5 w-5 text-green-600 mt-2 mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Image (Optional)</h3>
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              aria-label="Upload image file"
            />
            
            {imagePreview ? (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-md rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Remove Image</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Caption */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Write Your Caption</h3>
            <button
              type="button"
              onClick={generateCaption}
              disabled={isGeneratingCaption || !caption.trim()}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>{isGeneratingCaption ? 'Generating...' : 'AI Enhance'}</span>
            </button>
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write your post caption here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rutgers-scarlet focus:border-transparent"
            required
          />
        </div>

        {/* Scheduling */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Your Post</h3>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={postStatus === 'draft'}
                  onChange={(e) => setPostStatus(e.target.value as any)}
                  className="mr-2"
                />
                <span>Save as Draft</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="scheduled"
                  checked={postStatus === 'scheduled'}
                  onChange={(e) => setPostStatus(e.target.value as any)}
                  className="mr-2"
                />
                <span>Schedule</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="immediate"
                  checked={postStatus === 'immediate'}
                  onChange={(e) => setPostStatus(e.target.value as any)}
                  className="mr-2"
                />
                <span>Post Now</span>
              </label>
            </div>
            
            {postStatus === 'scheduled' && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="input-field"
                  required
                  aria-label="Select date and time for scheduling"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/posts')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
} 