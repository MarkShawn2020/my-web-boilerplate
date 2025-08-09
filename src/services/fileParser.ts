import mammoth from 'mammoth';
import pdf from 'pdf-parse';

export type ParsedUtterance = {
  speaker: string;
  content: string;
  startTime?: number;
  endTime?: number;
  metadata?: Record<string, any>;
};

export class FileParser {
  static async parse(file: File): Promise<ParsedUtterance[]> {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const buffer = await file.arrayBuffer();

    switch (fileType) {
      case 'txt':
        return this.parseTxt(await file.text());
      case 'docx':
        // eslint-disable-next-line node/prefer-global/buffer
        return this.parseDocx(Buffer.from(buffer));
      case 'pdf':
        // eslint-disable-next-line node/prefer-global/buffer
        return this.parsePdf(Buffer.from(buffer));
      case 'md':
        return this.parseMarkdown(await file.text());
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private static parseTxt(text: string): ParsedUtterance[] {
    const lines = text.split('\n').filter(line => line.trim());
    const utterances: ParsedUtterance[] = [];
    let currentSpeaker = 'Speaker';

    for (const line of lines) {
      // Check if line contains speaker pattern (e.g., "John: Hello")
      const speakerMatch = line.match(/^([^:：]+)[:：](.+)$/);

      if (speakerMatch) {
        currentSpeaker = speakerMatch[1]!.trim();
        utterances.push({
          speaker: currentSpeaker,
          content: speakerMatch[2]!.trim(),
        });
      } else {
        // If no speaker pattern, use current speaker or default
        utterances.push({
          speaker: currentSpeaker,
          content: line.trim(),
        });
      }
    }

    return utterances;
  }

  private static parseMarkdown(text: string): ParsedUtterance[] {
    const lines = text.split('\n');
    const utterances: ParsedUtterance[] = [];
    let currentSpeaker = 'Speaker';

    for (const line of lines) {
      // Skip headers and empty lines
      if (line.startsWith('#') || !line.trim()) {
        continue;
      }

      // Check for bold speaker pattern **Speaker**： Content
      const boldSpeakerMatch = line.match(/^\*\*([^*]+)\*\*[:：](.+)$/);
      // Check for regular speaker pattern
      const regularSpeakerMatch = line.match(/^([^:：]+)[:：](.+)$/);

      if (boldSpeakerMatch) {
        currentSpeaker = boldSpeakerMatch[1]!.trim();
        utterances.push({
          speaker: currentSpeaker,
          content: boldSpeakerMatch[2]!.trim(),
        });
      } else if (regularSpeakerMatch && !line.includes('http')) {
        currentSpeaker = regularSpeakerMatch[1]!.trim();
        utterances.push({
          speaker: currentSpeaker,
          content: regularSpeakerMatch[2]!.trim(),
        });
      } else if (line.trim()) {
        utterances.push({
          speaker: currentSpeaker,
          content: line.trim(),
        });
      }
    }

    return utterances;
  }

  // eslint-disable-next-line node/prefer-global/buffer
  private static async parseDocx(buffer: Buffer): Promise<ParsedUtterance[]> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value;
      return this.parseTxt(text);
    } catch (error) {
      console.error('Error parsing DOCX:', error);
      throw new Error('Failed to parse DOCX file');
    }
  }

  // eslint-disable-next-line node/prefer-global/buffer
  private static async parsePdf(buffer: Buffer): Promise<ParsedUtterance[]> {
    try {
      const data = await pdf(buffer);
      const text = data.text;
      return this.parseTxt(text);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF file');
    }
  }
}
