import { Outlet, useLocation } from "react-router-dom";
import { MockSessionProvider, useMockSession } from "@/app/MockSessionContext";
import { Nav } from "@/components/Nav";

function ShellInner() {
  const { role } = useMockSession();
  const location = useLocation();
  const routeLabel =
    {
      "/": "Overview",
      "/sales": "Sales",
      "/data": "Data",
      "/leadership": "Leadership",
      "/admin": "Admin",
    }[location.pathname] ?? "Workspace";
  const roleLabel =
    {
      sales: "Sales user",
      product: "Leadership / product user",
      catalogue: "Data user",
      admin: "Admin user",
    }[role];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-blue">Idox Geospatial</p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-heading md:text-3xl">
                Data Lifecycles MVP
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Governed lifecycle insight for sales, data, and leadership teams.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Current view</span>
              <span className="font-semibold text-brand-heading">{routeLabel}</span>
              <span>{roleLabel}</span>
            </div>
          </div>
          <Nav />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export function AppShell() {
  return (
    <MockSessionProvider>
      <ShellInner />
    </MockSessionProvider>
  );
}
