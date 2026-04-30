import { RoleBadge } from "@/components/RoleBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { Dataset, DatasetLifecycleUse } from "@/types/models";

export function DatasetCard({
  dataset,
  lifecycleUse,
  onOpen,
}: {
  dataset: Dataset;
  lifecycleUse: DatasetLifecycleUse;
  onOpen: (dataset: Dataset) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(dataset)}
      className="panel flex w-full flex-col gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-sky hover:shadow-lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-brand-heading">{dataset.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{dataset.usageSummary}</p>
        </div>
        <StatusBadge status={dataset.status} />
      </div>
      <div className="flex flex-wrap gap-2">
        <RoleBadge role={lifecycleUse.primaryRole} />
        {lifecycleUse.secondaryRole ? <RoleBadge role={lifecycleUse.secondaryRole} /> : null}
      </div>
      <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
        <div>
          <dt className="font-semibold text-slate-700">Data family</dt>
          <dd>{dataset.productFamily}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-700">Supplier</dt>
          <dd>{dataset.supplier}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-700">Coverage</dt>
          <dd>{dataset.coverage}</dd>
        </div>
      </dl>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-brand-heading">Usage at this stage</p>
        <p className="mt-1">{lifecycleUse.usageExplanation}</p>
      </div>
      <div className="text-sm text-slate-500">
        Lifecycle stages where it appears:{" "}
        {dataset.lifecycleUses
          .map((use) => use.lifecycleStageId)
          .slice(0, 4)
          .join(", ")}
      </div>
    </button>
  );
}
