import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getMockPosts } from '@/lib/mock-data'

async function getServerUser() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting server user:', error)
    return null
  }
  
  return user
}

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Use mock data for demo
    let posts = getMockPosts()
    
    // Filter by status if provided
    if (status) {
      posts = posts.filter(post => post.status === status.toUpperCase())
    }

    // Apply pagination
    const total = posts.length
    const paginatedPosts = posts.slice(skip, skip + limit)

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message: 'Demo data - Mock posts for showcase purposes',
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const caption = formData.get('caption') as string
    const platforms = JSON.parse(formData.get('platforms') as string)
    const status = formData.get('status') as string
    const scheduledAt = formData.get('scheduledAt') as string
    const image = formData.get('image') as File

    if (!caption || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Caption and at least one platform are required' },
        { status: 400 }
      )
    }

    // For demo purposes, return a mock response
    const mockPost = {
      id: `demo-${Date.now()}`,
      caption,
      platforms: platforms.map((p: string) => p.toUpperCase()),
      status: status === 'immediate' ? 'PENDING_APPROVAL' : 'DRAFT',
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      author: {
        id: user.id,
        name: user.user_metadata?.name || user.email,
        email: user.email,
      },
      createdAt: new Date().toISOString(),
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
      },
    }

    return NextResponse.json({
      message: 'Post created successfully (Demo Mode)',
      post: mockPost,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 