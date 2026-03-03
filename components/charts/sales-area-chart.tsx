"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { SalesTimeBucket } from "@/lib/sales-aggregation";

interface SalesAreaChartProps {
  data: SalesTimeBucket[];
}

const chartConfig = {
  amount: {
    label: "Monto",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.round(n));
}

export function SalesAreaChart({ data }: SalesAreaChartProps) {
  const chartData = data.map((d) => ({
    label: d.label,
    amount: d.amount,
    count: d.count,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Ventas en el tiempo
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Monto acumulado por período
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="fillSalesAmount"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="var(--color-amount)" stopOpacity={0.4} />
                <stop offset="1" stopColor="var(--color-amount)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatAmount}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => {
                    const cnt = item.payload?.count;
                    return (
                      <span>
                        ${Number(value).toLocaleString()}
                        {cnt != null && ` (${cnt} ventas)`}
                      </span>
                    );
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-amount)"
              fill="url(#fillSalesAmount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
