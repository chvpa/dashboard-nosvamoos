"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SalesKpis } from "@/lib/sales-aggregation";
import {
  TrendingUp,
  DollarSign,
  Receipt,
  ShoppingCart,
  Users,
  CalendarDays,
} from "lucide-react";

interface SalesKpiCardsProps {
  kpis: SalesKpis;
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("es-PY", { maximumFractionDigits: 0 });
}

export function SalesKpiCards({ kpis }: SalesKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="size-3.5" />
            Tasa de conversión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">
            {kpis.conversionRate.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">
            {kpis.totalSales} ventas de {kpis.totalChats} chats
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="size-3.5" />
            Monto total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">
            {formatCurrency(kpis.totalAmount)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Receipt className="size-3.5" />
            Ticket promedio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">
            {formatCurrency(kpis.avgTicket)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <ShoppingCart className="size-3.5" />
            Ventas cerradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">
            {kpis.totalSales}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Users className="size-3.5" />
            Prom. pasajeros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">
            {kpis.avgPassengers > 0 ? kpis.avgPassengers.toFixed(1) : "—"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Prom. días de viaje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">
            {kpis.avgTripDays > 0 ? kpis.avgTripDays.toFixed(1) : "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
