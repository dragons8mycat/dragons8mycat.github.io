# Data Lifecycles MVP

This folder contains the first MVP scaffold for moving the workbook-based data lifecycle model into a web application.

## What is here

- `index.html`
  Static GitHub Pages frontend shell.
- `assets/`
  CSS and browser-side JavaScript for the explorer and ops queue preview.
- `data/mvp-data.json`
  Generated workbook export consumed by the static UI.
- `scripts/export_workbook_to_json.py`
  Exports the current master workbook into the JSON shape used by the frontend.
- `scripts/load_workbook_to_postgres.py`
  Loads the workbook snapshot into the `data_lifecycles_mvp` schema using `psql`.
- `sql/001_schema.sql`
  Baseline Postgres schema for Supabase in `data_lifecycles_mvp`.
- `sql/002_views.sql`
  First derived view for gap-oriented exploration.

## Local refresh

Run:

```powershell
python scripts/export_workbook_to_json.py
```

Then open:

`index.html`

For local preview, serve the folder instead of opening the file directly:

```powershell
cd D:\Management\Github\dragons8mycat.github.io\lifecycle_mvp
python -m http.server 8000
```

Then browse to:

`http://localhost:8000`

## Database load

From an environment that can reach Supabase:

```powershell
$env:PGPASSWORD = "your-db-password"
python scripts/load_workbook_to_postgres.py
```

## Current constraint

Direct Supabase database connectivity from this shell is blocked because the current environment cannot route to the resolved IPv6 database host. The schema files are ready to apply once run from a network-capable environment.
