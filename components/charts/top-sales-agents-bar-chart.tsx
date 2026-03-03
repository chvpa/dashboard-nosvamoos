"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AgentSalesCount } from "@/lib/sales-aggregation";

interface TopSalesAgentsBarChartProps {
  data: AgentSalesCount[];
}

const chartConfig = {
  salesCount: { label: "Ventas", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TopSalesAgentsBarChart({ data }: TopSalesAgentsBarChartProps) {
  const chartData = data.map((d) => ({
    name:
      d.agentName.length > 20
        ? d.agentName.slice(0, 20) + "\u2026"
        : d.agentName,
    salesCount: d.salesCount,
    totalAmount: d.totalAmount,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Agentes con mas ventas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => {
                    const amt = item.payload?.totalAmount;
                    return (
                      <span>
                        {String(value)} ventas
                        {amt != null &&
                          ` \u00B7 $${Number(amt).toLocaleString()}`}
                      </span>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="salesCount"
              fill="var(--color-salesCount)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
