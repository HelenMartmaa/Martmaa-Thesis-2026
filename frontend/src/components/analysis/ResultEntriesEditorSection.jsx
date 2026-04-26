import { useEffect, useState } from "react";
import useAuth from "../../features/auth/useAuth";
import { getExperimentGroupsRequest, getExperimentSubjectsRequest } from "../../features/planning/planningApi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Controlled table-style editor for result entry rows
function ResultEntriesEditorSection({
  experimentId,
  rows,
  setRows,
  generalNotes,
  setGeneralNotes,
  isSurvivalAnalysis,
  setIsSurvivalAnalysis,
	isTimecourseAnalysis,
	setIsTimecourseAnalysis,
}) {
  const { token } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);

  const isLinkedExperiment = Boolean(experimentId);

  const createEmptyRow = () => ({
    subjectId: "",
    groupId: "",
    sampleCode: "",
    groupLabel: "",
    sex: "",
    numericValue: "",
    timepointValue: "",
    eventOccurred: false,
  });

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
      setGroups([]);
      setSubjects([]);
    }
  };

  useEffect(() => {
    loadRelatedExperimentData();
  }, [experimentId, token]);

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeRow = (indexToRemove) => {
    setRows((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearBatch = () => {
    setRows([createEmptyRow()]);
    setGeneralNotes("");
  };

  const updateRow = (indexToUpdate, field, value) => {
    setRows((prev) =>
      prev.map((row, index) =>
        index === indexToUpdate ? { ...row, [field]: value } : row
      )
    );
  };

	const getSelectedSubjectForRow = (row) => {
		return subjects.find(
			(subject) => String(subject.id) === String(row.subjectId)
		);
	};

	const isSexLockedForRow = (row) => {
		const selectedSubject = getSelectedSubjectForRow(row);
		return Boolean(selectedSubject?.sex);
	};

  const getSelectableSubjectsForRow = (row) => {
    if (!row.groupId) {
      return subjects;
    }

    return subjects.filter(
      (subject) => String(subject.groupId || "") === String(row.groupId)
    );
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
  };

	const toggleRowSex = (index, selectedSex) => {
		setRows((prev) =>
			prev.map((row, rowIndex) => {
				if (rowIndex !== index) return row;

				if (isSexLockedForRow(row)) {
					return row;
				}

				return {
					...row,
					sex: row.sex === selectedSex ? "" : selectedSex,
				};
			})
		);
	};

  const handleNumericValueChange = (index, rawValue) => {
    let value = rawValue;

    value = value.replace(/[−–—]/g, "-");
    const shouldBeNegative = value.startsWith("-");
    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    value =
      parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");

    if (shouldBeNegative) {
      value = "-" + value;
    }

    if (value === "-.") {
      value = "-";
    }

    value = value.slice(0, 12);

    updateRow(index, "numericValue", value);
  };

  const handleTimepointValueChange = (index, rawValue) => {
    let value = rawValue;

    value = value.replace(/[−–—]/g, "-");
    const shouldBeNegative = value.startsWith("-");
    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    value =
      parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");

    if (shouldBeNegative) {
      value = "-" + value;
    }

    if (value === "-.") {
      value = "-";
    }

    value = value.slice(0, 12);

    updateRow(index, "timepointValue", value);
  };

/* 	const handleTimepointValueChange = (index, rawValue) => {
		let value = rawValue.replace(/[−–—]/g, "-");
		value = value.replace(/[^0-9.-]/g, "");

		const isNegative = value.startsWith("-");
		value = value.replace(/-/g, "");

		const parts = value.split(".");
		value = parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");

		if (isNegative) {
			value = "-" + value;
		}

		value = value.slice(0, 12);

		updateRow(index, "timepointValue", value);
	}; */

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Result Data Entries</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-s text-slate-500">
            Please use period/dot for decimal numbers. Only the primary analysis
            value field is required, other values are optional.
            <br />
            Statistical analysis can be conducted with saved datasets and entries
            in the "Saved Analysis Datasets" page.
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={isSurvivalAnalysis}
              onChange={(event) => {
								const checked = event.target.checked;

								setIsSurvivalAnalysis(checked);

								if (checked) {
									setIsTimecourseAnalysis(false);
								}
							}}
            />
            Survival/event analysis
          </label>
					<label className="flex items-center gap-2 text-sm font-medium text-slate-700">
						<input
							type="checkbox"
							checked={isTimecourseAnalysis}
							onChange={(event) => {
								const checked = event.target.checked;

								setIsTimecourseAnalysis(checked);

								if (checked) {
									setIsSurvivalAnalysis(false);
								}
							}}
						/>
						Time-course/growth analysis
					</label>
					
          <p className="text-xs text-slate-500">
            Enable survival/event analysis if the table should collect Kaplan-Meier style survival
            data instead of standard numeric values. Enable time-course/growth analysis if the table should collect data for doubling time and growth rate.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
								{isSurvivalAnalysis ? (
									<>
										<th>Event occurred</th>
										<th>Timepoint value</th>
									</>
								) : isTimecourseAnalysis ? (
									<>
										<th>Value</th>
										<th>Timepoint value</th>
									</>
								) : (
									<th>Value</th>
								)}

                {isLinkedExperiment ? (
                  <>
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
									{isSurvivalAnalysis ? (
										<>
											<td className="px-3 py-3 align-middle">
												<input
													className="flex mx-auto items-center gap-2 text-sm text-slate-700"
													type="checkbox"
													checked={Boolean(row.eventOccurred)}
													onChange={(event) =>
														updateRow(index, "eventOccurred", event.target.checked)
													}
												/>
											</td>

											<td className="px-3 py-3 align-middle">
												<Input
													type="text"
													inputMode="decimal"
													value={row.timepointValue}
													onChange={(event) =>
														handleTimepointValueChange(index, event.target.value)
													}
													placeholder="Enter timepoint"
												/>
											</td>
										</>
									) : isTimecourseAnalysis ? (
										<>
											<td className="px-3 py-3 align-middle">
												<Input
													type="text"
													inputMode="decimal"
													value={row.numericValue}
													onChange={(event) =>
														handleNumericValueChange(index, event.target.value)
													}
													placeholder="Enter value"
												/>
											</td>

											<td className="px-3 py-3 align-middle">
												<Input
													type="text"
													inputMode="decimal"
													value={row.timepointValue}
													onChange={(event) =>
														handleTimepointValueChange(index, event.target.value)
													}
													placeholder="Enter timepoint"
												/>
											</td>
										</>
									) : (
										<td className="px-3 py-3 align-middle">
											<Input
												type="text"
												inputMode="decimal"
												value={row.numericValue}
												onChange={(event) =>
													handleNumericValueChange(index, event.target.value)
												}
												placeholder="Enter value"
											/>
										</td>
									)}

                  {isLinkedExperiment ? (
                    <>
                      <td className="px-3 py-3 align-middle">
                        <select
                          value={row.subjectId}
                          onChange={(event) =>
                            handleSubjectChange(index, event.target.value)
                          }
                          className="flex mx-auto align-middle h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        >
                          <option value="">No subject selected</option>
                          {getSelectableSubjectsForRow(row).map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.subjectCode}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-3 align-middle">
                        <select
                          value={row.groupId}
                          onChange={(event) =>
                            updateRow(index, "groupId", event.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                          disabled={Boolean(
                            row.subjectId &&
                              subjects.find(
                                (subject) =>
                                  String(subject.id) === String(row.subjectId)
                              )?.groupId
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
                      <td className="px-3 py-3 align-middle">
                        <Input
                          value={row.sampleCode}
                          onChange={(event) =>
                            updateRow(index, "sampleCode", event.target.value)
                          }
                          placeholder="Example: SAMPLE-01"
                        />
                      </td>

                      <td className="px-3 py-3 align-middle">
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
                    <div className="flex flex-wrap gap-2 text-m">
											<Button
												type="button"
												variant={row.sex === "male" ? "default" : "outline"}
												onClick={() => toggleRowSex(index, "male")}
												disabled={isSexLockedForRow(row)}
												title={isSexLockedForRow(row) ? "Sex is inherited from the selected planned subject." : ""}
											>
												♂
											</Button>

											<Button
												type="button"
												variant={row.sex === "female" ? "default" : "outline"}
												onClick={() => toggleRowSex(index, "female")}
												disabled={isSexLockedForRow(row)}
												title={isSexLockedForRow(row) ? "Sex is inherited from the selected planned subject." : ""}
											>
												♀
											</Button>
                    </div>
										{isSexLockedForRow(row) && (
											<p className="mt-1 text-xs text-slate-500">
												Locked from planned subject.
											</p>
										)}
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <Button
                      type="button"
                      variant="destructive"
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
          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            className="border-emerald-200 bg-emerald-100 hover:text-emerald-800"
          >
            + Add row
          </Button>

          <Button type="button" variant="outline" onClick={clearBatch}>
            Clear batch
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}

export default ResultEntriesEditorSection;