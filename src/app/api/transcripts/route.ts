import type { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { createClient } from '@/libs/supabase/server';
import { transcripts } from '@/models/Schema';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const userTranscripts = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.userId, userId))
      .orderBy(desc(transcripts.createdAt));

    return NextResponse.json({ transcripts: userTranscripts });
  } catch (error) {
    console.error('Get transcripts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcripts' },
      { status: 500 },
    );
  }
}
