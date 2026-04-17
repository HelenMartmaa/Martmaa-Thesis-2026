-- CreateTable
CREATE TABLE "experiments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "experiment_type" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
