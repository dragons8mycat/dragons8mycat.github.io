import datasetsJson from "@/data/fixtures/datasets.json";
import projectTypesJson from "@/data/fixtures/project-types.json";
import proposalsJson from "@/data/fixtures/proposals.json";
import { datasetSchema, dataProposalSchema, projectTypeSchema } from "@/types/schemas";
import type { DataProposal, Dataset, ProjectType } from "@/types/models";

const projectTypes: ProjectType[] = projectTypeSchema.array().parse(projectTypesJson);
const datasets: Dataset[] = datasetSchema.array().parse(datasetsJson);
const proposals: DataProposal[] = dataProposalSchema.array().parse(proposalsJson);

export const fixtureRepository = {
  getProjectTypes: () => projectTypes,
  getDatasets: () => datasets,
  getProposals: () => proposals,
};
