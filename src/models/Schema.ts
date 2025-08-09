import { integer, jsonb, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Transcripts table - stores transcript sessions
export const transcripts = pgTable('transcripts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  originalFileName: varchar('original_file_name', { length: 500 }),
  fileType: varchar('file_type', { length: 50 }), // docx, pdf, mp3, etc.
  metadata: jsonb('metadata').$type<{
    duration?: number;
    fileSize?: number;
    [key: string]: any;
  }>(),
  status: varchar('status', { length: 50 }).default('processing'), // processing, completed, error
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Utterances table - stores individual speech records
export const utterances = pgTable('utterances', {
  id: uuid('id').primaryKey().defaultRandom(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' }),
  speaker: varchar('speaker', { length: 255 }).notNull().default('Speaker'),
  content: text('content').notNull(),
  startTime: integer('start_time'), // in milliseconds
  endTime: integer('end_time'), // in milliseconds
  orderIndex: integer('order_index').notNull(), // for maintaining order
  metadata: jsonb('metadata').$type<{
    confidence?: number;
    language?: string;
    [key: string]: any;
  }>(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Keep the counter schema for demo purposes (can be removed later)
export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
