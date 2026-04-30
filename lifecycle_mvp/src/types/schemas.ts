import { z } from "zod";

export const datasetRoleSchema = z.enum([
  "analytical",
  "basemapping",
  "descriptive-contextual",
  "unknown",
]);

export const datasetStatusSchema = z.enum([
  "catalogue",
  "desired-gap",
  "product",
  "sme-input",
  "client-request",
]);

export const proposalStatusSchema = z.enum([
  "draft",
  "pending-review",
  "approved",
  "rejected",
  "published",
]);

export const lifecycleStageSchema = z.object({
  id: z.string(),
  name: z.string(),
  sequence: z.number(),
  projectTypeId: z.string(),
});

export const projectTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  stages: z.array(lifecycleStageSchema),
});

export const datasetLifecycleUseSchema = z.object({
  id: z.string(),
  datasetId: z.string(),
  projectTypeId: z.string(),
  lifecycleStageId: z.string(),
  primaryRole: datasetRoleSchema,
  secondaryRole: datasetRoleSchema.optional(),
  usageExplanation: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  classificationStrength: z.enum(["strong", "weak"]),
  isUsed: z.boolean(),
});

export const datasetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  usageSummary: z.string(),
  dataClass: z.string(),
  productFamily: z.string(),
  isoCategory: z.string().optional(),
  supplier: z.string(),
  coverage: z.string(),
  originBusinessUnit: z.string(),
  status: datasetStatusSchema,
  catalogueStatus: z.enum(["governed", "desired", "candidate", "retired"]),
  productStatus: z.enum(["not-a-product", "productised", "candidate-product"]),
  openProprietary: z.enum(["open", "proprietary", "mixed"]),
  existsInCatalogue: z.boolean(),
  existsAsProduct: z.boolean(),
  desiredGap: z.boolean(),
  confidenceLevel: z.enum(["high", "medium", "low"]),
  clientSpecific: z.boolean(),
  lifecycleUses: z.array(datasetLifecycleUseSchema),
  tags: z.array(z.string()),
});

export const dataProposalSchema = z.object({
  id: z.string(),
  proposedName: z.string(),
  commonName: z.string(),
  requestedBy: z.enum(["sales", "product", "sme", "client"]),
  proposalStatus: proposalStatusSchema,
  canonicalDatasetId: z.string().optional(),
  catalogueStatus: z.enum(["desired", "candidate", "governed"]),
  productStatus: z.enum(["not-a-product", "candidate-product", "productised"]),
  dataFamily: z.string(),
  supplier: z.string(),
  coverage: z.string(),
  lifecycleStageIds: z.array(z.string()),
  roleByStage: z.record(z.string(), datasetRoleSchema),
  confidenceLevel: z.enum(["high", "medium", "low"]),
  clientSpecific: z.boolean(),
  approvalStateNote: z.string(),
  projectTypeIds: z.array(z.string()),
  summary: z.string(),
});
