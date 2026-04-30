import { RoleBadge } from "@/components/RoleBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { roleLabel } from "@/lib/formatters";
import type { Dataset, ProjectType } from "@/types/models";

export function DatasetDetailDrawer({
  dataset,
  projectTypes,
  onClose,
}: {
  dataset: Dataset | null;
  projectTypes: ProjectType[];
  onClose: () => void;
}) {
  if (!dataset) return null;

  const projectTypeName = (projectTypeId: string) =>
    projectTypes.find((projectType) => projectType.id === projectTypeId)?.name ?? projectTypeId;
  const stageName = (stageId: string) => {
    for (const projectType of projectTypes) {
      const stage = projectType.stages.find((item) => item.id === stageId);
      if (stage) return stage.name;
    }
    return stageId;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Dataset detail</p>
            <h2 className="mt-2 text-2xl font-extrabold text-brand-heading">{dataset.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{dataset.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status={dataset.status} />
          {dataset.clientSpecific ? (
            <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
              Client-specific
            </span>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-bold text-brand-heading">Catalogue profile</h3>
            <dl className="mt-3 space-y-3 text-sm text-slate-700">
              <div><dt className="font-semibold">Data class</dt><dd>{dataset.dataClass}</dd></div>
              <div><dt className="font-semibold">Product family</dt><dd>{dataset.productFamily}</dd></div>
              <div><dt className="font-semibold">ISO / category</dt><dd>{dataset.isoCategory ?? "Not supplied"}</dd></div>
              <div><dt className="font-semibold">Supplier</dt><dd>{dataset.supplier}</dd></div>
              <div><dt className="font-semibold">Coverage</dt><dd>{dataset.coverage}</dd></div>
              <div><dt className="font-semibold">Origin business unit</dt><dd>{dataset.originBusinessUnit}</dd></div>
              <div><dt className="font-semibold">Open / proprietary</dt><dd>{dataset.openProprietary}</dd></div>
            </dl>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-bold text-brand-heading">Admin metadata</h3>
            <dl className="mt-3 space-y-3 text-sm text-slate-700">
              <div><dt className="font-semibold">Catalogue status</dt><dd>{dataset.catalogueStatus}</dd></div>
              <div><dt className="font-semibold">Product status</dt><dd>{dataset.productStatus}</dd></div>
              <div><dt className="font-semibold">Desired / gap item</dt><dd>{dataset.desiredGap ? "Yes" : "No"}</dd></div>
              <div><dt className="font-semibold">Exists in catalogue</dt><dd>{dataset.existsInCatalogue ? "Yes" : "No"}</dd></div>
              <div><dt className="font-semibold">Exists as product</dt><dd>{dataset.existsAsProduct ? "Yes" : "No"}</dd></div>
              <div><dt className="font-semibold">Confidence level</dt><dd>{dataset.confidenceLevel}</dd></div>
            </dl>
          </article>
        </div>

        <article className="mt-6 rounded-2xl border border-slate-200 p-4">
          <h3 className="text-lg font-bold text-brand-heading">Lifecycle use</h3>
          <div className="mt-4 space-y-4">
            {dataset.lifecycleUses.map((use) => (
              <div key={use.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-semibold text-brand-heading">
                      {projectTypeName(use.projectTypeId)} · {stageName(use.lifecycleStageId)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{use.usageExplanation}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <RoleBadge role={use.primaryRole} />
                    {use.secondaryRole ? <RoleBadge role={use.secondaryRole} /> : null}
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Classification strength: {use.classificationStrength} · Confidence: {use.confidence} · Primary role:{" "}
                  {roleLabel[use.primaryRole]}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
