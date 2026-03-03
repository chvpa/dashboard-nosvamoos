"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

type RefreshFn = () => void;

interface RefreshContextValue {
  registerRefresh: (fn: RefreshFn) => void;
  unregisterRefresh: () => void;
  triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextValue | null>(null);

export function RefreshProvider({ children }: { children: ReactNode }) {
  const refreshRef = useRef<RefreshFn | null>(null);

  const registerRefresh = useCallback((fn: RefreshFn) => {
    refreshRef.current = fn;
  }, []);

  const unregisterRefresh = useCallback(() => {
    refreshRef.current = null;
  }, []);

  const triggerRefresh = useCallback(() => {
    refreshRef.current?.();
  }, []);

  return (
    <RefreshContext.Provider
      value={{ registerRefresh, unregisterRefresh, triggerRefresh }}
    >
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefreshContext(): RefreshContextValue {
  const ctx = useContext(RefreshContext);
  if (!ctx) {
    throw new Error("useRefreshContext must be used within RefreshProvider");
  }
  return ctx;
}
