import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import { getExperimentByIdRequest, deleteExperimentRequest } from "../../../features/planning/planningApi";
import { Button } from "../../../components/ui/button";
import BackToTopButton from "../../../components/common/BackToTopButton";
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
  const navigate = useNavigate();
	const [deleteError, setDeleteError] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// FOr checking if the time for creating and updating experiment are the same
	const hasBeeenUpdated = (experiment) => {
		return experiment.updatedAt && experiment.updatedAt !== experiment.createdAt;
	};

	// For deleting existing experiment
	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			setDeleteError("");

			await deleteExperimentRequest(id, token);

			navigate("/planning/saved");
		} catch (err) {
			setDeleteError(err.response?.data?.error || "Failed to delete experiment.");
		} finally {
			setIsDeleting(false);
		}
	};
	// Formatting experiment type for better visual displayment
	const formatExperimentType = (value) => {
		if (value === "in_vivo") return "in vivo";
		if (value === "in_vitro") return "in vitro";
		return value;
	};

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
							{formatExperimentType(experiment.experimentType)}
						</div>

						<div>
							<span className="font-medium text-slate-900">Short description:</span>
							<p className="mt-1">{experiment.description || "No description provided."}</p>
						</div>

						<div>
							<span className="font-medium text-slate-900">Aim:</span>
							<p className="mt-1">{experiment.aim || "No aim provided."}</p>
						</div>

						<div>
							<span className="font-medium text-slate-900">Hypotheses:</span>
							{experiment.hypotheses?.length ? (
								<ul className="mt-2 list-disc space-y-2 pl-5">
									{experiment.hypotheses.map((item) => (
										<li key={item.id}>{item.hypothesisText}</li>
									))}
								</ul>
							) : (
								<p className="mt-1">No hypotheses provided.</p> // Hypotheses were added later and currently there are test experiments without them
							)}
						</div>

						<div>
							<span className="font-medium text-slate-900">Organism / subject:</span>{" "}
							{experiment.organismName || "Not specified."}
						</div>

						<div>
							<span className="font-medium text-slate-900">Status:</span>{" "}
							{experiment.status}
						</div>

						<div>
							<span className="font-medium text-slate-900">Start date:</span>{" "}
							{experiment.startDate
								? new Date(experiment.startDate).toLocaleDateString()
								: "Not specified."}
						</div>

						<div>
							<span className="font-medium text-slate-900">End date:</span>{" "}
							{experiment.endDate
								? new Date(experiment.endDate).toLocaleDateString()
								: "Not specified."}
						</div>

						<div>
							<span className="font-medium text-slate-900">Schedule notes:</span>
							<p className="mt-1">{experiment.scheduleNotes || "No schedule notes provided."}</p>
						</div>

						<div>
							<span className="font-medium text-slate-900">Methods:</span>
							<p className="mt-1">{experiment.methodsText || "No methods provided."}</p>
						</div>

						<div>
							<span className="font-medium text-slate-900">Resources:</span>
							<p className="mt-1">{experiment.resourcesText || "No resources provided."}</p>
						</div>

						<div>
							<span className="font-medium text-slate-900">Treatment plan:</span>
							<p className="mt-1">
								{experiment.treatmentPlanText || "No treatment plan provided."}
							</p>
						</div>

						<div>
							<span className="font-medium text-slate-900">General notes:</span>
							<p className="mt-1">{experiment.notes || "No additional notes provided."}</p>
						</div>

						<div>
							<p>
								<span className="font-medium text-slate-900">Created at:</span>{" "}
								{new Date(experiment.createdAt).toLocaleString()}
							</p>
							
							{hasBeeenUpdated(experiment) && (
								<p>
									<span className="font-medium text-slate-900">Updated at:</span>{" "}
									{new Date(experiment.updatedAt).toLocaleString()}
								</p>
							)}
						</div>

					</CardContent>
				</Card>
			)}			

			{showDeleteConfirm && (
				<div className="rounded-2xl border border-red-200 bg-red-50 p-4">
					<p className="text-sm font-medium text-red-800">
						Are you sure you want to delete this experiment?
{/* 						{window.scrollTo({ bottom: 0, behavior: "smooth" })} */}
					</p>
					<p className="mt-1 text-sm text-red-700">
						This action cannot be undone.
					</p>
					<div className="mt-4 flex flex-col gap-3 sm:flex-row">
						<Button
							type="button"
							variant="outline"
							className="border-red-300 text-red-700 hover:bg-red-100"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Yes, delete experiment"}
						</Button>

						<Button
							type="button"
							variant="outline"
							onClick={() => setShowDeleteConfirm(false)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-3 sm:flex-row">
				<Button asChild variant="outline">
					<Link to={`/planning/${id}/edit`}>Update Experiment</Link>
				</Button>

				<Button
					type="button"
					variant="destructive"
					onClick={() => setShowDeleteConfirm(true)}
				>
					Delete Experiment
				</Button>
			</div>

			<BackToTopButton />
    </section>
  );
}

export default ExperimentDetailPage;