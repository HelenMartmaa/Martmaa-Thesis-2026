/*
  Warnings:

  - A unique constraint covering the columns `[experiment_id,subject_code]` on the table `experiment_subjects` will be added. If there are existing duplicate values, this will fail.
  - Made the column `methods_text` on table `experiments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organism_name` on table `experiments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aim` on table `experiments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `experiments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "experiments" ALTER COLUMN "methods_text" SET NOT NULL,
ALTER COLUMN "organism_name" SET NOT NULL,
ALTER COLUMN "aim" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "experiment_subjects_experiment_id_subject_code_key" ON "experiment_subjects"("experiment_id", "subject_code");
