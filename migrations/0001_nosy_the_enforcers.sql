CREATE TABLE "transcripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"original_file_name" varchar(500),
	"file_type" varchar(50),
	"metadata" jsonb,
	"status" varchar(50) DEFAULT 'processing',
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utterances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transcript_id" uuid NOT NULL,
	"speaker" varchar(255) DEFAULT 'Speaker' NOT NULL,
	"content" text NOT NULL,
	"start_time" integer,
	"end_time" integer,
	"order_index" integer NOT NULL,
	"metadata" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "utterances" ADD CONSTRAINT "utterances_transcript_id_transcripts_id_fk" FOREIGN KEY ("transcript_id") REFERENCES "public"."transcripts"("id") ON DELETE cascade ON UPDATE no action;