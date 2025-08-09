import type { NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { createClient } from '@/libs/supabase/server';
import { transcripts, utterances } from '@/models/Schema';

export async function PUT(
  request: NextRequest,
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
    const body = await request.json();
    const { speaker, content } = body;

    // Verify ownership through transcript
    const [utterance] = await db
      .select({
        id: utterances.id,
        transcriptId: utterances.transcriptId,
        userId: transcripts.userId,
      })
      .from(utterances)
      .innerJoin(transcripts, eq(utterances.transcriptId, transcripts.id))
      .where(and(
        eq(utterances.id, id),
        eq(transcripts.userId, userId),
      ));

    if (!utterance) {
      return NextResponse.json({ error: 'Utterance not found' }, { status: 404 });
    }

    // Update utterance
    const updateData: any = {};
    if (speaker !== undefined) {
      updateData.speaker = speaker;
    }
    if (content !== undefined) {
      updateData.content = content;
    }

    const [updated] = await db
      .update(utterances)
      .set(updateData)
      .where(eq(utterances.id, id))
      .returning();

    return NextResponse.json({ utterance: updated });
  } catch (error) {
    console.error('Update utterance error:', error);
    return NextResponse.json(
      { error: 'Failed to update utterance' },
      { status: 500 },
    );
  }
}
