-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50),
    "location" VARCHAR(100),
    "bio" TEXT,
    "password" VARCHAR(255) NOT NULL,
    "avatar_url" TEXT,
    "cover_url" TEXT,
    "join_date" VARCHAR(50) NOT NULL DEFAULT 'August 2023',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
