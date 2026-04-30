import clsx from "clsx";
import { statusLabel } from "@/lib/formatters";
import type { DatasetStatus } from "@/types/models";

const statusStyles: Record<DatasetStatus, string> = {
  catalogue: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "desired-gap": "bg-orange-100 text-orange-800 border-orange-200",
  product: "bg-sky-100 text-sky-800 border-sky-200",
  "sme-input": "bg-violet-100 text-violet-800 border-violet-200",
  "client-request": "bg-rose-100 text-rose-800 border-rose-200",
};

export function StatusBadge({ status }: { status: DatasetStatus }) {
  return (
    <span className={clsx("inline-flex rounded-full border px-3 py-1 text-xs font-bold", statusStyles[status])}>
      {statusLabel[status]}
    </span>
  );
}
