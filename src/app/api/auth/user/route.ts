import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthService } from '@/libs/Auth';

// GET /api/auth/user?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    // Get all user data
    const [profile, preferences, subscription] = await Promise.all([
      AuthService.getUserProfile(userId),
      AuthService.getUserPreferences(userId),
      AuthService.getUserSubscription(userId),
    ]);

    return NextResponse.json({
      profile,
      preferences,
      subscription,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 },
    );
  }
}
