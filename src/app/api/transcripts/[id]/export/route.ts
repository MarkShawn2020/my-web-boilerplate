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

    // Generate markdown content
    let markdown = `# ${transcript.title}\n\n`;

    if (transcript.originalFileName) {
      markdown += `*Source: ${transcript.originalFileName}*\n\n`;
    }

    if (transcript.createdAt) {
      markdown += `*Date: ${new Date(transcript.createdAt).toLocaleDateString()}*\n\n`;
    }

    markdown += `---\n\n`;

    // Add utterances
    transcriptUtterances.forEach((utterance) => {
      markdown += `**${utterance.speaker}**： ${utterance.content}\n\n`;
    });

    // Return as downloadable file
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${transcript.title.replace(/[^a-z0-9]/gi, '_')}.md"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export transcript' },
      { status: 500 },
    );
  }
}
