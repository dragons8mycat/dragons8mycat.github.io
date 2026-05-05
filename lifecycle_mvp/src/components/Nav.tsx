import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Overview" },
  { to: "/sales", label: "Sales" },
  { to: "/data", label: "Data" },
  { to: "/leadership", label: "Leadership" },
  { to: "/admin", label: "Admin" },
];

export function Nav() {
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          className={({ isActive }) =>
            [
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              isActive
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-slate-300 bg-white/90 text-brand-heading hover:border-brand-sky hover:text-brand-blue",
            ].join(" ")
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
