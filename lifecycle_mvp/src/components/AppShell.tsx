import { Outlet } from "react-router-dom";
import { MockSessionProvider, useMockSession } from "@/app/MockSessionContext";
import { Nav } from "@/components/Nav";

function ShellInner() {
  const { role, setRole } = useMockSession();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-gradient-to-r from-brand-navy to-brand-blue text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-200">Idox Geospatial</p>
              <h1 className="mt-2 max-w-4xl text-3xl font-extrabold tracking-tight md:text-4xl">
                Data Lifecycles MVP
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-sky-50/90 md:text-base">
                A governed lifecycle catalogue for understanding which geospatial datasets matter at each stage,
                where the gaps are, and how new proposals should be curated.
              </p>
            </div>
            <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <label className="field-label mb-2 text-sky-50">Mock user role</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as typeof role)}
                className="field-input border-white/20 bg-white/10 text-white focus:border-white focus:ring-white/20"
              >
                <option value="sales">Sales user</option>
                <option value="product">Product user</option>
                <option value="catalogue">Data catalogue user</option>
                <option value="admin">Data admin user</option>
              </select>
              <p className="mt-2 text-xs text-sky-100/80">Used to demonstrate permission-aware client-specific filtering.</p>
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
