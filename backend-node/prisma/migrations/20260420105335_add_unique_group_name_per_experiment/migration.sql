/*
  Warnings:

  - A unique constraint covering the columns `[experiment_id,name]` on the table `experiment_groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "experiment_groups_experiment_id_name_key" ON "experiment_groups"("experiment_id", "name");
