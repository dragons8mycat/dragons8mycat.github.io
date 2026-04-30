# Data Lifecycles MVP

## Product purpose

This MVP turns the geospatial lifecycle workbook and demo HTML into a maintainable web application for sales, product, catalogue, and admin teams.

It helps users answer:

- what data is used at a given lifecycle stage
- how that data is used
- where gaps or desired datasets exist
- how proposed additions should be reviewed and curated

Client-specific records are excluded from normal user-facing flows by default and only appear to administrators in the mock role mode.

## Core users

- `Sales users`
  Need fast answers by project type and lifecycle stage while speaking to clients.
- `Product users`
  Need to identify high-value gaps and repeated demand signals.
- `Data catalogue users`
  Need to browse the governed non-client catalogue and understand lifecycle usage.
- `Data admin users`
  Need to curate proposals, role classifications, status, and lifecycle use.

## Main workflows

### 1. Sales Stage Finder

- filter by project type and lifecycle stage
- switch between:
  - `Role-led stage view`
  - `Lifecycle touchpoint view`
- keep unknown or weakly classified records separated from the strongest sales answers

### 2. Catalogue Explorer

- search and filter the governed non-client catalogue
- inspect dataset metadata, status, supplier, coverage, and lifecycle usage
- open a dataset detail drawer

### 3. Gaps & Prioritisation

- view desired or gap datasets separately
- review prioritisation scores based on lifecycle breadth, project-type spread, product/catalogue existence, request signal, and confidence
- compare desired datasets across project types

### 4. Admin & Curation

- review a mock curation queue
- edit proposal fields using local state
- manage lifecycle stage role assignments and approval state

## Tech stack

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `React Router`
- `TanStack Table`
- `Zod`
- local JSON fixtures

## Project structure

```text
src/
  app/
  components/
  data/
    fixtures/
  features/
    admin/
    catalogue/
    gaps/
    sales-stage-finder/
  lib/
  types/
```

## Data model overview

The typed model includes:

- `Dataset`
- `ProjectType`
- `LifecycleStage`
- `DatasetLifecycleUse`
- `DatasetRole`
- `DatasetStatus`
- `DataProposal`
- `ProposalStatus`
- `UserRole`

Fixtures are validated through Zod before they are exposed to the app.

## Running locally

### Requirements

- Node.js with npm available

### Install

```powershell
npm install
```

### Start dev server

```powershell
npm run dev
```

### Build

```powershell
npm run build
```

### Lint

```powershell
npm run lint
```

### Preview production build

```powershell
npm run preview
```

## Fixture data notes

The fixture data is deliberately rich enough to demonstrate:

- multiple project types: Housing, Solar, Onshore Wind, Offshore Wind, Fibre
- governed catalogue datasets
- desired or gap datasets
- product and SME-input examples
- at least one unknown or weakly classified dataset
- at least one client-specific dataset hidden from non-admin users

## Future backend / API notes

The current app uses a local fixture repository and transformation helpers in `src/lib/`.

To move to a real API later:

- replace `src/data/repository.ts` with API-backed services
- keep the existing types and Zod schemas as the contract boundary
- move admin mutations from local state to API calls
- layer authentication and permission checks on top of the existing mock role model

## Current status

This MVP is designed for internal stakeholder review and has a clean lint/build path with local fixture data.
