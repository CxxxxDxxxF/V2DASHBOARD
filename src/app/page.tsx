import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth-server'

export default async function Home() {
  try {
    const user = await getServerUser()
    
    if (user) {
      redirect('/dashboard')
    } else {
      redirect('/auth/signin')
    }
  } catch (error) {
    console.error('Home page error:', error)
    // If there's an error getting the user, redirect to sign in
    redirect('/auth/signin')
  }
} 