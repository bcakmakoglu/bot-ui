ALTER TABLE "public"."users" ADD COLUMN "last_seen" timestamptz;
ALTER TABLE "public"."users" ALTER COLUMN "last_seen" DROP NOT NULL;
ALTER TABLE "public"."users" ALTER COLUMN "last_seen" SET DEFAULT now();
