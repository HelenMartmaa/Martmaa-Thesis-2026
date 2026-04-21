import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Displays saved result entries in a compact table
function ResultEntriesTable({ entries, isLinkedExperiment }) {
  const isSurvivalAnalysis = entries.some(
    (entry) =>
      (entry.timepointValue !== null && entry.timpointValue !==undefined) ||
      entry.eventOccurred === 0 ||
      entry.eventOccurred === 1
  );

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Saved Result Entries</CardTitle>
      </CardHeader>

      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-500">No result entries added yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {isSurvivalAnalysis ? (
                    <>
                      <th className="px-3 py-3 text-left font-medium">
                        Event occurred
                      </th>
                      <th className="px-3 py-3 text-left font-medium">
                        Timepoint value
                      </th>
                    </>
                  ) : (
                    <th className="px-3 py-3 text-left font-medium">Value</th>
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
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    {isSurvivalAnalysis ? (
                      <>
                        <td className="px-3 py-3 align-top">
                          {entry.eventOccurred === 1 ? (
                            <span
                              className="inline-flex items-center rounded-full px-2 py-1 bg-emerald-200 text-m font-medium text-emerald-700"
                              aria-label="Event occurred"
                            >
                              ✔
                            </span>
                          ) : entry.eventOccurred === 0 ? (
                            <span
                              className="inline-flex items-center rounded-full px-2 py-1 bg-red-200 text-m font-medium text-red-700"
                              aria-label="Event did not occur"
                            >
                              ✘
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="px-3 py-3 align-top">
                          {entry.timepointValue ?? "—"}
                        </td>
                      </>
                    ) : (
                      <td className="px-3 py-3 align-top">
                        {entry.numericValue ?? "—"}
                      </td>
                    )}

                    {isLinkedExperiment ? (
                      <>
                        <td className="px-3 py-3 align-top">
                          {entry.subject?.subjectCode || "—"}
                        </td>
                        <td className="px-3 py-3 align-top">
                          {entry.group
                            ? `${entry.group.name} — ${entry.group.groupType}`
                            : "—"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-3 align-top">
                          {entry.sampleCode || "—"}
                        </td>
                        <td className="px-3 py-3 align-top">
                          {entry.groupLabel || "—"}
                        </td>
                      </>
                    )}

                    <td className="px-3 py-3 align-top">{entry.sex || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResultEntriesTable;