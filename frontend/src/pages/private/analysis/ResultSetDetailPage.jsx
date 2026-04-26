import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/useAuth";
import {
  getResultSetByIdRequest,
  deleteResultSetRequest,
} from "../../../features/analysis/resultSetApi";
import { getResultEntriesRequest } from "../../../features/analysis/resultEntryApi";
import ResultEntriesTable from "../../../components/analysis/ResultEntriesTable";
import { Button } from "../../../components/ui/button";
import BackToTopButton from "../../../components/common/BackToTopButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const formatExperimentType = (value) => {
  if (value === "in_vivo") return "in vivo";
  if (value === "in_vitro") return "in vitro";
  return value;
};

// Shows the details of one saved result set
function ResultSetDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

	const [entries, setEntries] = useState([]);
  const [resultSet, setResultSet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteConfirmRef = useRef(null);

	useEffect(() => {
		const loadResultSet = async () => {
			try {
				const resultSetResponse = await getResultSetByIdRequest(id, token);
				setResultSet(resultSetResponse.resultSet);

				const entriesResponse = await getResultEntriesRequest(id, token);
				setEntries(entriesResponse.entries || []);
			} catch (err) {
				setError(err.response?.data?.error || "Failed to load result set.");
			} finally {
				setLoading(false);
			}
		};

		loadResultSet();
	}, [id, token]);

	const loadResultEntries = async () => {
		try {
			const data = await getResultEntriesRequest(id, token);
			setEntries(data.entries || []);
		} catch (err) {
			// Entries failure should not break the whole page
		}
	};

  useEffect(() => {
    if (showDeleteConfirm && deleteConfirmRef.current) {
      deleteConfirmRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      deleteConfirmRef.current.focus();
    }
  }, [showDeleteConfirm]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteResultSetRequest(id, token);

      navigate("/analysis/saved");
    } catch (err) {
      setDeleteError(err.response?.data?.error || "Failed to delete result set.");
    } finally {
      setIsDeleting(false);
    }
  };

	const relatedAnalysisCount =
		resultSet?.statisticalAnalyses?.length ||
		resultSet?.analyses?.length ||
		0;

	const isDatasetLocked = relatedAnalysisCount > 0;

  return (
    <section className="space-y-6">
      <div>
        <Button asChild variant="outline">
          <Link to="/analysis/saved">⮜ Back to result sets list</Link>
        </Button>
      </div>

      <div className="mb-8 space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Saved Result Dataset Details
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Review, update, delete an existing result dataset or run statistical analysis for it.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading result set...</p>}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && resultSet && (
        <div className="space-y-6">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                {resultSet.title}
              </CardTitle>
              <CardDescription>
                Main information about the selected result set.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
              <div>
                <span className="font-medium text-slate-900">Linked experiment:</span>{" "}
                {resultSet.experiment?.title || "None"}
              </div>

              <div>
                <span className="font-medium text-slate-900">Experiment type:</span>{" "}
                <i>{formatExperimentType(resultSet.experimentType)}</i>
              </div>

              <div>
                <span className="font-medium text-slate-900">Measurement name:</span>{" "}
                {resultSet.measurementName}
              </div>

              {resultSet.measurementUnit && (
                <div>
                  <span className="font-medium text-slate-900">Measurement unit:</span>{" "}
                  {resultSet.measurementUnit}
                </div>
              )}

              {resultSet.description && (
                <div>
                  <span className="font-medium text-slate-900">Description:</span>
                  <p className="mt-1">{resultSet.description}</p>
                </div>
              )}

              <div>
                <span className="font-medium text-slate-900">Created at:</span>{" "}
                {new Date(resultSet.createdAt).toLocaleString()}
              </div>

              {resultSet.updatedAt !== resultSet.createdAt && (
                <div>
                  <span className="font-medium text-slate-900">Updated at:</span>{" "}
                  {new Date(resultSet.updatedAt).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
					<div className="flex flex-col gap-3 sm:flex-row">          
						<Button asChild className="border-emerald-200 bg-emerald-100 hover:bg-emerald-200 text-slate-900">
							<Link to={`/analysis/result-sets/${id}/run-analysis`}>
								Run Statistical Analysis
							</Link>
						</Button>
          </div>
					<ResultEntriesTable
						entries={entries}
						isLinkedExperiment={Boolean(resultSet.experimentId)}
					/>

          {showDeleteConfirm && (
            <div
              ref={deleteConfirmRef}
              tabIndex="-1"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 outline-none"
            >
              <p className="text-sm font-medium text-red-800">
                Are you sure you want to delete this result set?
              </p>
              <p className="mt-1 text-sm text-red-700">
                This action cannot be undone.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, delete result set"}
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

          {deleteError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          )}

{/* 			This button will be used when the data entry logic has been improved for more massive data inserting */}
{/* 
					<div className="flex flex-col gap-3 sm:flex-row">          
						{resultSet.experimentId && (
							<Button asChild variant="outline">
								<Link to={`/analysis/new?experimentId=${resultSet.experimentId}`}>
									+ Add another data table
								</Link>
							</Button>
						)}
          </div> */}
						{isDatasetLocked ? (
							<div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
								<p className="font-medium">Dataset locked</p>
								<p className="mt-1">
									This dataset has already been used in a saved statistical analysis and can
									no longer be edited.
								</p>
							</div>
						) : (
							""
						)}
						
          <div className="flex flex-col gap-3 sm:flex-row">          
						{isDatasetLocked ? ( ""
						) : (
							<Button asChild>
								<Link to={`/analysis/result-sets/${id}/edit`}>
									Update Dataset
								</Link>
							</Button>
						)}

            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Dataset
            </Button>
          </div>
        </div>
      )}
			<BackToTopButton />
    </section>
  );
}

export default ResultSetDetailPage;