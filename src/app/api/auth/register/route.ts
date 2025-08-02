import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'CONTENT_CREATOR' } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Mock user creation for demo
    const mockUser = {
      id: 'demo-user-123',
      email,
      name,
      role,
      authId: 'demo-auth-id'
    }

    return NextResponse.json(
      { 
        message: 'User created successfully (Demo Mode)', 
        user: mockUser
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 