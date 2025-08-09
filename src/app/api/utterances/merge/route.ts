import type { NextRequest } from 'next/server';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { createClient } from '@/libs/supabase/server';
import { transcripts, utterances } from '@/models/Schema';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const body = await request.json();
    const { utteranceIds } = body;

    if (!utteranceIds || !Array.isArray(utteranceIds) || utteranceIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 utterance IDs required' },
        { status: 400 },
      );
    }

    // Get utterances and verify ownership
    const targetUtterances = await db
      .select({
        id: utterances.id,
        transcriptId: utterances.transcriptId,
        speaker: utterances.speaker,
        content: utterances.content,
        startTime: utterances.startTime,
        endTime: utterances.endTime,
        orderIndex: utterances.orderIndex,
        userId: transcripts.userId,
      })
      .from(utterances)
      .innerJoin(transcripts, eq(utterances.transcriptId, transcripts.id))
      .where(and(
        inArray(utterances.id, utteranceIds),
        eq(transcripts.userId, userId),
      ))
      .orderBy(asc(utterances.orderIndex));

    if (targetUtterances.length !== utteranceIds.length) {
      return NextResponse.json(
        { error: 'Some utterances not found or unauthorized' },
        { status: 404 },
      );
    }

    // Verify all utterances are from the same transcript
    const transcriptId = targetUtterances[0]!.transcriptId;
    if (!targetUtterances.every(u => u.transcriptId === transcriptId)) {
      return NextResponse.json(
        { error: 'All utterances must be from the same transcript' },
        { status: 400 },
      );
    }

    // Merge content
    const mergedContent = targetUtterances.map(u => u.content).join(' ');
    const firstUtterance = targetUtterances[0]!;
    const lastUtterance = targetUtterances[targetUtterances.length - 1]!;

    // Update the first utterance with merged content
    await db
      .update(utterances)
      .set({
        content: mergedContent,
        endTime: lastUtterance.endTime,
      })
      .where(eq(utterances.id, firstUtterance.id));

    // Delete the other utterances
    const idsToDelete = utteranceIds.filter(id => id !== firstUtterance.id);
    await db
      .delete(utterances)
      .where(inArray(utterances.id, idsToDelete));

    // Reindex the remaining utterances
    const remainingUtterances = await db
      .select({ id: utterances.id })
      .from(utterances)
      .where(eq(utterances.transcriptId, transcriptId))
      .orderBy(asc(utterances.orderIndex));

    // Update order indices
    for (let i = 0; i < remainingUtterances.length; i++) {
      await db
        .update(utterances)
        .set({ orderIndex: i })
        .where(eq(utterances.id, remainingUtterances[i]!.id));
    }

    return NextResponse.json({
      message: 'Utterances merged successfully',
      mergedUtteranceId: firstUtterance.id,
    });
  } catch (error) {
    console.error('Merge error:', error);
    return NextResponse.json(
      { error: 'Failed to merge utterances' },
      { status: 500 },
    );
  }
}
