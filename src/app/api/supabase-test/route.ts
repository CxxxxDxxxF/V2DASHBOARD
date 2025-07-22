import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test basic Supabase connection by checking auth
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json({ 
        error: 'Supabase connection failed',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Supabase connection successful',
      auth: {
        hasSession: !!data.session,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to Supabase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 