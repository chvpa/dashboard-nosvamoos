"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { LabelCount } from "@/lib/sales-aggregation";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface SalesPackageTypeDonutChartProps {
  data: LabelCount[];
}

export function SalesPackageTypeDonutChart({
  data,
}: SalesPackageTypeDonutChartProps) {
  const chartData = data.map((d) => ({ name: d.label, value: d.count }));

  const chartConfig: ChartConfig = {};
  data.forEach((d, i) => {
    chartConfig[d.label] = {
      label: d.label,
      color: CHART_COLORS[i % CHART_COLORS.length],
    };
  });
  if (Object.keys(chartConfig).length === 0) {
    (chartConfig as Record<string, { label: string; color: string }>).empty = {
      label: "Sin datos",
      color: "var(--muted)",
    };
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Tipo de paquete (ventas)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[250px] w-full max-w-[280px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              strokeWidth={1}
              stroke="var(--border)"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
