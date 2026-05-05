import { useEffect, type ReactNode } from "react";
import { useMockSession } from "@/app/MockSessionContext";
import type { UserRole } from "@/types/models";

export function RoleScope({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const { setRole } = useMockSession();

  useEffect(() => {
    setRole(role);
  }, [role, setRole]);

  return <>{children}</>;
}
