import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { fixtureRepository } from "@/data/repository";
import { useMockSession } from "@/app/MockSessionContext";
import { getCatalogueDatasets, getVisibleDatasets, uniqueValues, type CatalogueFilters } from "@/lib/catalogue";
import { statusLabel } from "@/lib/formatters";
import { DataTable } from "@/components/DataTable";
import { DatasetDetailDrawer } from "@/components/DatasetDetailDrawer";
import { FilterBar } from "@/components/FilterBar";
import { StatusBadge } from "@/components/StatusBadge";
import type { Dataset, DatasetRole } from "@/types/models";

export function CatalogueExplorerPage() {
  const { role } = useMockSession();
  const projectTypes = fixtureRepository.getProjectTypes();
  const datasets = getVisibleDatasets(fixtureRepository.getDatasets(), role);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [filters, setFilters] = useState<CatalogueFilters>({
    search: "",
    projectTypeId: "",
    productFamily: "",
    supplier: "",
    coverage: "",
    status: "",
    role: "",
  });

  const filtered = useMemo(() => getCatalogueDatasets(datasets, filters), [datasets, filters]);
  const families = useMemo(() => uniqueValues(datasets.map((dataset) => dataset.productFamily)), [datasets]);
  const suppliers = useMemo(() => uniqueValues(datasets.map((dataset) => dataset.supplier)), [datasets]);
  const coverages = useMemo(() => uniqueValues(datasets.map((dataset) => dataset.coverage)), [datasets]);

  const columns = useMemo<ColumnDef<Dataset>[]>(
    () => [
      {
        header: "Dataset name",
        cell: ({ row }) => {
          const dataset = row.original;
          return (
            <button type="button" onClick={() => setSelectedDataset(dataset)} className="text-left">
              <div className="font-bold text-brand-heading hover:text-brand-blue">{dataset.name}</div>
              <div className="mt-1 text-xs text-slate-500">{dataset.usageSummary}</div>
            </button>
          );
        },
      },
      { header: "Family", accessorKey: "productFamily" },
      { header: "Supplier", accessorKey: "supplier" },
      { header: "Coverage", accessorKey: "coverage" },
      { header: "Open / proprietary", accessorKey: "openProprietary" },
      {
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        header: "Project types used in",
        cell: ({ row }) =>
          uniqueValues(row.original.lifecycleUses.map((use) => projectTypes.find((projectType) => projectType.id === use.projectTypeId)?.name ?? use.projectTypeId)).join(", "),
      },
      {
        header: "Lifecycle usage count",
        cell: ({ row }) => row.original.lifecycleUses.length,
      },
    ],
    [projectTypes],
  );

  return (
    <>
      <section className="panel p-6">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Catalogue Explorer</p>
            <h2 className="text-2xl font-extrabold text-brand-heading">Browse the governed non-client catalogue</h2>
            <p className="mt-2 max-w-4xl text-sm text-slate-600">
              Client-specific records are excluded from this view unless the mock user role is set to admin.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <FilterBar>
            <div>
              <label className="field-label">Search</label>
              <input
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                className="field-input"
                placeholder="Search datasets, supplier, or family"
              />
            </div>
            <div>
              <label className="field-label">Project type</label>
              <select
                value={filters.projectTypeId}
                onChange={(event) => setFilters((current) => ({ ...current, projectTypeId: event.target.value }))}
                className="field-input"
              >
                <option value="">All project types</option>
                {projectTypes.map((projectType) => (
                  <option key={projectType.id} value={projectType.id}>
                    {projectType.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Data family</label>
              <select
                value={filters.productFamily}
                onChange={(event) => setFilters((current) => ({ ...current, productFamily: event.target.value }))}
                className="field-input"
              >
                <option value="">All families</option>
                {families.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Supplier</label>
              <select
                value={filters.supplier}
                onChange={(event) => setFilters((current) => ({ ...current, supplier: event.target.value }))}
                className="field-input"
              >
                <option value="">All suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Coverage</label>
              <select
                value={filters.coverage}
                onChange={(event) => setFilters((current) => ({ ...current, coverage: event.target.value }))}
                className="field-input"
              >
                <option value="">All coverage</option>
                {coverages.map((coverage) => (
                  <option key={coverage} value={coverage}>
                    {coverage}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Status</label>
              <select
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                className="field-input"
              >
                <option value="">All statuses</option>
                {Object.entries(statusLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Role</label>
              <select
                value={filters.role}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    role: event.target.value as DatasetRole | "",
                  }))
                }
                className="field-input"
              >
                <option value="">All roles</option>
                <option value="analytical">Analytical</option>
                <option value="basemapping">Basemapping</option>
                <option value="descriptive-contextual">Descriptive / contextual</option>
                <option value="unknown">Unknown / needs classification</option>
              </select>
            </div>
          </FilterBar>
        </div>

        <div className="mt-6">
          <DataTable data={filtered} columns={columns} />
        </div>
      </section>

      <DatasetDetailDrawer dataset={selectedDataset} projectTypes={projectTypes} onClose={() => setSelectedDataset(null)} />
    </>
  );
}
