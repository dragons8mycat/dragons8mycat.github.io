import { createHashRouter } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { RoleScope } from "@/app/RoleScope";
import { OverviewPage } from "@/features/overview/OverviewPage";
import { SalesStageFinderPage } from "@/features/sales-stage-finder/SalesStageFinderPage";
import { CatalogueExplorerPage } from "@/features/catalogue/CatalogueExplorerPage";
import { GapsPrioritisationPage } from "@/features/gaps/GapsPrioritisationPage";
import { AdminCurationPage } from "@/features/admin/AdminCurationPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      {
        path: "sales",
        element: (
          <RoleScope role="sales">
            <SalesStageFinderPage />
          </RoleScope>
        ),
      },
      {
        path: "data",
        element: (
          <RoleScope role="catalogue">
            <CatalogueExplorerPage />
          </RoleScope>
        ),
      },
      {
        path: "leadership",
        element: (
          <RoleScope role="product">
            <GapsPrioritisationPage />
          </RoleScope>
        ),
      },
      {
        path: "admin",
        element: (
          <RoleScope role="admin">
            <AdminCurationPage />
          </RoleScope>
        ),
      },
    ],
  },
]);
