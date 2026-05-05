import { useMemo, useState } from "react";
import { fixtureRepository } from "@/data/repository";
import { useMockSession } from "@/app/MockSessionContext";
import {
  getLifecycleUsesForStage,
  getProjectTypeById,
  getTouchpointRows,
  getVisibleDatasets,
  matchText,
  splitPrimaryAndWeakUses,
  uniqueValues,
} from "@/lib/catalogue";
import { roleLabel, statusLabel } from "@/lib/formatters";
import { DatasetDetailDrawer } from "@/components/DatasetDetailDrawer";
import { LifecycleStageSelector } from "@/components/LifecycleStageSelector";
import { FilterBar } from "@/components/FilterBar";
import { RoleBadge } from "@/components/RoleBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { TouchpointMatrix } from "@/components/TouchpointMatrix";
import type { Dataset, DatasetLifecycleUse, DatasetRole } from "@/types/models";

type ViewMode = "touchpoint" | "role-led";
type AvailabilityFilter =
  | "all"
  | "catalogue"
  | "product"
  | "required"
  | "missing-catalogue"
  | "not-productised";

const roleOrder: DatasetRole[] = ["analytical", "basemapping", "descriptive-contextual"];

function matchesAvailability(dataset: Dataset, filter: AvailabilityFilter) {
  switch (filter) {
    case "catalogue":
      return dataset.existsInCatalogue;
    case "product":
      return dataset.existsAsProduct;
    case "required":
      return dataset.desiredGap || dataset.status === "desired-gap" || dataset.status === "sme-input";
    case "missing-catalogue":
      return !dataset.existsInCatalogue;
    case "not-productised":
      return !dataset.existsAsProduct;
    default:
      return true;
  }
}

function roleSectionTitle(role: DatasetRole) {
  return roleLabel[role];
}

function roleSectionCopy(role: DatasetRole) {
  switch (role) {
    case "analytical":
      return "Used to test viability, rank options, or support decisions.";
    case "basemapping":
      return "Used to orient the site, frame the geography, or support mapping outputs.";
    case "descriptive-contextual":
      return "Used to explain context, briefing notes, or supporting evidence.";
    default:
      return "Needs stronger curation before leading the conversation.";
  }
}

export function SalesStageFinderPage() {
  const { role } = useMockSession();
  const projectTypes = fixtureRepository.getProjectTypes();
  const visibleDatasets = getVisibleDatasets(fixtureRepository.getDatasets(), role);
  const [projectTypeId, setProjectTypeId] = useState(projectTypes[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>("touchpoint");
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("all");
  const [familyFilter, setFamilyFilter] = useState("");
  const projectType = useMemo(() => getProjectTypeById(projectTypes, projectTypeId), [projectTypes, projectTypeId]);
  const [stageId, setStageId] = useState(projectType.stages[0].id);
  const [selectedDatasetId, setSelectedDatasetId] = useState("");
  const [drawerDataset, setDrawerDataset] = useState<Dataset | null>(null);

  const projectFamilies = useMemo(
    () =>
      uniqueValues(
        visibleDatasets
          .filter((dataset) => dataset.lifecycleUses.some((use) => use.projectTypeId === projectTypeId && use.isUsed))
          .map((dataset) => dataset.productFamily),
      ),
    [projectTypeId, visibleDatasets],
  );

  const projectDatasets = useMemo(
    () =>
      visibleDatasets.filter((dataset) => {
        if (!dataset.lifecycleUses.some((use) => use.projectTypeId === projectTypeId && use.isUsed)) return false;
        if (!matchText(dataset, search)) return false;
        if (familyFilter && dataset.productFamily !== familyFilter) return false;
        if (!matchesAvailability(dataset, availabilityFilter)) return false;
        return true;
      }),
    [availabilityFilter, familyFilter, projectTypeId, search, visibleDatasets],
  );

  const stageResults = useMemo(
    () => getLifecycleUsesForStage(projectDatasets, { projectTypeId, stageId, search: "" }),
    [projectDatasets, projectTypeId, stageId],
  );
  const grouped = useMemo(() => splitPrimaryAndWeakUses(stageResults), [stageResults]);
  const touchpointRows = useMemo(() => getTouchpointRows(projectDatasets, projectTypeId, ""), [projectDatasets, projectTypeId]);
  const selectedStage = projectType.stages.find((stage) => stage.id === stageId) ?? projectType.stages[0];

  const groupedByRole = useMemo(
    () =>
      roleOrder.map((roleKey) => ({
        role: roleKey,
        items: grouped.primary.filter((entry) => entry.use.primaryRole === roleKey),
      })),
    [grouped.primary],
  );

  const selectedStageEntry = useMemo(() => {
    const fromStage = stageResults.find((entry) => entry.dataset.id === selectedDatasetId);
    if (fromStage) return fromStage;
    return stageResults[0] ?? null;
  }, [selectedDatasetId, stageResults]);

  return (
    <>
      <section className="space-y-5">
        <div className="panel p-6">
          <div className="panel-header gap-5">
            <div>
              <p className="eyebrow">Sales</p>
              <h2 className="text-2xl font-extrabold text-brand-heading">Lifecycle stage finder</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Start with the touchpoint matrix for fast client conversations, then switch to the cleaner role-led
                view when you want a stage-specific answer.
              </p>
            </div>
            <div className="inline-flex rounded-full border border-slate-300 bg-slate-50 p-1">
              {(["touchpoint", "role-led"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold",
                    viewMode === mode ? "bg-brand-blue text-white" : "text-slate-700",
                  ].join(" ")}
                >
                  {mode === "touchpoint" ? "Lifecycle touchpoint view" : "Role-led stage view"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <FilterBar>
              <div>
                <label className="field-label">Industry</label>
                <select
                  value={projectTypeId}
                  onChange={(event) => {
                    setProjectTypeId(event.target.value);
                    setFamilyFilter("");
                  }}
                  className="field-input"
                >
                  {projectTypes.map((projectTypeOption) => (
                    <option key={projectTypeOption.id} value={projectTypeOption.id}>
                      {projectTypeOption.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Current stage</label>
                <select value={stageId} onChange={(event) => setStageId(event.target.value)} className="field-input">
                  {projectType.stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="xl:col-span-2">
                <label className="field-label">Data common name</label>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="field-input"
                  placeholder="Search datasets, suppliers, families, or usage"
                />
              </div>
              <div>
                <label className="field-label">Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(event) => setAvailabilityFilter(event.target.value as AvailabilityFilter)}
                  className="field-input"
                >
                  <option value="all">All data</option>
                  <option value="catalogue">In catalogue</option>
                  <option value="product">Available as product</option>
                  <option value="required">Required / desired</option>
                  <option value="missing-catalogue">Not in catalogue</option>
                  <option value="not-productised">Not productised</option>
                </select>
              </div>
              <div>
                <label className="field-label">Data group</label>
                <select
                  value={familyFilter}
                  onChange={(event) => setFamilyFilter(event.target.value)}
                  className="field-input"
                >
                  <option value="">All data groups</option>
                  {projectFamilies.map((family) => (
                    <option key={family} value={family}>
                      {family}
                    </option>
                  ))}
                </select>
              </div>
            </FilterBar>
          </div>
        </div>

        <div className="sticky top-3 z-20 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-panel backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-heading">{projectType.name} lifecycle stages</p>
              <p className="text-xs text-slate-500">The selected stage stays highlighted while you scroll.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {touchpointRows.length} datasets in current view
            </div>
          </div>
          <LifecycleStageSelector stages={projectType.stages} selectedStageId={stageId} onSelect={setStageId} />
        </div>
      </section>

      {viewMode === "touchpoint" ? (
        <section className="mt-6">
          <TouchpointMatrix
            datasets={touchpointRows}
            projectType={projectType}
            selectedStageId={stageId}
            onOpenDataset={setDrawerDataset}
          />
        </section>
      ) : (
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <article className="panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Stage answer</p>
                  <h3 className="text-2xl font-extrabold text-brand-heading">{selectedStage.name}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    The strongest lifecycle classifications are shown first so the answer stays clear while speaking
                    with a client.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Visible now</div>
                  <div className="mt-2 text-3xl font-extrabold text-brand-heading">{stageResults.length}</div>
                </div>
              </div>
            </article>

            {groupedByRole.map((group) =>
              group.items.length > 0 ? (
                <article key={group.role} className="panel p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-brand-heading">{roleSectionTitle(group.role)}</h3>
                      <p className="mt-1 text-sm text-slate-600">{roleSectionCopy(group.role)}</p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {group.items.length}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {group.items.map(({ dataset, use }) => (
                      <button
                        key={use.id}
                        type="button"
                        onClick={() => setSelectedDatasetId(dataset.id)}
                        className={[
                          "w-full rounded-3xl border p-4 text-left transition",
                          selectedStageEntry?.dataset.id === dataset.id
                            ? "border-brand-blue bg-sky-50"
                            : "border-slate-200 bg-white hover:border-brand-sky",
                        ].join(" ")}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h4 className="text-base font-bold text-brand-heading">{dataset.name}</h4>
                            <p className="mt-1 text-sm text-slate-600">{use.usageExplanation}</p>
                          </div>
                          <StatusBadge status={dataset.status} />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <RoleBadge role={use.primaryRole} />
                          {use.secondaryRole ? <RoleBadge role={use.secondaryRole} /> : null}
                        </div>
                        <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                          <div>
                            <dt className="font-semibold text-slate-700">Data group</dt>
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
                        <span className="mt-4 inline-flex text-sm font-semibold text-brand-blue">More information</span>
                      </button>
                    ))}
                  </div>
                </article>
              ) : null,
            )}

            {grouped.primary.length === 0 ? (
              <article className="panel p-6 text-sm text-slate-600">
                No strongly classified datasets match the current filters for this stage.
              </article>
            ) : null}

            {grouped.weak.length > 0 ? (
              <article className="panel border-dashed p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-extrabold text-brand-heading">Lower-confidence or unknown records</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    These are useful prompts when you need to ask for more client detail or flag a knowledge gap.
                  </p>
                </div>
                <div className="space-y-3">
                  {grouped.weak.map(({ dataset, use }) => (
                    <button
                      key={use.id}
                      type="button"
                      onClick={() => setSelectedDatasetId(dataset.id)}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-brand-sky"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-bold text-brand-heading">{dataset.name}</h4>
                          <p className="mt-1 text-sm text-slate-600">{use.usageExplanation}</p>
                        </div>
                        <RoleBadge role={use.primaryRole} />
                      </div>
                    </button>
                  ))}
                </div>
              </article>
            ) : null}
          </div>

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <StageDatasetDetailPanel
              entry={selectedStageEntry}
              projectType={projectType.name}
              stageName={selectedStage.name}
              onOpenDrawer={setDrawerDataset}
            />
          </aside>
        </section>
      )}

      <DatasetDetailDrawer dataset={drawerDataset} projectTypes={projectTypes} onClose={() => setDrawerDataset(null)} />
    </>
  );
}

function StageDatasetDetailPanel({
  entry,
  projectType,
  stageName,
  onOpenDrawer,
}: {
  entry: { dataset: Dataset; use: DatasetLifecycleUse } | null;
  projectType: string;
  stageName: string;
  onOpenDrawer: (dataset: Dataset) => void;
}) {
  if (!entry) {
    return (
      <article className="panel p-6">
        <p className="eyebrow">More information</p>
        <h3 className="mt-2 text-xl font-extrabold text-brand-heading">No dataset selected</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Choose a dataset from the stage list to see the fuller catalogue context on the right.
        </p>
      </article>
    );
  }

  const { dataset, use } = entry;
  const stageAppearances = dataset.lifecycleUses
    .filter((lifecycleUse) => lifecycleUse.projectTypeId === use.projectTypeId && lifecycleUse.isUsed)
    .map((lifecycleUse) => lifecycleUse.lifecycleStageId.split("-").slice(1).join(" "))
    .join(", ");

  return (
    <article className="panel p-6">
      <p className="eyebrow">More information</p>
      <h3 className="mt-2 text-2xl font-extrabold text-brand-heading">{dataset.name}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{dataset.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge status={dataset.status} />
        <RoleBadge role={use.primaryRole} />
        {use.secondaryRole ? <RoleBadge role={use.secondaryRole} /> : null}
      </div>

      <dl className="mt-6 grid gap-4 text-sm text-slate-700">
        <div>
          <dt className="font-semibold text-slate-500">Current industry and stage</dt>
          <dd className="mt-1 font-semibold text-brand-heading">
            {projectType} · {stageName}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">How it is used here</dt>
          <dd className="mt-1">{use.usageExplanation}</dd>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-500">Data group</dt>
            <dd className="mt-1">{dataset.productFamily}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Supplier</dt>
            <dd className="mt-1">{dataset.supplier}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Coverage</dt>
            <dd className="mt-1">{dataset.coverage}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Availability</dt>
            <dd className="mt-1">{statusLabel[dataset.status]}</dd>
          </div>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Lifecycle stages where it appears</dt>
          <dd className="mt-1">{stageAppearances || "No additional stages mapped"}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => onOpenDrawer(dataset)}
        className="mt-6 inline-flex rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white"
      >
        Open full dataset record
      </button>
    </article>
  );
}
