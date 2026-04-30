import { useMemo, useState } from "react";
import { fixtureRepository } from "@/data/repository";
import { useMockSession } from "@/app/MockSessionContext";
import { getLifecycleUsesForStage, getProjectTypeById, getTouchpointRows, getVisibleDatasets, splitPrimaryAndWeakUses } from "@/lib/catalogue";
import { roleLabel } from "@/lib/formatters";
import { KPICard } from "@/components/KPICard";
import { LifecycleStageSelector } from "@/components/LifecycleStageSelector";
import { DatasetCard } from "@/components/DatasetCard";
import { DatasetDetailDrawer } from "@/components/DatasetDetailDrawer";
import { FilterBar } from "@/components/FilterBar";
import { TouchpointMatrix } from "@/components/TouchpointMatrix";
import type { Dataset } from "@/types/models";

export function SalesStageFinderPage() {
  const { role } = useMockSession();
  const projectTypes = fixtureRepository.getProjectTypes();
  const visibleDatasets = getVisibleDatasets(fixtureRepository.getDatasets(), role);
  const [projectTypeId, setProjectTypeId] = useState(projectTypes[0].id);
  const [viewMode, setViewMode] = useState<"role-led" | "touchpoint">("role-led");
  const [search, setSearch] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const projectType = useMemo(() => getProjectTypeById(projectTypes, projectTypeId), [projectTypes, projectTypeId]);
  const [stageId, setStageId] = useState(projectType.stages[0].id);

  const stageResults = useMemo(
    () => getLifecycleUsesForStage(visibleDatasets, { projectTypeId, stageId, search }),
    [visibleDatasets, projectTypeId, stageId, search],
  );
  const grouped = useMemo(() => splitPrimaryAndWeakUses(stageResults), [stageResults]);
  const touchpointRows = useMemo(
    () => getTouchpointRows(visibleDatasets, projectTypeId, search),
    [visibleDatasets, projectTypeId, search],
  );

  const roleCounts = useMemo(
    () => ({
      analytical: grouped.primary.filter((item) => item.use.primaryRole === "analytical").length,
      basemapping: grouped.primary.filter((item) => item.use.primaryRole === "basemapping").length,
      descriptive: grouped.primary.filter((item) => item.use.primaryRole === "descriptive-contextual").length,
      weak: grouped.weak.length,
    }),
    [grouped],
  );

  const selectedStage = projectType.stages.find((stage) => stage.id === stageId) ?? projectType.stages[0];

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Relevant datasets at this stage" value={stageResults.length} hint="Visible to the current mock user role" />
        <KPICard label="Analytical records" value={roleCounts.analytical} hint="Highest-priority decision support" />
        <KPICard label="Basemapping records" value={roleCounts.basemapping} hint="Reference layers for spatial orientation" />
        <KPICard label="Needs classification" value={roleCounts.weak} hint="Lower-confidence items separated from core answers" />
      </section>

      <section className="panel mt-6 p-6">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Sales Stage Finder</p>
            <h2 className="text-2xl font-extrabold text-brand-heading">Answer client questions by stage</h2>
            <p className="mt-2 max-w-4xl text-sm text-slate-600">
              Start with the project type and lifecycle stage, then switch between a role-led explanation view and
              a lifecycle touchpoint matrix.
            </p>
          </div>
          <div className="inline-flex rounded-full border border-slate-300 bg-slate-50 p-1">
            {(["role-led", "touchpoint"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  viewMode === mode ? "bg-brand-blue text-white" : "text-slate-700",
                ].join(" ")}
              >
                {mode === "role-led" ? "Role-led stage view" : "Lifecycle touchpoint view"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <FilterBar>
            <div>
              <label className="field-label">Project type</label>
              <select
                value={projectTypeId}
                onChange={(event) => {
                  const nextProjectTypeId = event.target.value;
                  const nextProjectType = getProjectTypeById(projectTypes, nextProjectTypeId);
                  setProjectTypeId(nextProjectTypeId);
                  setStageId(nextProjectType.stages[0].id);
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
            <div className="xl:col-span-2">
              <label className="field-label">Search datasets, supplier, family, or description</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="field-input"
                placeholder="Search within the selected project type"
              />
            </div>
          </FilterBar>

          <LifecycleStageSelector stages={projectType.stages} selectedStageId={stageId} onSelect={setStageId} />
        </div>
      </section>

      {viewMode === "role-led" ? (
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <article className="panel p-6">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Role clusters</p>
                  <h3 className="text-xl font-extrabold text-brand-heading">
                    What data is used at {selectedStage.name} and how is it used?
                  </h3>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <h4 className="font-bold text-orange-900">{roleLabel.analytical}</h4>
                  <p className="mt-2 text-3xl font-extrabold text-orange-900">{roleCounts.analytical}</p>
                </div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                  <h4 className="font-bold text-sky-900">{roleLabel.basemapping}</h4>
                  <p className="mt-2 text-3xl font-extrabold text-sky-900">{roleCounts.basemapping}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <h4 className="font-bold text-emerald-900">{roleLabel["descriptive-contextual"]}</h4>
                  <p className="mt-2 text-3xl font-extrabold text-emerald-900">{roleCounts.descriptive}</p>
                </div>
              </div>
            </article>

            <div className="grid gap-4">
              {grouped.primary.map(({ dataset, use }) => (
                <DatasetCard key={use.id} dataset={dataset} lifecycleUse={use} onOpen={setSelectedDataset} />
              ))}
              {grouped.primary.length === 0 ? (
                <div className="panel p-6 text-sm text-slate-600">
                  No strong classifications match this stage and search. Try another stage or broaden the search.
                </div>
              ) : null}
            </div>

            {grouped.weak.length > 0 ? (
              <article className="panel border-dashed p-6">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Lower-confidence results</p>
                    <h3 className="text-xl font-extrabold text-brand-heading">Needs classification or stronger curation</h3>
                  </div>
                </div>
                <div className="mt-4 grid gap-4">
                  {grouped.weak.map(({ dataset, use }) => (
                    <DatasetCard key={use.id} dataset={dataset} lifecycleUse={use} onOpen={setSelectedDataset} />
                  ))}
                </div>
              </article>
            ) : null}
          </div>

          <aside className="space-y-6">
            <article className="panel p-6">
              <p className="eyebrow">Primary question</p>
              <h3 className="text-xl font-extrabold text-brand-heading">What data is used at this stage and how?</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This view keeps unknown or weakly classified records out of the main answer. Sales users see the
                strongest lifecycle roles first, while Product and Data teams can still inspect the weaker signals.
              </p>
            </article>
            <article className="panel p-6">
              <p className="eyebrow">Selected stage</p>
              <h3 className="text-xl font-extrabold text-brand-heading">{selectedStage.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use the lifecycle touchpoint view when you need a fast cross-stage matrix while speaking with a client.
              </p>
            </article>
          </aside>
        </section>
      ) : (
        <section className="mt-6">
          <TouchpointMatrix
            datasets={touchpointRows}
            projectType={projectType}
            selectedStageId={stageId}
            onOpenDataset={setSelectedDataset}
          />
        </section>
      )}

      <DatasetDetailDrawer dataset={selectedDataset} projectTypes={projectTypes} onClose={() => setSelectedDataset(null)} />
    </>
  );
}
