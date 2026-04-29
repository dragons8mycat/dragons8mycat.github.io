const DATA_URL = "./data/mvp-data.json";

const state = {
  allDatasets: [],
  filteredDatasets: [],
  selectedId: null,
  filters: {
    search: "",
    projectType: "",
    stage: "",
    matchStatus: "",
  },
};

const elements = {
  projectFilter: document.getElementById("projectFilter"),
  stageFilter: document.getElementById("stageFilter"),
  statusFilter: document.getElementById("statusFilter"),
  searchInput: document.getElementById("searchInput"),
  datasetList: document.getElementById("datasetList"),
  datasetDetail: document.getElementById("datasetDetail"),
  queueList: document.getElementById("queueList"),
  resultsCount: document.querySelector("[data-results-count]"),
};

async function loadData() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load ${DATA_URL}`);
  }

  const data = await response.json();
  state.allDatasets = data.datasets;
  state.filteredDatasets = data.datasets;
  bindSummary(data.summary);
  populateFilters(data.filters);
  renderQueue(data.reviewQueue);
  renderDatasetList();
  if (data.datasets.length > 0) {
    selectDataset(data.datasets[0].dataId);
  }
}

function bindSummary(summary) {
  Object.entries(summary).forEach(([key, value]) => {
    const el = document.querySelector(`[data-summary="${key}"]`);
    if (el) {
      el.textContent = Number(value).toLocaleString();
    }
  });
}

function populateFilters(filters) {
  for (const projectType of filters.projectTypes) {
    elements.projectFilter.append(new Option(projectType, projectType));
  }
  for (const stage of filters.stages) {
    elements.stageFilter.append(new Option(stage, stage));
  }
  for (const status of filters.matchStatuses) {
    elements.statusFilter.append(new Option(status, status));
  }
}

function applyFilters() {
  const searchNeedle = state.filters.search.trim().toLowerCase();
  state.filteredDatasets = state.allDatasets.filter((dataset) => {
    const haystack = [
      dataset.commonName,
      dataset.dataClass,
      dataset.productFamily,
      dataset.supplier,
      dataset.source,
    ].join(" ").toLowerCase();

    const matchesSearch = !searchNeedle || haystack.includes(searchNeedle);
    const matchesProject = !state.filters.projectType || dataset.projectTypes.includes(state.filters.projectType);
    const matchesStage = !state.filters.stage || dataset.stageNames.includes(state.filters.stage);
    const matchesStatus = !state.filters.matchStatus || dataset.matchStatus === state.filters.matchStatus;
    return matchesSearch && matchesProject && matchesStage && matchesStatus;
  });

  renderDatasetList();
  if (!state.filteredDatasets.some((item) => item.dataId === state.selectedId)) {
    selectDataset(state.filteredDatasets[0]?.dataId ?? null);
  } else {
    renderDatasetDetail();
  }
}

function renderDatasetList() {
  elements.resultsCount.textContent = `${state.filteredDatasets.length.toLocaleString()} results`;
  if (state.filteredDatasets.length === 0) {
    elements.datasetList.innerHTML = "<p class='empty-state'>No datasets match the current filters.</p>";
    return;
  }

  elements.datasetList.innerHTML = state.filteredDatasets.map((dataset) => `
    <article class="dataset-card ${dataset.dataId === state.selectedId ? "is-active" : ""}" data-id="${dataset.dataId}">
      <div class="dataset-card-top">
        <div>
          <h3>${escapeHtml(dataset.commonName)}</h3>
          <p class="dataset-meta">${escapeHtml(dataset.productFamily || "Unclassified")} | ${escapeHtml(dataset.supplier || "No supplier")}</p>
        </div>
        <span class="tag ${statusTone(dataset.matchStatus)}">${escapeHtml(dataset.matchStatus)}</span>
      </div>
      <div class="dataset-meta">
        <span class="tag">${escapeHtml(dataset.dataClass || "Unknown class")}</span>
        <span class="tag">${dataset.usageCount} stage uses</span>
        <span class="tag">${dataset.projectTypes.length} project types</span>
      </div>
    </article>
  `).join("");

  elements.datasetList.querySelectorAll(".dataset-card").forEach((card) => {
    card.addEventListener("click", () => selectDataset(card.dataset.id));
  });
}

function selectDataset(dataId) {
  state.selectedId = dataId;
  renderDatasetList();
  renderDatasetDetail();
}

function renderDatasetDetail() {
  const dataset = state.filteredDatasets.find((item) => item.dataId === state.selectedId)
    || state.allDatasets.find((item) => item.dataId === state.selectedId);

  if (!dataset) {
    elements.datasetDetail.innerHTML = `
      <div class="detail-empty">
        <p>Select a dataset to inspect lifecycle usage, supplier context, and stewardship notes.</p>
      </div>
    `;
    return;
  }

  elements.datasetDetail.innerHTML = `
    <div class="detail-header">
      <div>
        <p class="eyebrow">Dataset Detail</p>
        <h3>${escapeHtml(dataset.commonName)}</h3>
      </div>
      <span class="tag ${statusTone(dataset.matchStatus)}">${escapeHtml(dataset.matchStatus)}</span>
    </div>
    <p class="detail-copy">Mapped to ${dataset.usageCount} lifecycle stage rows across ${dataset.projectTypes.length} project types.</p>
    <div class="detail-meta">
      <span class="tag">${escapeHtml(dataset.dataClass || "Unknown class")}</span>
      <span class="tag">${escapeHtml(dataset.productFamily || "No family")}</span>
      <span class="tag">${escapeHtml(dataset.source || "No source")}</span>
    </div>
    <div class="role-group">
      <h4>Project types</h4>
      <ul class="detail-list">${dataset.projectTypes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <div class="role-group">
      <h4>Lifecycle stages</h4>
      <ul class="detail-list">${dataset.stageNames.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <div class="role-group">
      <h4>Ops notes</h4>
      <ul class="detail-list">
        <li>Supplier: ${escapeHtml(dataset.supplier || "Unknown")}</li>
        <li>Variant count: ${dataset.variantCount}</li>
        <li>Confidence: ${dataset.confidence ?? "N/A"}</li>
      </ul>
    </div>
  `;
}

function renderQueue(queueItems) {
  if (!queueItems.length) {
    elements.queueList.innerHTML = "<p class='empty-state'>No review queue items were exported from the current workbook snapshot.</p>";
    return;
  }

  elements.queueList.innerHTML = queueItems.map((item) => `
    <article class="queue-card">
      <div class="queue-card-top">
        <div>
          <p class="eyebrow">${escapeHtml(item.queueType)}</p>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <span class="status-pill">${escapeHtml(item.status)}</span>
      </div>
      <p>${escapeHtml(item.description)}</p>
    </article>
  `).join("");
}

function statusTone(status) {
  const value = status.toLowerCase();
  if (value.includes("review")) return "warning";
  if (value.includes("gap")) return "danger";
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

elements.searchInput.addEventListener("input", (event) => {
  state.filters.search = event.target.value;
  applyFilters();
});

elements.projectFilter.addEventListener("change", (event) => {
  state.filters.projectType = event.target.value;
  applyFilters();
});

elements.stageFilter.addEventListener("change", (event) => {
  state.filters.stage = event.target.value;
  applyFilters();
});

elements.statusFilter.addEventListener("change", (event) => {
  state.filters.matchStatus = event.target.value;
  applyFilters();
});

loadData().catch((error) => {
  document.body.innerHTML = `<main class="site-shell"><section class="panel"><p>${escapeHtml(error.message)}</p></section></main>`;
});
