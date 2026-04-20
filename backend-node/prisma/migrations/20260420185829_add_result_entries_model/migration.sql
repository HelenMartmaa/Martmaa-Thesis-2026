-- CreateTable
CREATE TABLE "result_entries" (
    "id" SERIAL NOT NULL,
    "result_set_id" INTEGER NOT NULL,
    "subject_id" INTEGER,
    "group_id" INTEGER,
    "sample_code" VARCHAR(100),
    "group_label" VARCHAR(100),
    "sex" VARCHAR(20),
    "timepoint_value" DOUBLE PRECISION,
    "timepoint_unit" VARCHAR(20),
    "numeric_value" DOUBLE PRECISION NOT NULL,
    "event_occurred" INTEGER,
    "notes" TEXT,

    CONSTRAINT "result_entries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "result_entries" ADD CONSTRAINT "result_entries_result_set_id_fkey" FOREIGN KEY ("result_set_id") REFERENCES "result_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_entries" ADD CONSTRAINT "result_entries_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "experiment_subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_entries" ADD CONSTRAINT "result_entries_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "experiment_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
