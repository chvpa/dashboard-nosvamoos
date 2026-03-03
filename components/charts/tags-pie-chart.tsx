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
  "hsl(12 76% 61% / 0.6)",
  "hsl(200 60% 50%)",
  "hsl(40 80% 55%)",
];

interface TagsPieChartProps {
  data: LabelCount[];
}

export function TagsPieChart({ data }: TagsPieChartProps) {
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
        <CardTitle className="text-sm font-medium">Etiquetas</CardTitle>
        <p className="text-xs text-muted-foreground">
          Estado de las conversaciones
        </p>
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
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          {data.map((d, i) => (
            <span key={d.label} className="flex items-center gap-1.5">
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              {d.label}: {d.count}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
