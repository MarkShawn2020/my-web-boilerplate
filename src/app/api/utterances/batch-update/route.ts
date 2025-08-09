import type { NextRequest } from 'next/server';
import { and, eq, gte } from 'drizzle-orm';
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
    const { utteranceId, speaker, updateType } = body;
    // updateType: 'single' | 'forward' | 'all'

    if (!utteranceId || !speaker) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Get the utterance and verify ownership
    const [utterance] = await db
      .select({
        id: utterances.id,
        transcriptId: utterances.transcriptId,
        orderIndex: utterances.orderIndex,
        currentSpeaker: utterances.speaker,
        userId: transcripts.userId,
      })
      .from(utterances)
      .innerJoin(transcripts, eq(utterances.transcriptId, transcripts.id))
      .where(and(
        eq(utterances.id, utteranceId),
        eq(transcripts.userId, userId),
      ));

    if (!utterance) {
      return NextResponse.json({ error: 'Utterance not found' }, { status: 404 });
    }

    let updatedCount = 0;

    switch (updateType) {
      case 'single':
        // Update only this utterance
        await db
          .update(utterances)
          .set({ speaker })
          .where(eq(utterances.id, utteranceId));
        updatedCount = 1;
        break;

      case 'forward': {
        // Update this and all subsequent utterances with the same speaker
        const result = await db
          .update(utterances)
          .set({ speaker })
          .where(and(
            eq(utterances.transcriptId, utterance.transcriptId),
            gte(utterances.orderIndex, utterance.orderIndex),
            eq(utterances.speaker, utterance.currentSpeaker),
          ));
        updatedCount = result.rowCount || 0;
        break;
      }

      case 'all': {
        // Update all utterances with the same speaker in this transcript
        const resultAll = await db
          .update(utterances)
          .set({ speaker })
          .where(and(
            eq(utterances.transcriptId, utterance.transcriptId),
            eq(utterances.speaker, utterance.currentSpeaker),
          ));
        updatedCount = resultAll.rowCount || 0;
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid update type' },
          { status: 400 },
        );
    }

    return NextResponse.json({
      message: 'Speaker updated successfully',
      updatedCount,
    });
  } catch (error) {
    console.error('Batch update error:', error);
    return NextResponse.json(
      { error: 'Failed to batch update utterances' },
      { status: 500 },
    );
  }
}
