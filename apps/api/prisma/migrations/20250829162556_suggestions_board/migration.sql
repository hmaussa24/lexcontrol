-- CreateTable
CREATE TABLE "public"."Suggestion" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SuggestionVote" (
    "id" UUID NOT NULL,
    "suggestionId" UUID NOT NULL,
    "email" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuggestionVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Suggestion_createdAt_idx" ON "public"."Suggestion"("createdAt");

-- CreateIndex
CREATE INDEX "Suggestion_votesCount_idx" ON "public"."Suggestion"("votesCount");

-- CreateIndex
CREATE INDEX "SuggestionVote_suggestionId_idx" ON "public"."SuggestionVote"("suggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "SuggestionVote_suggestionId_email_key" ON "public"."SuggestionVote"("suggestionId", "email");

-- AddForeignKey
ALTER TABLE "public"."SuggestionVote" ADD CONSTRAINT "SuggestionVote_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "public"."Suggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
