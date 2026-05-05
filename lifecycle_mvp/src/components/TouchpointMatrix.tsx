import { RoleBadge } from "@/components/RoleBadge";
import { roleMarker } from "@/lib/formatters";
import type { Dataset, ProjectType } from "@/types/models";

export function TouchpointMatrix({
  datasets,
  projectType,
  selectedStageId,
  onOpenDataset,
}: {
  datasets: Dataset[];
  projectType: ProjectType;
  selectedStageId: string;
  onOpenDataset: (dataset: Dataset) => void;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Lifecycle touchpoint view</p>
            <h3 className="text-xl font-extrabold text-brand-heading">Comparative matrix</h3>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Datasets are listed on the left, stages run across the top, and each used touchpoint is marked by its
              primary role.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <RoleBadge role="analytical" compact />
            <RoleBadge role="basemapping" compact />
            <RoleBadge role="descriptive-contextual" compact />
            <RoleBadge role="unknown" compact />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-blue text-white">
              <th className="sticky left-0 z-10 min-w-80 border-r border-brand-blue bg-brand-blue px-4 py-3 text-left font-bold">
                Dataset
              </th>
              {projectType.stages.map((stage) => (
                <th
                  key={stage.id}
                  className={[
                    "min-w-40 border-l border-white/10 px-4 py-3 text-center align-bottom font-bold",
                    selectedStageId === stage.id ? "bg-brand-orange" : "",
                  ].join(" ")}
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">Stage {stage.sequence}</div>
                  <div className="mt-2">{stage.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datasets.map((dataset) => (
              <tr key={dataset.id} className="border-b border-slate-200">
                <td className="sticky left-0 z-[1] border-r border-slate-200 bg-white px-4 py-4 align-top">
                  <button type="button" onClick={() => onOpenDataset(dataset)} className="text-left">
                    <div className="font-bold text-brand-heading hover:text-brand-blue">{dataset.name}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      {dataset.productFamily} · {dataset.supplier}
                    </div>
                  </button>
                </td>
                {projectType.stages.map((stage) => {
                  const use = dataset.lifecycleUses.find(
                    (entry) => entry.projectTypeId === projectType.id && entry.lifecycleStageId === stage.id && entry.isUsed,
                  );

                  if (!use) {
                    return (
                      <td key={stage.id} className="px-4 py-4 text-center text-slate-300">
                        —
                      </td>
                    );
                  }

                  return (
                    <td
                      key={stage.id}
                      className={[
                        "px-4 py-4 text-center",
                        selectedStageId === stage.id ? "bg-orange-50" : "",
                      ].join(" ")}
                    >
                      <div className="inline-flex min-w-20 flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-extrabold text-white">
                          {roleMarker[use.primaryRole]}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600">{roleMarker[use.primaryRole]}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
