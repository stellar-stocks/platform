ALTER TABLE "user" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "wallet" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "wallet" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_wallet_id_unique" UNIQUE("wallet_id");