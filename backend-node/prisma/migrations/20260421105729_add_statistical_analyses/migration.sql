-- CreateTable
CREATE TABLE "statistical_analyses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "result_set_id" INTEGER NOT NULL,
    "analysis_name" VARCHAR(255) NOT NULL,
    "grouping_mode" VARCHAR(50),
    "selected_metrics_json" TEXT,
    "selected_tests_json" TEXT,
    "filters_json" TEXT,
    "results_json" TEXT,
    "chart_config_json" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "statistical_analyses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "statistical_analyses" ADD CONSTRAINT "statistical_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistical_analyses" ADD CONSTRAINT "statistical_analyses_result_set_id_fkey" FOREIGN KEY ("result_set_id") REFERENCES "result_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
