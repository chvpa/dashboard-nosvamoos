"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { AgentKpiCards } from "@/components/agentes/agent-kpi-cards";
import { AgentsTable } from "@/components/agentes/agents-table";
import { DateFilterBar } from "@/components/filters/date-filter-bar";
import { useRefreshContext } from "@/store/refresh-context";
import { aggregateByAgent } from "@/lib/agent-aggregation";
import { buildPresetRange, type DateFilter } from "@/lib/date-filters";
import {
  buildAdditionalFilterOptions,
  DEFAULT_ADDITIONAL_FILTERS,
} from "@/lib/dashboard-filters";
import type { AgentMetricsItem, AgentMetricsPage } from "@/types/botmaker";

export default function AgentesPage() {
  const [rawItems, setRawItems] = useState<AgentMetricsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<DateFilter | null>(() =>
    buildPresetRange("week"),
  );
  const [additionalFilters, setAdditionalFilters] = useState(
    DEFAULT_ADDITIONAL_FILTERS,
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { registerRefresh, unregisterRefresh } = useRefreshContext();
  useEffect(() => {
    registerRefresh(() => setRefreshTrigger((t) => t + 1));
    return unregisterRefresh;
  }, [registerRefresh, unregisterRefresh]);

  useEffect(() => {
    if (!appliedFilter?.from || !appliedFilter?.to) {
      setRawItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchAllPages = async (
      status: string
    ): Promise<AgentMetricsItem[]> => {
      const params = new URLSearchParams({
        from: appliedFilter.from,
        to: appliedFilter.to,
        "session-status": status,
      });
      let url: string | null = `/api/agent-metrics?${params.toString()}`;
      const acc: AgentMetricsItem[] = [];
      while (url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const page = (await res.json()) as AgentMetricsPage;
        if (cancelled) return acc;
        acc.push(...(page.items ?? []));
        url = page.nextPage
          ? `/api/agent-metrics?nextPage=${encodeURIComponent(page.nextPage)}`
          : null;
      }
      return acc;
    };

    (async () => {
      try {
        const [openItems, closedItems] = await Promise.all([
          fetchAllPages("open"),
          fetchAllPages("closed"),
        ]);
        if (cancelled) return;
        setRawItems([...closedItems, ...openItems]);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar métricas"
          );
          setRawItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appliedFilter?.from, appliedFilter?.to, refreshTrigger]);

  const filterOptions = useMemo(
    () => buildAdditionalFilterOptions([], rawItems),
    [rawItems],
  );

  const filteredRawItems = useMemo(() => {
    return rawItems.filter((item) => {
      if (
        additionalFilters.agent !== "all" &&
        (item.agentName?.trim() ?? "") !== additionalFilters.agent
      ) {
        return false;
      }
      if (
        additionalFilters.typification !== "all" &&
        (item.typification?.trim() ?? "") !== additionalFilters.typification
      ) {
        return false;
      }
      return true;
    });
  }, [rawItems, additionalFilters]);

  const agents = useMemo(() => aggregateByAgent(filteredRawItems), [filteredRawItems]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-pretty">Agentes</h1>
        <p className="text-sm text-muted-foreground">
          Rendimiento y métricas de tus agentes.
        </p>
      </div>

      <DateFilterBar
        appliedFilter={appliedFilter}
        onFilterChange={setAppliedFilter}
        defaultPreset="week"
        additionalFilters={additionalFilters}
        onAdditionalFiltersChange={setAdditionalFilters}
        additionalFilterOptions={filterOptions}
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border py-12 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Cargando métricas…</span>
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <AgentKpiCards agents={agents} />
          <AgentsTable agents={agents} />
        </>
      )}
    </div>
  );
}
