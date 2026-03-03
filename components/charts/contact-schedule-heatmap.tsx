"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  groupByHourAndDay,
  getDayLabel,
  type HourDayBucket,
} from "@/lib/dashboard-aggregation";

interface ContactScheduleHeatmapProps {
  data: HourDayBucket[];
}

function getIntensityColor(count: number, max: number): string {
  if (max === 0 || count === 0) return "hsl(var(--muted))";
  const intensity = count / max;
  if (intensity >= 0.75) return "hsl(12 76% 61% / 0.9)";
  if (intensity >= 0.5) return "hsl(12 76% 61% / 0.65)";
  if (intensity >= 0.25) return "hsl(12 76% 61% / 0.4)";
  return "hsl(12 76% 61% / 0.2)";
}

export function ContactScheduleHeatmap({ data }: ContactScheduleHeatmapProps) {
  const { grid, maxCount } = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.count));
    const g: Record<string, number> = {};
    for (const d of data) {
      g[`${d.dayOfWeek}-${d.hour}`] = d.count;
    }
    return { grid: g, maxCount: max };
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Horario de contacto (Primer mensaje)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Días vs. horas del día
        </p>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            <div className="mb-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-8 shrink-0" />
              <div className="flex flex-1 gap-0.5">
                {Array.from({ length: 24 }, (_, h) => (
                  <span
                    key={h}
                    className="min-w-0 flex-1 text-center"
                    title={`${h}:00`}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-0.5">
              {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
                <div key={dayOfWeek} className="flex items-center gap-1">
                  <span className="w-8 shrink-0 text-right text-[10px] text-muted-foreground">
                    {getDayLabel(dayOfWeek)}
                  </span>
                  <div className="flex flex-1 gap-0.5">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const count = grid[`${dayOfWeek}-${hour}`] ?? 0;
                      return (
                        <div
                          key={hour}
                          className="min-w-0 flex-1 aspect-square rounded-sm transition-colors"
                          style={{
                            backgroundColor: getIntensityColor(count, maxCount),
                          }}
                          title={`${getDayLabel(dayOfWeek)} ${hour}:00 - ${count} chats`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
              <span>Menos</span>
              <div className="flex gap-0.5">
                {[0, 0.25, 0.5, 0.75, 1].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-4 rounded-sm"
                    style={{
                      backgroundColor: getIntensityColor(
                        i * maxCount,
                        maxCount
                      ),
                    }}
                  />
                ))}
              </div>
              <span>Más</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
