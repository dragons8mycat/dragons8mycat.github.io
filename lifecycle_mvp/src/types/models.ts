export type DatasetRole =
  | "analytical"
  | "basemapping"
  | "descriptive-contextual"
  | "unknown";

export type DatasetStatus =
  | "catalogue"
  | "desired-gap"
  | "product"
  | "sme-input"
  | "client-request";

export type ProposalStatus =
  | "draft"
  | "pending-review"
  | "approved"
  | "rejected"
  | "published";

export type UserRole = "sales" | "product" | "catalogue" | "admin";

export interface LifecycleStage {
  id: string;
  name: string;
  sequence: number;
  projectTypeId: string;
}

export interface ProjectType {
  id: string;
  name: string;
  shortName: string;
  stages: LifecycleStage[];
}

export interface DatasetLifecycleUse {
  id: string;
  datasetId: string;
  projectTypeId: string;
  lifecycleStageId: string;
  primaryRole: DatasetRole;
  secondaryRole?: DatasetRole;
  usageExplanation: string;
  confidence: "high" | "medium" | "low";
  classificationStrength: "strong" | "weak";
  isUsed: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  usageSummary: string;
  dataClass: string;
  productFamily: string;
  isoCategory?: string;
  supplier: string;
  coverage: string;
  originBusinessUnit: string;
  status: DatasetStatus;
  catalogueStatus: "governed" | "desired" | "candidate" | "retired";
  productStatus: "not-a-product" | "productised" | "candidate-product";
  openProprietary: "open" | "proprietary" | "mixed";
  existsInCatalogue: boolean;
  existsAsProduct: boolean;
  desiredGap: boolean;
  confidenceLevel: "high" | "medium" | "low";
  clientSpecific: boolean;
  lifecycleUses: DatasetLifecycleUse[];
  tags: string[];
}

export interface DataProposal {
  id: string;
  proposedName: string;
  commonName: string;
  requestedBy: "sales" | "product" | "sme" | "client";
  proposalStatus: ProposalStatus;
  canonicalDatasetId?: string;
  catalogueStatus: "desired" | "candidate" | "governed";
  productStatus: "not-a-product" | "candidate-product" | "productised";
  dataFamily: string;
  supplier: string;
  coverage: string;
  lifecycleStageIds: string[];
  roleByStage: Record<string, DatasetRole>;
  confidenceLevel: "high" | "medium" | "low";
  clientSpecific: boolean;
  approvalStateNote: string;
  projectTypeIds: string[];
  summary: string;
}
