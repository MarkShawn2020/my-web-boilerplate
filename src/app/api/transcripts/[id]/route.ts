import type { NextRequest } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { createClient } from '@/libs/supabase/server';
import { transcripts, utterances } from '@/models/Schema';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { id } = await params;

    // Get transcript
    const [transcript] = await db
      .select()
      .from(transcripts)
      .where(and(
        eq(transcripts.id, id),
        eq(transcripts.userId, userId),
      ));

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }

    // Get utterances
    const transcriptUtterances = await db
      .select()
      .from(utterances)
      .where(eq(utterances.transcriptId, id))
      .orderBy(asc(utterances.orderIndex));

    return NextResponse.json({
      transcript,
      utterances: transcriptUtterances,
    });
  } catch (error) {
    console.error('Get transcript error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { id } = await params;

    // Verify ownership and delete
    const [deleted] = await db
      .delete(transcripts)
      .where(and(
        eq(transcripts.id, id),
        eq(transcripts.userId, userId),
      ))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transcript deleted successfully' });
  } catch (error) {
    console.error('Delete transcript error:', error);
    return NextResponse.json(
      { error: 'Failed to delete transcript' },
      { status: 500 },
    );
  }
}
