import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getExperimentByIdRequest } from "../../../features/planning/planningApi";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

// Shows the details of one saved experiment
function ExperimentDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [experiment, setExperiment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperiment = async () => {
      try {
        const data = await getExperimentByIdRequest(id, token);
        setExperiment(data.experiment);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load experiment.");
      } finally {
        setLoading(false);
      }
    };

    loadExperiment();
  }, [id, token]);

  return (
    <section className="space-y-6">
			{/* Secondary navigation back to saved experiments list */}
			<div>
				<Button asChild variant="outline">
					<Link to="/planning/saved">⮜ Back to experiments list</Link>
				</Button>
			</div>
			<div className="mb-8 space-y-3">
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Experiment Details
				</h1>
				<p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
					Review the main details of a saved experiment plan.
				</p>
			</div>

			{loading && (
				<p className="text-sm text-slate-500">Loading experiment...</p>
			)}

			{error && (
				<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{!loading && !error && experiment && (
				<Card className="rounded-3xl border-slate-200 shadow-sm">
					<CardHeader>
						<CardTitle className="text-xl sm:text-2xl">
							{experiment.title}
						</CardTitle>
						<CardDescription>
							Main information about the selected experiment.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4 text-sm leading-6 text-slate-600">
						<div>
							<span className="font-medium text-slate-900">
								Experiment type:
							</span>{" "}
							{experiment.experimentType}
						</div>

						<div>
							<span className="font-medium text-slate-900">Status:</span>{" "}
							{experiment.status}
						</div>

						<div>
							<span className="font-medium text-slate-900">Created at:</span>{" "}
							{new Date(experiment.createdAt).toLocaleString()}
						</div>

						<div>
							<span className="font-medium text-slate-900">Description:</span>
							<p className="mt-1">
								{experiment.description || "No description provided."}
							</p>
						</div>
					</CardContent>
				</Card>
			)}
    </section>
  );
}

export default ExperimentDetailPage;