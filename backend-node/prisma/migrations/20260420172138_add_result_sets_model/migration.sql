-- CreateTable
CREATE TABLE "result_sets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "experiment_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "experiment_type" VARCHAR(20) NOT NULL,
    "measurement_name" VARCHAR(255) NOT NULL,
    "measurement_unit" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_sets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "result_sets" ADD CONSTRAINT "result_sets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_sets" ADD CONSTRAINT "result_sets_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
