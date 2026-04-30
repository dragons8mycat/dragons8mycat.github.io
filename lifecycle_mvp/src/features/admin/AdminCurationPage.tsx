import { useMemo, useState } from "react";
import { fixtureRepository } from "@/data/repository";
import { useMockSession } from "@/app/MockSessionContext";
import { getVisibleDatasets, getVisibleProposals } from "@/lib/catalogue";
import { roleLabel } from "@/lib/formatters";
import type { DataProposal, DatasetRole } from "@/types/models";

export function AdminCurationPage() {
  const { role } = useMockSession();
  const datasets = getVisibleDatasets(fixtureRepository.getDatasets(), role);
  const [proposals, setProposals] = useState(getVisibleProposals(fixtureRepository.getProposals(), role));
  const [selectedProposalId, setSelectedProposalId] = useState(proposals[0]?.id ?? "");

  const selectedProposal = useMemo(
    () => proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0],
    [proposals, selectedProposalId],
  );

  function updateSelectedProposal<K extends keyof DataProposal>(key: K, value: DataProposal[K]) {
    setProposals((current) =>
      current.map((proposal) => (proposal.id === selectedProposal?.id ? { ...proposal, [key]: value } : proposal)),
    );
  }

  function updateRole(stageId: string, nextRole: DatasetRole) {
    if (!selectedProposal) return;
    updateSelectedProposal("roleByStage", {
      ...selectedProposal.roleByStage,
      [stageId]: nextRole,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <section className="panel p-6">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Admin & Curation</p>
            <h2 className="text-2xl font-extrabold text-brand-heading">Proposal queue</h2>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {proposals.map((proposal) => (
            <button
              key={proposal.id}
              type="button"
              onClick={() => setSelectedProposalId(proposal.id)}
              className={[
                "w-full rounded-2xl border p-4 text-left transition",
                proposal.id === selectedProposal?.id
                  ? "border-brand-blue bg-sky-50"
                  : "border-slate-200 bg-white hover:border-brand-sky",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-brand-heading">{proposal.proposedName}</div>
                  <div className="mt-1 text-sm text-slate-600">{proposal.summary}</div>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                  {proposal.proposalStatus}
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Requested by {proposal.requestedBy} · Project types: {proposal.projectTypeIds.join(", ")}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel p-6">
        {selectedProposal ? (
          <>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Curation form</p>
                <h2 className="text-2xl font-extrabold text-brand-heading">{selectedProposal.proposedName}</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Common name</label>
                <input
                  value={selectedProposal.commonName}
                  onChange={(event) => updateSelectedProposal("commonName", event.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Canonical dataset match</label>
                <select
                  value={selectedProposal.canonicalDatasetId ?? ""}
                  onChange={(event) => updateSelectedProposal("canonicalDatasetId", event.target.value || undefined)}
                  className="field-input"
                >
                  <option value="">No current match</option>
                  {datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Catalogue status</label>
                <select
                  value={selectedProposal.catalogueStatus}
                  onChange={(event) => updateSelectedProposal("catalogueStatus", event.target.value as DataProposal["catalogueStatus"])}
                  className="field-input"
                >
                  <option value="desired">desired</option>
                  <option value="candidate">candidate</option>
                  <option value="governed">governed</option>
                </select>
              </div>
              <div>
                <label className="field-label">Product status</label>
                <select
                  value={selectedProposal.productStatus}
                  onChange={(event) => updateSelectedProposal("productStatus", event.target.value as DataProposal["productStatus"])}
                  className="field-input"
                >
                  <option value="not-a-product">not-a-product</option>
                  <option value="candidate-product">candidate-product</option>
                  <option value="productised">productised</option>
                </select>
              </div>
              <div>
                <label className="field-label">Data family</label>
                <input
                  value={selectedProposal.dataFamily}
                  onChange={(event) => updateSelectedProposal("dataFamily", event.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Supplier</label>
                <input
                  value={selectedProposal.supplier}
                  onChange={(event) => updateSelectedProposal("supplier", event.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Coverage</label>
                <input
                  value={selectedProposal.coverage}
                  onChange={(event) => updateSelectedProposal("coverage", event.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Confidence level</label>
                <select
                  value={selectedProposal.confidenceLevel}
                  onChange={(event) => updateSelectedProposal("confidenceLevel", event.target.value as DataProposal["confidenceLevel"])}
                  className="field-input"
                >
                  <option value="high">high</option>
                  <option value="medium">medium</option>
                  <option value="low">low</option>
                </select>
              </div>
              <div>
                <label className="field-label">Client-specific flag</label>
                <select
                  value={selectedProposal.clientSpecific ? "true" : "false"}
                  onChange={(event) => updateSelectedProposal("clientSpecific", event.target.value === "true")}
                  className="field-input"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label className="field-label">Approval state</label>
                <select
                  value={selectedProposal.proposalStatus}
                  onChange={(event) => updateSelectedProposal("proposalStatus", event.target.value as DataProposal["proposalStatus"])}
                  className="field-input"
                >
                  <option value="draft">draft</option>
                  <option value="pending-review">pending-review</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                  <option value="published">published</option>
                </select>
              </div>
            </div>

            <article className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-bold text-brand-heading">Lifecycle stages and roles</h3>
              <div className="mt-4 grid gap-3">
                {selectedProposal.lifecycleStageIds.map((stageId) => (
                  <div key={stageId} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
                    <div>
                      <div className="font-semibold text-slate-800">{stageId}</div>
                      <div className="mt-1 text-xs text-slate-500">Set the role used at this lifecycle stage.</div>
                    </div>
                    <select
                      value={selectedProposal.roleByStage[stageId]}
                      onChange={(event) => updateRole(stageId, event.target.value as DatasetRole)}
                      className="field-input"
                    >
                      <option value="analytical">{roleLabel.analytical}</option>
                      <option value="basemapping">{roleLabel.basemapping}</option>
                      <option value="descriptive-contextual">{roleLabel["descriptive-contextual"]}</option>
                      <option value="unknown">{roleLabel.unknown}</option>
                    </select>
                  </div>
                ))}
              </div>
            </article>

            <div className="mt-6">
              <label className="field-label">Approval note</label>
              <textarea
                value={selectedProposal.approvalStateNote}
                onChange={(event) => updateSelectedProposal("approvalStateNote", event.target.value)}
                className="field-input min-h-32"
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">No proposal selected.</p>
        )}
      </section>
    </div>
  );
}
