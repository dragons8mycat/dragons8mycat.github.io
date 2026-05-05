import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { fixtureRepository } from "@/data/repository";
import { useMockSession } from "@/app/MockSessionContext";
import { getVisibleDatasets, matchText, uniqueValues } from "@/lib/catalogue";
import { statusLabel } from "@/lib/formatters";
import { FilterBar } from "@/components/FilterBar";
import { RoleBadge } from "@/components/RoleBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { Dataset, DatasetStatus } from "@/types/models";

type SortOption = "name" | "family" | "supplier" | "usage" | "status";

interface DataFilters {
  search: string;
  family: string;
  businessUnit: string;
  stageId: string;
  sortBy: SortOption;
}

export function CatalogueExplorerPage() {
  const { role } = useMockSession();
  const projectTypes = fixtureRepository.getProjectTypes();
  const visibleDatasets = useMemo(() => getVisibleDatasets(fixtureRepository.getDatasets(), role), [role]);
  const [catalogue, setCatalogue] = useState<Dataset[]>(visibleDatasets);
  const [drafts, setDrafts] = useState<Record<string, Dataset>>({});
  const [selectedDatasetId, setSelectedDatasetId] = useState(visibleDatasets[0]?.id ?? "");
  const [editMode, setEditMode] = useState(false);
  const [confirmCommit, setConfirmCommit] = useState(false);
  const [filters, setFilters] = useState<DataFilters>({
    search: "",
    family: "",
    businessUnit: "",
    stageId: "",
    sortBy: "name",
  });

  const allStages = useMemo(
    () =>
      projectTypes.flatMap((projectType) =>
        projectType.stages.map((stage) => ({
          id: stage.id,
          label: `${projectType.name} · ${stage.name}`,
        })),
      ),
    [projectTypes],
  );

  const families = useMemo(() => uniqueValues(catalogue.map((dataset) => dataset.productFamily)), [catalogue]);
  const businessUnits = useMemo(() => uniqueValues(catalogue.map((dataset) => dataset.originBusinessUnit)), [catalogue]);

  const filteredDatasets = useMemo(() => {
    const filtered = catalogue.filter((dataset) => {
      if (!matchText(dataset, filters.search)) return false;
      if (filters.family && dataset.productFamily !== filters.family) return false;
      if (filters.businessUnit && dataset.originBusinessUnit !== filters.businessUnit) return false;
      if (filters.stageId && !dataset.lifecycleUses.some((use) => use.lifecycleStageId === filters.stageId && use.isUsed)) {
        return false;
      }
      return true;
    });

    return filtered.sort((left, right) => {
      switch (filters.sortBy) {
        case "family":
          return left.productFamily.localeCompare(right.productFamily) || left.name.localeCompare(right.name);
        case "supplier":
          return left.supplier.localeCompare(right.supplier) || left.name.localeCompare(right.name);
        case "usage":
          return right.lifecycleUses.length - left.lifecycleUses.length || left.name.localeCompare(right.name);
        case "status":
          return left.status.localeCompare(right.status) || left.name.localeCompare(right.name);
        default:
          return left.name.localeCompare(right.name);
      }
    });
  }, [catalogue, filters]);

  const selectedDataset =
    filteredDatasets.find((dataset) => dataset.id === selectedDatasetId) ??
    catalogue.find((dataset) => dataset.id === selectedDatasetId) ??
    filteredDatasets[0] ??
    catalogue[0] ??
    null;
  const draftDataset = selectedDataset ? drafts[selectedDataset.id] ?? selectedDataset : null;
  const pendingChangeCount = Object.keys(drafts).length;

  function updateDraft<K extends keyof Dataset>(key: K, value: Dataset[K]) {
    if (!selectedDataset) return;
    const current = drafts[selectedDataset.id] ?? selectedDataset;
    setDrafts((existing) => ({
      ...existing,
      [selectedDataset.id]: {
        ...current,
        [key]: value,
      },
    }));
  }

  function commitChanges() {
    setCatalogue((current) => current.map((dataset) => drafts[dataset.id] ?? dataset));
    setDrafts({});
    setConfirmCommit(false);
    setEditMode(false);
  }

  function discardChanges() {
    setDrafts({});
    setEditMode(false);
  }

  return (
    <>
      <section className="space-y-5">
        <div className="panel p-6">
          <div className="panel-header gap-5">
            <div>
              <p className="eyebrow">Data</p>
              <h2 className="text-2xl font-extrabold text-brand-heading">Catalogue workspace</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Browse the governed non-client catalogue, switch into edit mode when records need improvement, and
                commit changes only when you are ready.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/admin"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-sky hover:text-brand-blue"
              >
                Open admin queue
              </Link>
              <button
                type="button"
                onClick={() => setEditMode((current) => !current)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  editMode ? "bg-brand-orange text-white" : "border border-slate-300 text-slate-700 hover:border-brand-sky hover:text-brand-blue",
                ].join(" ")}
              >
                {editMode ? "Exit edit mode" : "Edit mode"}
              </button>
              {pendingChangeCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setConfirmCommit(true)}
                  className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-heading"
                >
                  Commit {pendingChangeCount} change{pendingChangeCount === 1 ? "" : "s"}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <FilterBar>
              <div className="xl:col-span-2">
                <label className="field-label">Common name</label>
                <input
                  value={filters.search}
                  onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                  className="field-input"
                  placeholder="Search by common name, supplier, family, coverage, or tags"
                />
              </div>
              <div>
                <label className="field-label">Data group</label>
                <select
                  value={filters.family}
                  onChange={(event) => setFilters((current) => ({ ...current, family: event.target.value }))}
                  className="field-input"
                >
                  <option value="">All data groups</option>
                  {families.map((family) => (
                    <option key={family} value={family}>
                      {family}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Business unit</label>
                <select
                  value={filters.businessUnit}
                  onChange={(event) => setFilters((current) => ({ ...current, businessUnit: event.target.value }))}
                  className="field-input"
                >
                  <option value="">All business units</option>
                  {businessUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Lifecycle stage</label>
                <select
                  value={filters.stageId}
                  onChange={(event) => setFilters((current) => ({ ...current, stageId: event.target.value }))}
                  className="field-input"
                >
                  <option value="">All lifecycle stages</option>
                  {allStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Sort by</label>
                <select
                  value={filters.sortBy}
                  onChange={(event) => setFilters((current) => ({ ...current, sortBy: event.target.value as SortOption }))}
                  className="field-input"
                >
                  <option value="name">Common name</option>
                  <option value="family">Data group</option>
                  <option value="supplier">Supplier</option>
                  <option value="usage">Lifecycle usage count</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </FilterBar>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="panel overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-heading">Catalogue records</p>
                  <p className="text-xs text-slate-500">Client-specific records are excluded from this user view.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {filteredDatasets.length} visible
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-brand-heading">Common name</th>
                    <th className="px-4 py-3 text-left font-bold text-brand-heading">Data group</th>
                    <th className="px-4 py-3 text-left font-bold text-brand-heading">Supplier</th>
                    <th className="px-4 py-3 text-left font-bold text-brand-heading">Business unit</th>
                    <th className="px-4 py-3 text-left font-bold text-brand-heading">Stages</th>
                    <th className="px-4 py-3 text-left font-bold text-brand-heading">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredDatasets.map((dataset) => {
                    const hasDraft = Boolean(drafts[dataset.id]);
                    const isSelected = dataset.id === selectedDataset?.id;
                    return (
                      <tr
                        key={dataset.id}
                        className={[
                          "cursor-pointer transition",
                          isSelected ? "bg-sky-50" : "hover:bg-slate-50",
                          hasDraft ? "ring-1 ring-inset ring-brand-orange/40" : "",
                        ].join(" ")}
                        onClick={() => setSelectedDatasetId(dataset.id)}
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="font-bold text-brand-heading">{dataset.name}</div>
                          <div className="mt-1 text-xs text-slate-500">{dataset.usageSummary}</div>
                        </td>
                        <td className="px-4 py-3 align-top text-slate-600">{dataset.productFamily}</td>
                        <td className="px-4 py-3 align-top text-slate-600">{dataset.supplier}</td>
                        <td className="px-4 py-3 align-top text-slate-600">{dataset.originBusinessUnit}</td>
                        <td className="px-4 py-3 align-top text-slate-600">{dataset.lifecycleUses.length}</td>
                        <td className="px-4 py-3 align-top">
                          <StatusBadge status={dataset.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <article className="panel p-6">
              {draftDataset ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">{editMode ? "Edit record" : "Record detail"}</p>
                      <h3 className="mt-2 text-2xl font-extrabold text-brand-heading">{draftDataset.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{draftDataset.description}</p>
                    </div>
                    <StatusBadge status={draftDataset.status} />
                  </div>

                  {editMode ? (
                    <div className="mt-6 grid gap-4">
                      <EditableField label="Common name">
                        <input
                          value={draftDataset.name}
                          onChange={(event) => updateDraft("name", event.target.value)}
                          className="field-input"
                        />
                      </EditableField>
                      <EditableField label="Usage summary">
                        <textarea
                          value={draftDataset.usageSummary}
                          onChange={(event) => updateDraft("usageSummary", event.target.value)}
                          className="field-input min-h-24"
                        />
                      </EditableField>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <EditableField label="Data group">
                          <input
                            value={draftDataset.productFamily}
                            onChange={(event) => updateDraft("productFamily", event.target.value)}
                            className="field-input"
                          />
                        </EditableField>
                        <EditableField label="Business unit">
                          <input
                            value={draftDataset.originBusinessUnit}
                            onChange={(event) => updateDraft("originBusinessUnit", event.target.value)}
                            className="field-input"
                          />
                        </EditableField>
                        <EditableField label="Supplier">
                          <input
                            value={draftDataset.supplier}
                            onChange={(event) => updateDraft("supplier", event.target.value)}
                            className="field-input"
                          />
                        </EditableField>
                        <EditableField label="Coverage">
                          <input
                            value={draftDataset.coverage}
                            onChange={(event) => updateDraft("coverage", event.target.value)}
                            className="field-input"
                          />
                        </EditableField>
                        <EditableField label="Status">
                          <select
                            value={draftDataset.status}
                            onChange={(event) => updateDraft("status", event.target.value as DatasetStatus)}
                            className="field-input"
                          >
                            {Object.entries(statusLabel).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </EditableField>
                        <EditableField label="Open / proprietary">
                          <select
                            value={draftDataset.openProprietary}
                            onChange={(event) => updateDraft("openProprietary", event.target.value as Dataset["openProprietary"])}
                            className="field-input"
                          >
                            <option value="open">Open</option>
                            <option value="proprietary">Proprietary</option>
                            <option value="mixed">Mixed</option>
                          </select>
                        </EditableField>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setConfirmCommit(true)}
                          className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
                        >
                          Commit changes
                        </button>
                        <button
                          type="button"
                          onClick={discardChanges}
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          Discard pending changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-6">
                      <dl className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
                        <InfoItem label="Data group" value={draftDataset.productFamily} />
                        <InfoItem label="Supplier" value={draftDataset.supplier} />
                        <InfoItem label="Coverage" value={draftDataset.coverage} />
                        <InfoItem label="Business unit" value={draftDataset.originBusinessUnit} />
                        <InfoItem label="Open / proprietary" value={draftDataset.openProprietary} />
                        <InfoItem label="Catalogue status" value={draftDataset.catalogueStatus} />
                      </dl>

                      <div>
                        <p className="text-sm font-semibold text-slate-500">Lifecycle usage</p>
                        <div className="mt-3 space-y-3">
                          {draftDataset.lifecycleUses.map((use) => {
                            const projectType = projectTypes.find((item) => item.id === use.projectTypeId);
                            const stage = projectType?.stages.find((item) => item.id === use.lifecycleStageId);
                            return (
                              <div key={use.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <div className="font-semibold text-brand-heading">
                                      {projectType?.name ?? use.projectTypeId} · {stage?.name ?? use.lifecycleStageId}
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600">{use.usageExplanation}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <RoleBadge role={use.primaryRole} />
                                    {use.secondaryRole ? <RoleBadge role={use.secondaryRole} /> : null}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-600">No dataset matches the current filters.</p>
              )}
            </article>
          </aside>
        </div>
      </section>

      {confirmCommit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <p className="eyebrow">Confirm commit</p>
            <h3 className="mt-2 text-2xl font-extrabold text-brand-heading">Apply staged catalogue changes?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This will update the local MVP state for {pendingChangeCount} dataset
              {pendingChangeCount === 1 ? "" : "s"} and clear the edit highlights.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={commitChanges}
                className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
              >
                Yes, commit
              </button>
              <button
                type="button"
                onClick={() => setConfirmCommit(false)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function EditableField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-orange/30 bg-orange-50/50 p-4">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
