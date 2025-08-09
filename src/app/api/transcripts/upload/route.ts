import type { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { createClient } from '@/libs/supabase/server';
import { transcripts, utterances } from '@/models/Schema';
import { FileParser } from '@/services/fileParser';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || file.name;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create transcript record
    const [transcript] = await db.insert(transcripts).values({
      userId,
      title,
      originalFileName: file.name,
      fileType: file.name.split('.').pop()?.toLowerCase(),
      status: 'processing',
      metadata: {
        fileSize: file.size,
      },
    }).returning();

    try {
      // Parse file using FileParser service
      const parsedUtterances = await FileParser.parse(file);

      // Insert utterances
      if (parsedUtterances.length > 0) {
        await db.insert(utterances).values(
          parsedUtterances.map((utterance, index) => ({
            transcriptId: transcript!.id,
            speaker: utterance.speaker,
            content: utterance.content,
            startTime: utterance.startTime,
            endTime: utterance.endTime,
            orderIndex: index,
            metadata: utterance.metadata,
          })),
        );
      }

      // Update transcript status
      await db.update(transcripts)
        .set({ status: 'completed' })
        .where(eq(transcripts.id, transcript!.id));

      return NextResponse.json({ transcript }, { status: 201 });
    } catch (parseError) {
      // Update transcript status to error
      await db.update(transcripts)
        .set({ status: 'error' })
        .where(eq(transcripts.id, transcript!.id));

      console.error('Parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse file', details: parseError instanceof Error ? parseError.message : 'Unknown error' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 },
    );
  }
}
