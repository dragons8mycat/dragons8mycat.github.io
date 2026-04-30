import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { fixtureRepository } from "@/data/repository";
import { useMockSession } from "@/app/MockSessionContext";
import { getDatasetsNeedingClassification, getMostUsedDatasets, getVisibleDatasets, scoreGapDatasets } from "@/lib/catalogue";
import { statusLabel } from "@/lib/formatters";
import { DataTable } from "@/components/DataTable";
import { KPICard } from "@/components/KPICard";
import type { GapPriorityRow } from "@/lib/catalogue";

export function GapsPrioritisationPage() {
  const { role } = useMockSession();
  const datasets = getVisibleDatasets(fixtureRepository.getDatasets(), role);
  const gapRows = useMemo(() => scoreGapDatasets(datasets), [datasets]);
  const mostUsed = useMemo(() => getMostUsedDatasets(datasets), [datasets]);
  const needsClassification = useMemo(() => getDatasetsNeedingClassification(datasets), [datasets]);
  const projectTypes = fixtureRepository.getProjectTypes();

  const columns = useMemo<ColumnDef<GapPriorityRow>[]>(
    () => [
      {
        header: "Desired dataset",
        cell: ({ row }) => (
          <div>
            <div className="font-bold text-brand-heading">{row.original.dataset.name}</div>
            <div className="mt-1 text-xs text-slate-500">{row.original.dataset.usageSummary}</div>
          </div>
        ),
      },
      { header: "Family", cell: ({ row }) => row.original.dataset.productFamily },
      { header: "Status", cell: ({ row }) => statusLabel[row.original.dataset.status] },
      { header: "Project types", cell: ({ row }) => row.original.projectTypeCount },
      { header: "Lifecycle stages", cell: ({ row }) => row.original.stageCount },
      { header: "Signal score", cell: ({ row }) => row.original.requestedBySignals },
      { header: "Priority score", cell: ({ row }) => row.original.score },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KPICard label="Total catalogue datasets" value={datasets.length} />
        <KPICard label="Desired / gap datasets" value={gapRows.length} />
        <KPICard label="Most-used datasets tracked" value={mostUsed.length} hint={mostUsed.map((item) => item.name).join(", ")} />
        <KPICard label="Most-requested desired datasets" value={gapRows.slice(0, 3).map((item) => item.dataset.name).join(", ")} />
        <KPICard label="Datasets needing classification" value={needsClassification.length} />
      </section>

      <section className="panel p-6">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Gaps & Prioritisation</p>
            <h2 className="text-2xl font-extrabold text-brand-heading">Prioritise desired datasets and strategic gaps</h2>
            <p className="mt-2 max-w-4xl text-sm text-slate-600">
              Scores consider lifecycle stage breadth, project type impact, catalogue/product availability, request
              signal, and confidence.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <DataTable data={gapRows} columns={columns} />
        </div>
      </section>

      <section className="panel overflow-hidden p-6">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Gap matrix</p>
            <h2 className="text-2xl font-extrabold text-brand-heading">Desired datasets by project type</h2>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-brand-blue text-white">
                <th className="px-4 py-3 text-left font-bold">Dataset</th>
                {projectTypes.map((projectType) => (
                  <th key={projectType.id} className="px-4 py-3 text-center font-bold">
                    {projectType.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gapRows.map((row) => (
                <tr key={row.dataset.id} className="border-b border-slate-200">
                  <td className="px-4 py-3">
                    <div className="font-bold text-brand-heading">{row.dataset.name}</div>
                    <div className="text-xs text-slate-500">{row.dataset.productFamily}</div>
                  </td>
                  {projectTypes.map((projectType) => {
                    const uses = row.dataset.lifecycleUses.filter((use) => use.projectTypeId === projectType.id);
                    return (
                      <td key={projectType.id} className="px-4 py-3 text-center">
                        {uses.length > 0 ? (
                          <div className="inline-flex flex-col rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800">
                            <span>{uses.length} stages</span>
                            <span>{uses.map((use) => use.lifecycleStageId.split("-").slice(1).join(" ")).slice(0, 2).join(", ")}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">–</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
