from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

from openpyxl import load_workbook


WORKBOOK = Path(r"D:\data_lifecycles\Master\Master_Data_Lifecycle_v11_MASTER.xlsx")
OUTPUT = Path(r"D:\Management\Github\dragons8mycat.github.io\lifecycle_mvp\data\mvp-data.json")


def as_key_map(headers: list[str]) -> dict[str, int]:
    return {header: idx for idx, header in enumerate(headers)}


def clean(value: object) -> str:
    if value is None:
      return ""
    return str(value).strip()


def main() -> None:
    workbook = load_workbook(WORKBOOK, read_only=True, data_only=True)

    ws_master = workbook["1_Data_Master_Expanded"]
    ws_stage = workbook["2_Project_Stage_Data"]
    ws_recon = workbook["0_Reconciliation"]

    master_rows = list(ws_master.iter_rows(values_only=True))
    stage_rows = list(ws_stage.iter_rows(values_only=True))
    recon_rows = list(ws_recon.iter_rows(values_only=True))

    master_headers = [clean(value) for value in master_rows[0]]
    stage_headers = [clean(value) for value in stage_rows[0]]
    recon_headers = [clean(value) for value in recon_rows[0]]
    master_map = as_key_map(master_headers)
    stage_map = as_key_map(stage_headers)
    recon_map = as_key_map(recon_headers)

    usage_by_data_id: dict[str, dict[str, object]] = defaultdict(lambda: {
        "usage_count": 0,
        "project_types": set(),
        "stage_names": set(),
    })

    review_counter = 0
    project_types = set()
    stages = set()
    status_counter: Counter[str] = Counter()

    for row in stage_rows[1:]:
        if not row or not row[0]:
            continue
        data_id = clean(row[stage_map["data_id"]])
        if not data_id:
            continue
        usage = usage_by_data_id[data_id]
        usage["usage_count"] += 1
        usage["project_types"].add(clean(row[stage_map["project_type"]]))
        usage["stage_names"].add(clean(row[stage_map["stage_name"]]))
        project_types.add(clean(row[stage_map["project_type"]]))
        stages.add(clean(row[stage_map["stage_name"]]))

    review_queue = []
    for row in recon_rows[1:]:
        if not row or not row[0]:
            continue
        match_type = clean(row[recon_map["match_type"]])
        confidence = clean(row[recon_map["confidence"]])
        if match_type in {"review-needed", "no-match"}:
            review_counter += 1
            review_queue.append({
                "queueType": "Catalogue Review",
                "title": clean(row[recon_map["lifecycle_common_name"]]),
                "status": "Needs review",
                "description": f"Match type: {match_type}. Confidence: {confidence or 'N/A'}.",
            })

    datasets = []
    for row in master_rows[1:]:
        if not row or not row[0]:
            continue
        data_id = clean(row[master_map["data_id"]])
        usage = usage_by_data_id[data_id]
        match_status = clean(row[master_map["match_status"]])
        status_counter[match_status] += 1
        datasets.append({
            "dataId": data_id,
            "commonName": clean(row[master_map["common_name"]]),
            "dataClass": clean(row[master_map["data_class"]]),
            "productFamily": clean(row[master_map["product_family"]]),
            "supplier": clean(row[master_map["supplier"]]),
            "variantCount": int(row[master_map["variant_count"]] or 0),
            "matchStatus": match_status,
            "confidence": row[master_map["confidence"]],
            "source": clean(row[master_map["source"]]),
            "usageCount": usage["usage_count"],
            "projectTypes": sorted(item for item in usage["project_types"] if item),
            "stageNames": sorted(item for item in usage["stage_names"] if item),
        })

    datasets.sort(key=lambda item: (-item["usageCount"], item["commonName"]))

    payload = {
        "summary": {
            "datasetCount": len(datasets),
            "stageRowCount": len(stage_rows) - 1,
            "projectTypeCount": len(project_types),
            "reviewCount": review_counter,
        },
        "filters": {
            "projectTypes": sorted(item for item in project_types if item),
            "stages": sorted(item for item in stages if item),
            "matchStatuses": sorted(status for status in status_counter if status),
        },
        "datasets": datasets,
        "reviewQueue": review_queue[:12],
    }

    OUTPUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
