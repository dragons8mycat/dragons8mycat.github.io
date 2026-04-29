const DATA_URL = "./data/mvp-data.json";

const state = {
  data: null,
  projectType: "",
  stageName: "",
  search: "",
};

const elements = {
  projectTypeSelect: document.getElementById("projectTypeSelect"),
  stageSearchInput: document.getElementById("stageSearchInput"),
  stageNavigator: document.getElementById("stageNavigator"),
  stageHeading: document.getElementById("stageHeading"),
  stageReadinessCopy: document.getElementById("stageReadinessCopy"),
  readinessBadge: document.getElementById("readinessBadge"),
  heldCount: document.getElementById("heldCount"),
  reviewCount: document.getElementById("reviewCount"),
  gapCount: document.getElementById("gapCount"),
  unknownCount: document.getElementById("unknownCount"),
  stagePurpose: document.getElementById("stagePurpose"),
  topHeldList: document.getElementById("topHeldList"),
  topGapList: document.getElementById("topGapList"),
  roleGroups: document.getElementById("roleGroups"),
  scoreStrip: document.getElementById("scoreStrip"),
  strategicGapList: document.getElementById("strategicGapList"),
};

async function loadData() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load ${DATA_URL}`);
  }

  state.data = await response.json();
  const projectTypes = state.data.projectTypes;
  state.projectType = projectTypes[0]?.name ?? "";
  state.stageName = projectTypes[0]?.stages[0]?.stageName ?? "";
  populateProjectTypes(projectTypes);
  bindProjectSummary();
  renderProject();
}

function populateProjectTypes(projectTypes) {
  elements.projectTypeSelect.innerHTML = projectTypes
    .map((project) => `<option value="${escapeHtml(project.name)}">${escapeHtml(project.name)}</option>`)
    .join("");
  elements.projectTypeSelect.value = state.projectType;
}

function bindProjectSummary() {
  const project = currentProject();
  if (!project) return;

  setSummaryValue("selectedStageCount", project.stageCount);
  setSummaryValue("selectedAtRiskCount", project.atRiskCount);
  setSummaryValue("selectedBlockedCount", project.blockedCount);
  setSummaryValue("strategicGapCount", project.strategicGapCount);
}

function renderProject() {
  const project = currentProject();
  if (!project) return;

  bindProjectSummary();
  renderStageNavigator(project);
  renderStageDetail(currentStage());
  renderStrategicGaps(project);
}

function renderStageNavigator(project) {
  elements.stageNavigator.innerHTML = project.stages.map((stage) => `
    <article class="stage-button ${stage.stageName === state.stageName ? "is-active" : ""}" data-stage="${escapeHtml(stage.stageName)}">
      <div class="status-dot ${readinessClass(stage.readiness)}">${escapeHtml(labelForReadiness(stage.readiness))}</div>
      <h3>${escapeHtml(stage.stageName)}</h3>
      <div class="chip-row">
        <span class="tag success">${stage.counts.held} held</span>
        <span class="tag warning">${stage.counts.review} review</span>
        <span class="tag danger">${stage.counts.gap} gaps</span>
      </div>
    </article>
  `).join("");

  elements.stageNavigator.querySelectorAll(".stage-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.stageName = button.dataset.stage;
      renderProject();
    });
  });
}

function renderStageDetail(stage) {
  if (!stage) return;

  elements.stageHeading.textContent = stage.stageName;
  elements.stageReadinessCopy.textContent = stage.readinessNarrative;
  elements.readinessBadge.textContent = labelForReadiness(stage.readiness);
  elements.readinessBadge.className = `readiness-badge ${readinessBadgeClass(stage.readiness)}`;
  elements.heldCount.textContent = stage.counts.held;
  elements.reviewCount.textContent = stage.counts.review;
  elements.gapCount.textContent = stage.counts.gap;
  elements.unknownCount.textContent = stage.counts.unknownRole;
  elements.stagePurpose.textContent = stage.stagePurpose;

  elements.topHeldList.innerHTML = renderList(stage.topHeld, "Held datasets already supporting this stage.");
  elements.topGapList.innerHTML = renderList(stage.topGaps, "No immediate gap or validation flags for this stage.");
  renderRoleGroups(stage);
  renderScoreStrip(stage);
}

function renderRoleGroups(stage) {
  const searchNeedle = state.search.trim().toLowerCase();
  elements.roleGroups.innerHTML = stage.roleGroups.map((group) => {
    const items = group.items.filter((item) => {
      if (!searchNeedle) return true;
      const haystack = [item.commonName, item.productFamily, item.supplier, item.source].join(" ").toLowerCase();
      return haystack.includes(searchNeedle);
    });

    if (items.length === 0) {
      return "";
    }

    return `
      <article class="role-group">
        <h4>${escapeHtml(group.label)} <span class="mini-note">(${items.length})</span></h4>
        <ul class="detail-list">
          ${items.slice(0, 18).map((item) => `
            <li>
              <strong>${escapeHtml(item.commonName)}</strong>
              <div class="chip-row">
                <span class="role-chip ${statusTone(item.status)}">${escapeHtml(item.statusLabel)}</span>
                <span class="role-chip">${escapeHtml(item.productFamily || "No family")}</span>
                <span class="role-chip">${escapeHtml(item.supplier || "No supplier")}</span>
              </div>
            </li>
          `).join("")}
        </ul>
      </article>
    `;
  }).join("") || `<p class="empty-state">No stage items match the current search.</p>`;
}

function renderScoreStrip(stage) {
  elements.scoreStrip.innerHTML = `
    <article class="score-item">
      <span>Analytical</span>
      <strong>${stage.roleCounts.Analytical}</strong>
    </article>
    <article class="score-item">
      <span>Basemapping</span>
      <strong>${stage.roleCounts.Basemapping}</strong>
    </article>
    <article class="score-item">
      <span>Contextual</span>
      <strong>${stage.roleCounts["Descriptive/Contextual"]}</strong>
    </article>
    <article class="score-item">
      <span>Unknown role</span>
      <strong>${stage.roleCounts.Unknown}</strong>
    </article>
  `;
}

function renderStrategicGaps(project) {
  if (project.strategicGaps.length === 0) {
    elements.strategicGapList.innerHTML = `<p class="empty-state">No explicit additions or strategic gaps have been flagged for ${escapeHtml(project.name)}.</p>`;
    return;
  }

  elements.strategicGapList.innerHTML = `
    <ul class="stack-list">
      ${project.strategicGaps.slice(0, 10).map((gap) => `
        <li>
          <strong>${escapeHtml(gap.commonName)}</strong>
          <div class="chip-row">
            <span class="role-chip danger">${escapeHtml(gap.source || "Gap")}</span>
            <span class="role-chip">${escapeHtml(gap.targetRoles || "No target roles")}</span>
          </div>
        </li>
      `).join("")}
    </ul>
  `;
}

function currentProject() {
  return state.data?.projectTypes.find((project) => project.name === state.projectType) ?? null;
}

function currentStage() {
  return currentProject()?.stages.find((stage) => stage.stageName === state.stageName) ?? null;
}

function renderList(items, emptyMessage) {
  if (!items.length) {
    return `<li>${escapeHtml(emptyMessage)}</li>`;
  }
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function setSummaryValue(key, value) {
  const el = document.querySelector(`[data-summary="${key}"]`);
  if (el) el.textContent = Number(value).toLocaleString();
}

function labelForReadiness(readiness) {
  if (readiness === "blocked") return "Not yet credible";
  if (readiness === "at-risk") return "Ready with caveats";
  return "Ready now";
}

function readinessClass(readiness) {
  if (readiness === "blocked") return "blocked";
  if (readiness === "at-risk") return "at-risk";
  return "";
}

function readinessBadgeClass(readiness) {
  if (readiness === "blocked") return "readiness-blocked";
  if (readiness === "at-risk") return "readiness-risk";
  return "readiness-ready";
}

function statusTone(status) {
  if (status === "gap") return "danger";
  if (status === "review" || status === "unknown") return "warning";
  return "success";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

elements.projectTypeSelect.addEventListener("change", (event) => {
  state.projectType = event.target.value;
  state.stageName = currentProject()?.stages[0]?.stageName ?? "";
  renderProject();
});

elements.stageSearchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderStageDetail(currentStage());
});

loadData().catch((error) => {
  document.body.innerHTML = `<main class="site-shell"><section class="panel"><p>${escapeHtml(error.message)}</p></section></main>`;
});
