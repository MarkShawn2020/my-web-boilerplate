import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthService } from '@/libs/Auth';

// GET /api/auth/profile?userId=xxx
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

    const profile = await AuthService.getUserProfile(userId);

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 },
    );
  }
}

// POST /api/auth/profile
export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 },
      );
    }

    const profile = await AuthService.createUserProfile(userId, email, fullName);

    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to create user profile in database' },
        { status: 500 },
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 },
    );
  }
}

// PUT /api/auth/profile
export async function PUT(request: NextRequest) {
  try {
    const { userId, ...updates } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    const profile = await AuthService.updateUserProfile(userId, updates);

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 },
    );
  }
}
