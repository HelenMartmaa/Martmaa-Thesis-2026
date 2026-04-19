/*
  Warnings:

  - You are about to drop the column `description` on the `experiments` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `experiments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `experiment_type` on the `experiments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `status` on the `experiments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "experiments" DROP COLUMN "description",
ADD COLUMN     "end_date" DATE,
ADD COLUMN     "methods_text" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "organism_name" VARCHAR(255),
ADD COLUMN     "resources_text" TEXT,
ADD COLUMN     "schedule_notes" TEXT,
ADD COLUMN     "start_date" DATE,
ADD COLUMN     "treatment_plan_text" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "experiment_type" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "experiment_groups" (
    "id" SERIAL NOT NULL,
    "experiment_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "group_type" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiment_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_subjects" (
    "id" SERIAL NOT NULL,
    "experiment_id" INTEGER NOT NULL,
    "group_id" INTEGER,
    "subject_code" VARCHAR(255) NOT NULL,
    "sex" VARCHAR(50),
    "genotype" VARCHAR(255),
    "subject_type" VARCHAR(100),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiment_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_team_members" (
    "id" SERIAL NOT NULL,
    "experiment_id" INTEGER NOT NULL,
    "member_name" VARCHAR(255) NOT NULL,
    "member_role" VARCHAR(255),
    "member_email" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiment_team_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "experiment_groups" ADD CONSTRAINT "experiment_groups_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_subjects" ADD CONSTRAINT "experiment_subjects_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_subjects" ADD CONSTRAINT "experiment_subjects_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "experiment_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment_team_members" ADD CONSTRAINT "experiment_team_members_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
