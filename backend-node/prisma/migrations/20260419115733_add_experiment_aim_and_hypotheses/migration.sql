-- AlterTable
ALTER TABLE "experiments" ADD COLUMN     "aim" TEXT,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "experiment_hypotheses" (
    "id" SERIAL NOT NULL,
    "experiment_id" INTEGER NOT NULL,
    "hypothesis_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiment_hypotheses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "experiment_hypotheses" ADD CONSTRAINT "experiment_hypotheses_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
