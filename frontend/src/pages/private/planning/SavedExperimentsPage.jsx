import { useEffect, useState } from "react";
import useAuth from "../../../features/auth/useAuth";
import { getSavedExperimentsRequest } from "../../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import BackToTopButton from "../../../components/common/BackToTopButton";

// Page for listing saved experiments
function SavedExperimentsPage() {
  const { token } = useAuth();
  const [experiments, setExperiments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

	// Formatting experiment type for better visual displayment
	const formatExperimentType = (value) => {
		if (value === "in_vivo") return "in vivo";
		if (value === "in_vitro") return "in vitro";
		return value;
	};

  useEffect(() => {
    const loadExperiments = async () => {
      try {
        const data = await getSavedExperimentsRequest(token);
        setExperiments(data.experiments);
      } catch (err) {
        setError("Failed to load saved experiments.");
      } finally {
        setLoading(false);
      }
    };

    loadExperiments();
  }, [token]);

  const StatusMark = ({ isReady }) => (
		<span className={isReady ? "text-green-600" : "text-red-600"}>
			{isReady ? "✔" : "✘"}
		</span>
	);


  return (
    <section className="space-y-8">
      <div className="mb-8 space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Saved Experiments
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          View experiments previously saved under your account. Additional information about subject groups, subjects and team members can be added in detailed view.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading experiments...</p>}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && experiments.length === 0 && (
				<Card className="rounded-3xl border-slate-200 shadow-sm">
					<CardContent className="pt-6">
						<p className="text-sm text-slate-600">
							No saved experiments yet.
						</p>
					</CardContent>
				</Card>
      )}

			<div className="grid gap-4">
				{experiments.map((experiment) => (
					<Card key={experiment.id} className="rounded-3xl border-slate-200 shadow-sm">
						<CardHeader>
							<CardTitle className="text-lg">{experiment.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm text-slate-600">

							<p>
								<span className="font-medium text-slate-900">Type:</span>{" "}
								<i>{formatExperimentType(experiment.experimentType)}</i>
							</p>

							<p>
								<span className="font-medium text-slate-900">Organism / subject:</span>{" "}
								{experiment.organismName}
							</p>

							<p>
								<span className="font-medium text-slate-900">Status:</span>{" "}
								{experiment.status}
							</p>

							<p>
								<span className="font-medium text-slate-900">Created at:</span>{" "}
								{new Date(experiment.createdAt).toLocaleString()}
							</p>

							{experiment.updatedAt && experiment.updatedAt !== experiment.createdAt && (
								<div>
									<span className="font-medium text-slate-900">Updated at:</span>{" "}
									{new Date(experiment.updatedAt).toLocaleString()}
								</div>
							)}

							<div className="space-y-1 text-sm text-slate-600">
								<p className="flex items-center gap-2">
									<StatusMark isReady={experiment.groups?.length > 0} />
									Groups added
								</p>
								<p className="flex items-center gap-2">
									<StatusMark isReady={experiment.subjects?.length > 0} />
									Subjects added
								</p>
								<p className="flex items-center gap-2">
									<StatusMark isReady={experiment.teamMembers?.length > 0} />
									Team members added
								</p>
							</div>

							<div className="pt-2">
								<Button asChild variant="outline">
								<Link to={`/planning/${experiment.id}`}>Open detailed view</Link>
								</Button>
							</div>

						</CardContent>
					</Card>
				))}
			</div>
			<BackToTopButton />
    </section>
  );
}

export default SavedExperimentsPage;