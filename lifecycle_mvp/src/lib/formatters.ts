import type { DatasetRole, DatasetStatus } from "@/types/models";

export const roleLabel: Record<DatasetRole, string> = {
  analytical: "Analytical",
  basemapping: "Basemapping",
  "descriptive-contextual": "Descriptive / contextual",
  unknown: "Unknown / needs classification",
};

export const roleMarker: Record<DatasetRole, string> = {
  analytical: "A",
  basemapping: "B",
  "descriptive-contextual": "D",
  unknown: "U",
};

export const statusLabel: Record<DatasetStatus, string> = {
  catalogue: "Catalogue",
  "desired-gap": "Desired / gap",
  product: "Product",
  "sme-input": "SME input",
  "client-request": "Client request",
};

export function titleCaseFromKebab(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
