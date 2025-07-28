import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Check if required environment variables are set
    const checks = {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.length >= 32 : false,
    };

    const allChecksPass = Object.values(checks).every(check => check === true);

    return NextResponse.json({
      status: allChecksPass ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
      authProvidersCount: authOptions.providers.length,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}