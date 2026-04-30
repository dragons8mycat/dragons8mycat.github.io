import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { UserRole } from "@/types/models";

interface MockSessionContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const MockSessionContext = createContext<MockSessionContextValue | null>(null);

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("sales");
  const value = useMemo(() => ({ role, setRole }), [role]);
  return <MockSessionContext.Provider value={value}>{children}</MockSessionContext.Provider>;
}

export function useMockSession(): MockSessionContextValue {
  const context = useContext(MockSessionContext);
  if (!context) {
    throw new Error("useMockSession must be used within MockSessionProvider");
  }
  return context;
}
