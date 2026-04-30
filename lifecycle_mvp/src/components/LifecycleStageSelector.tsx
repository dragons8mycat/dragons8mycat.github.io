import type { LifecycleStage } from "@/types/models";

export function LifecycleStageSelector({
  stages,
  selectedStageId,
  onSelect,
}: {
  stages: LifecycleStage[];
  selectedStageId: string;
  onSelect: (stageId: string) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {stages.map((stage) => (
        <button
          key={stage.id}
          type="button"
          onClick={() => onSelect(stage.id)}
          className={[
            "min-w-52 rounded-2xl border p-4 text-left transition",
            selectedStageId === stage.id
              ? "border-brand-orange bg-orange-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-brand-sky",
          ].join(" ")}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Stage {stage.sequence}</p>
          <p className="mt-2 text-base font-bold text-brand-heading">{stage.name}</p>
        </button>
      ))}
    </div>
  );
}
