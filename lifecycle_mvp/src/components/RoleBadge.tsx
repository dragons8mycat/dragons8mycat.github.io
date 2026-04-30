import clsx from "clsx";
import { roleLabel, roleMarker } from "@/lib/formatters";
import type { DatasetRole } from "@/types/models";

const roleStyles: Record<DatasetRole, string> = {
  analytical: "bg-orange-100 text-orange-800 border-orange-200",
  basemapping: "bg-sky-100 text-sky-800 border-sky-200",
  "descriptive-contextual": "bg-emerald-100 text-emerald-800 border-emerald-200",
  unknown: "bg-slate-100 text-slate-700 border-slate-200",
};

export function RoleBadge({
  role,
  compact = false,
}: {
  role: DatasetRole;
  compact?: boolean;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold",
        roleStyles[role],
      )}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[11px]">
        {roleMarker[role]}
      </span>
      {compact ? roleMarker[role] : roleLabel[role]}
    </span>
  );
}
