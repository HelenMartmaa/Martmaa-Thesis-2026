import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import {
  createResultEntryRequest,
  getResultEntriesRequest,
} from "../../features/analysis/resultEntryApi";
import {
  getExperimentGroupsRequest,
  getExperimentSubjectsRequest,
} from "../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Creates one empty row for batch result entry input
const createEmptyRow = () => ({
  subjectId: "",
  groupId: "",
  sampleCode: "",
  groupLabel: "",
  sex: "",
  numericValue: "",
  timepointValue: "",
});

// Sets character counts for text box fields with max count
function CharacterCount({ current, max }) {
	return (
		<p className="text-xs text-slate-500">
			{current ?? 0}/{max}
		</p>
	);
}

// Displays and adds result entries for one result set in batch-table format
function ResultEntriesSection({ resultSetId, experimentId }) {
  const { token } = useAuth();

  const [entries, setEntries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [rows, setRows] = useState([createEmptyRow()]);
  const [entryMode, setEntryMode] = useState("numeric");
  const [timepointUnit, setTimepointUnit] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isLinkedExperiment = Boolean(experimentId);

  const loadEntries = async () => {
    try {
      const data = await getResultEntriesRequest(resultSetId, token);
      setEntries(data.entries);
    } catch (err) {
      setError("Failed to load result entries.");
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedExperimentData = async () => {
    if (!experimentId) {
      setGroups([]);
      setSubjects([]);
      return;
    }

    try {
      const groupsResponse = await getExperimentGroupsRequest(experimentId, token);
      setGroups(groupsResponse.groups || []);

      const subjectsResponse = await getExperimentSubjectsRequest(
        experimentId,
        token
      );
      setSubjects(subjectsResponse.subjects || []);
    } catch (err) {
      // Related planning data is optional for result entry creation
    }
  };

  useEffect(() => {
    loadEntries();
    loadRelatedExperimentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultSetId, experimentId, token]);

	const getSelectableSubjectsForRow = (row) => {
		if (!row.groupId) {
			return subjects;
		}

		return subjects.filter(
			(subject) => String(subject.groupId || "") === String(row.groupId)
		);
	};

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
    setError("");
  };

  const removeRow = (indexToRemove) => {
    setRows((prev) => prev.filter((_, index) => index !== indexToRemove));
    setError("");
  };

  const updateRow = (indexToUpdate, field, value) => {
    setRows((prev) =>
      prev.map((row, index) =>
        index === indexToUpdate ? { ...row, [field]: value } : row
      )
    );

    setError("");
  };

	const handleSubjectChange = (index, subjectId) => {
		const selectedSubject = subjects.find(
			(subject) => String(subject.id) === String(subjectId)
		);

		setRows((prev) =>
			prev.map((row, rowIndex) =>
				rowIndex === index
					? {
							...row,
							subjectId,
							groupId: selectedSubject?.groupId
								? String(selectedSubject.groupId)
								: "",
							sex: selectedSubject?.sex || row.sex || "",
						}
					: row
			)
		);

		setError("");
	};

  const toggleRowSex = (index, selectedSex) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              sex: row.sex === selectedSex ? "" : selectedSex,
            }
          : row
      )
    );

    setError("");
  };

  const resetBatchForm = () => {
    setRows([createEmptyRow()]);
    setEntryMode("numeric");
    setTimepointUnit("");
    setGeneralNotes("");
    setError("");
  };

  const handleSaveAllEntries = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setIsSaving(true);

      for (const row of rows) {
        if (entryMode === "numeric") {
          if (row.numericValue === "" || row.numericValue === null) {
            throw new Error("Each row must contain a numeric value.");
          }
        }

        if (entryMode === "timepoint") {
          if (row.timepointValue === "" || row.timepointValue === null) {
            throw new Error("Each row must contain a timepoint value.");
          }
        }

        const payload = {
          subjectId: isLinkedExperiment ? row.subjectId || null : null,
          groupId: isLinkedExperiment ? row.groupId || null : null,
          sampleCode: !isLinkedExperiment ? row.sampleCode || null : null,
          groupLabel: !isLinkedExperiment ? row.groupLabel || null : null,
          sex: row.sex || null,
          timepointValue:
            entryMode === "timepoint" ? row.timepointValue || null : null,
          timepointUnit: entryMode === "timepoint" ? timepointUnit || null : null,
          // Current backend requires numericValue. In timepoint mode we store 0 as a temporary fallback.
          numericValue: entryMode === "numeric" ? row.numericValue || null : 0,
          eventOccurred: null,
          notes: generalNotes || null,
        };

        await createResultEntryRequest(resultSetId, payload, token);
      }

      resetBatchForm();
      await loadEntries();
      setShowForm(false);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to save result entries."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Result Entries</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Add measured results in a compact table layout. Linked experiments use
            existing subjects and groups, while unlinked datasets use manual labels.
          </p>

          <Button type="button" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close form" : "Add result entries"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSaveAllEntries} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Label>Primary entry mode</Label>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={entryMode === "numeric" ? "default" : "outline"}
                  onClick={() => setEntryMode("numeric")}
                >
                  Numeric value
                </Button>

                <Button
                  type="button"
                  variant={entryMode === "timepoint" ? "default" : "outline"}
                  onClick={() => setEntryMode("timepoint")}
                >
                  Timepoint value
                </Button>
              </div>

              <p className="text-xs text-slate-500">
                Choose what kind of primary value you want to enter for this batch.
              </p>
            </div>

            {entryMode === "timepoint" && (
              <div className="space-y-2">
                <Label htmlFor="timepointUnit">Timepoint unit</Label>
                <Input
                  id="timepointUnit"
                  value={timepointUnit}
                  onChange={(event) => setTimepointUnit(event.target.value)}
                  placeholder="Example: h, day"
                />
              </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    {isLinkedExperiment ? (
                      <>
												<th className="px-3 py-3 text-left font-medium">
                      		{entryMode === "numeric" ? "Numeric value" : "Timepoint value"}
                    		</th>
                        <th className="px-3 py-3 text-left font-medium">Subject</th>
                        <th className="px-3 py-3 text-left font-medium">Group</th>
                      </>
                    ) : (
                      <>
                        <th className="px-3 py-3 text-left font-medium">
                          Sample code
                        </th>
                        <th className="px-3 py-3 text-left font-medium">
                          Group label
                        </th>
                      </>
                    )}


                    <th className="px-3 py-3 text-left font-medium">Sex</th>
                    <th className="px-3 py-3 text-left font-medium">Remove</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {rows.map((row, index) => (
                    <tr key={index}>
                      {isLinkedExperiment ? (
                        <>
													<td className="px-3 py-3 align-top">
														<Input
															type="number"
															step="any"
															value={
																entryMode === "numeric"
																	? row.numericValue
																	: row.timepointValue
															}
															onChange={(event) =>
																updateRow(
																	index,
																	entryMode === "numeric"
																		? "numericValue"
																		: "timepointValue",
																	event.target.value
																)
															}
															placeholder={
																entryMode === "numeric"
																	? "Enter value"
																	: "Enter timepoint"
															}
														/>
													</td>

													<td className="px-3 py-3 align-top">
														<select
															value={row.subjectId}
															onChange={(event) => handleSubjectChange(index, event.target.value)}
															className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
														>
															<option value="">No subject selected</option>
															{getSelectableSubjectsForRow(row).map((subject) => (
																<option key={subject.id} value={subject.id}>
																	{subject.subjectCode}
																</option>
															))}
														</select>
													</td>

													<td className="px-3 py-3 align-top">
														<select
															value={row.groupId}
															onChange={(event) => updateRow(index, "groupId", event.target.value)}
															className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
															disabled={Boolean(
																row.subjectId &&
																	subjects.find((subject) => String(subject.id) === String(row.subjectId))
																		?.groupId
															)}
														>
															<option value="">No group selected</option>
															{groups.map((group) => (
																<option key={group.id} value={group.id}>
																	{group.name} — {group.groupType}
																</option>
															))}
														</select>
													</td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-3 align-top">
                            <Input
                              value={row.sampleCode}
                              onChange={(event) =>
                                updateRow(index, "sampleCode", event.target.value)
                              }
                              placeholder="Example: SAMPLE-01"
                            />
                          </td>

                          <td className="px-3 py-3 align-top">
                            <Input
                              value={row.groupLabel}
                              onChange={(event) =>
                                updateRow(index, "groupLabel", event.target.value)
                              }
                              placeholder="Example: placebo group"
                            />
                          </td>
                        </>
                      )}

                      

                      <td className="px-3 py-3 align-top">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant={row.sex === "male" ? "default" : "outline"}
                            onClick={() => toggleRowSex(index, "male")}
                          >
                            Male
                          </Button>

                          <Button
                            type="button"
                            variant={row.sex === "female" ? "default" : "outline"}
                            onClick={() => toggleRowSex(index, "female")}
                          >
                            Female
                          </Button>
                        </div>
                      </td>

                      <td className="px-3 py-3 align-top">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeRow(index)}
                          disabled={rows.length === 1}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={addRow}>
                Add row
              </Button>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save all entries"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={resetBatchForm}
                disabled={isSaving}
              >
                Clear batch
              </Button>
            </div>
          </form>
        )}

      </CardContent>
    </Card>
  );
}

export default ResultEntriesSection;