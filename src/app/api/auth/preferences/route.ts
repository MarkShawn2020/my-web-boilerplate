import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthService } from '@/libs/Auth';

// GET /api/auth/preferences?userId=xxx
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

    const preferences = await AuthService.getUserPreferences(userId);

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user preferences' },
      { status: 500 },
    );
  }
}

// PUT /api/auth/preferences
export async function PUT(request: NextRequest) {
  try {
    const { userId, ...updates } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    const preferences = await AuthService.updateUserPreferences(userId, updates);

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update user preferences' },
      { status: 500 },
    );
  }
}
