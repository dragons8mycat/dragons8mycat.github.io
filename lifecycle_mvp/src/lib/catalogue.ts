import type {
  DataProposal,
  Dataset,
  DatasetLifecycleUse,
  DatasetRole,
  ProjectType,
  UserRole,
} from "@/types/models";

export interface CatalogueFilters {
  search: string;
  projectTypeId?: string;
  productFamily?: string;
  supplier?: string;
  coverage?: string;
  status?: string;
  role?: DatasetRole | "";
}

export interface SalesStageFilters {
  projectTypeId: string;
  stageId: string;
  search: string;
}

export function getVisibleDatasets(datasets: Dataset[], role: UserRole): Dataset[] {
  return datasets.filter((dataset) => role === "admin" || !dataset.clientSpecific);
}

export function getVisibleProposals(proposals: DataProposal[], role: UserRole): DataProposal[] {
  return proposals.filter((proposal) => role === "admin" || !proposal.clientSpecific);
}

export function matchText(dataset: Dataset, search: string): boolean {
  if (!search.trim()) return true;
  const haystack = [
    dataset.name,
    dataset.description,
    dataset.productFamily,
    dataset.supplier,
    dataset.coverage,
    dataset.usageSummary,
    ...dataset.tags,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(search.trim().toLowerCase());
}

export function getLifecycleUsesForStage(
  datasets: Dataset[],
  filters: SalesStageFilters,
): Array<{ dataset: Dataset; use: DatasetLifecycleUse }> {
  return datasets
    .flatMap((dataset) =>
      dataset.lifecycleUses
        .filter(
          (use) =>
            use.projectTypeId === filters.projectTypeId &&
            use.lifecycleStageId === filters.stageId &&
            use.isUsed &&
            matchText(dataset, filters.search),
        )
        .map((use) => ({ dataset, use })),
    )
    .sort((left, right) => {
      const leftScore = rankingWeight(left.use.primaryRole, left.use.classificationStrength);
      const rightScore = rankingWeight(right.use.primaryRole, right.use.classificationStrength);
      return rightScore - leftScore || left.dataset.name.localeCompare(right.dataset.name);
    });
}

function rankingWeight(role: DatasetRole, strength: DatasetLifecycleUse["classificationStrength"]): number {
  const base = { analytical: 40, basemapping: 30, "descriptive-contextual": 20, unknown: 5 }[role];
  return strength === "strong" ? base + 5 : base;
}

export function splitPrimaryAndWeakUses(stageResults: Array<{ dataset: Dataset; use: DatasetLifecycleUse }>) {
  return {
    primary: stageResults.filter(
      (entry) => entry.use.primaryRole !== "unknown" && entry.use.classificationStrength === "strong",
    ),
    weak: stageResults.filter(
      (entry) => entry.use.primaryRole === "unknown" || entry.use.classificationStrength === "weak",
    ),
  };
}

export function getTouchpointRows(datasets: Dataset[], projectTypeId: string, search: string) {
  return datasets
    .filter(
      (dataset) =>
        dataset.lifecycleUses.some((use) => use.projectTypeId === projectTypeId && use.isUsed) &&
        matchText(dataset, search),
    )
    .sort((a, b) => {
      const scoreA = a.lifecycleUses.filter((use) => use.projectTypeId === projectTypeId && use.isUsed).length;
      const scoreB = b.lifecycleUses.filter((use) => use.projectTypeId === projectTypeId && use.isUsed).length;
      return scoreB - scoreA || a.name.localeCompare(b.name);
    });
}

export function getCatalogueDatasets(datasets: Dataset[], filters: CatalogueFilters): Dataset[] {
  return datasets.filter((dataset) => {
    if (!matchText(dataset, filters.search)) return false;
    if (filters.projectTypeId && !dataset.lifecycleUses.some((use) => use.projectTypeId === filters.projectTypeId)) {
      return false;
    }
    if (filters.productFamily && dataset.productFamily !== filters.productFamily) return false;
    if (filters.supplier && dataset.supplier !== filters.supplier) return false;
    if (filters.coverage && dataset.coverage !== filters.coverage) return false;
    if (filters.status && dataset.status !== filters.status) return false;
    if (filters.role && !dataset.lifecycleUses.some((use) => use.primaryRole === filters.role || use.secondaryRole === filters.role)) {
      return false;
    }
    return true;
  });
}

export function uniqueValues(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export interface GapPriorityRow {
  dataset: Dataset;
  stageCount: number;
  projectTypeCount: number;
  requestedBySignals: number;
  score: number;
}

export function scoreGapDatasets(datasets: Dataset[]): GapPriorityRow[] {
  return datasets
    .filter((dataset) => dataset.desiredGap)
    .map((dataset) => {
      const stageCount = dataset.lifecycleUses.length;
      const projectTypeCount = new Set(dataset.lifecycleUses.map((use) => use.projectTypeId)).size;
      const requestedBySignals =
        (dataset.status === "desired-gap" ? 2 : 0) +
        (dataset.status === "sme-input" ? 1 : 0) +
        (dataset.confidenceLevel === "high" ? 2 : dataset.confidenceLevel === "medium" ? 1 : 0);
      const score =
        stageCount * 5 +
        projectTypeCount * 7 +
        (dataset.existsInCatalogue ? 1 : 5) +
        (dataset.existsAsProduct ? 0 : 4) +
        requestedBySignals;
      return { dataset, stageCount, projectTypeCount, requestedBySignals, score };
    })
    .sort((left, right) => right.score - left.score || left.dataset.name.localeCompare(right.dataset.name));
}

export function getMostUsedDatasets(datasets: Dataset[]): Dataset[] {
  return [...datasets]
    .sort((left, right) => right.lifecycleUses.length - left.lifecycleUses.length || left.name.localeCompare(right.name))
    .slice(0, 5);
}

export function getDatasetsNeedingClassification(datasets: Dataset[]): Dataset[] {
  return datasets.filter((dataset) =>
    dataset.lifecycleUses.some((use) => use.primaryRole === "unknown" || use.classificationStrength === "weak"),
  );
}

export function getProjectTypeById(projectTypes: ProjectType[], projectTypeId: string): ProjectType {
  const projectType = projectTypes.find((item) => item.id === projectTypeId);
  if (!projectType) {
    throw new Error(`Unknown project type: ${projectTypeId}`);
  }
  return projectType;
}
