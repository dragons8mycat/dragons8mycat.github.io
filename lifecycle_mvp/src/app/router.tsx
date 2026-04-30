import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { SalesStageFinderPage } from "@/features/sales-stage-finder/SalesStageFinderPage";
import { CatalogueExplorerPage } from "@/features/catalogue/CatalogueExplorerPage";
import { GapsPrioritisationPage } from "@/features/gaps/GapsPrioritisationPage";
import { AdminCurationPage } from "@/features/admin/AdminCurationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <SalesStageFinderPage /> },
      { path: "catalogue", element: <CatalogueExplorerPage /> },
      { path: "gaps", element: <GapsPrioritisationPage /> },
      { path: "admin", element: <AdminCurationPage /> },
    ],
  },
]);
