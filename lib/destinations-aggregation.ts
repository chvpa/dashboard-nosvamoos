import type { ChatWithMessagesResponse } from "@/types/botmaker";

function parseNum(s: string | undefined): number {
  if (s == null || s === "") return 0;
  const n = Number(String(s).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export interface DestinationKpis {
  uniqueDestinations: number;
  avgTripDays: number;
  avgPassengers: number;
  totalConsultas: number;
}

export function computeDestinationKpis(
  chats: ChatWithMessagesResponse[],
): DestinationKpis {
  const destinations = new Set<string>();
  let consultas = 0;
  let daysSum = 0;
  let daysCount = 0;
  let paxSum = 0;
  let paxCount = 0;

  for (const chat of chats) {
    const dest = chat.variables?.destino_viaje?.trim();
    if (dest) {
      destinations.add(dest.toLowerCase());
      consultas++;
    }
    const days = parseNum(chat.variables?.cantidad_dias);
    if (days > 0) {
      daysSum += days;
      daysCount++;
    }
    const pax = parseNum(chat.variables?.cantidad_pasajeros);
    if (pax > 0) {
      paxSum += pax;
      paxCount++;
    }
  }

  return {
    uniqueDestinations: destinations.size,
    avgTripDays: daysCount > 0 ? daysSum / daysCount : 0,
    avgPassengers: paxCount > 0 ? paxSum / paxCount : 0,
    totalConsultas: consultas,
  };
}

export interface DestinationCount {
  destination: string;
  count: number;
}

export function topDestinationsConsulted(
  chats: ChatWithMessagesResponse[],
  limit: number = 10,
): DestinationCount[] {
  const counts = new Map<string, number>();
  for (const chat of chats) {
    const dest = chat.variables?.destino_viaje?.trim();
    if (!dest) continue;
    counts.set(dest, (counts.get(dest) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([destination, count]) => ({ destination, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export interface LabelCount {
  label: string;
  count: number;
}

export function countByPackageType(
  chats: ChatWithMessagesResponse[],
): LabelCount[] {
  const counts = new Map<string, number>();
  for (const chat of chats) {
    const pkg = chat.variables?.tipo_paquete?.trim();
    if (!pkg) continue;
    counts.set(pkg, (counts.get(pkg) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export interface OriginCount {
  origin: string;
  count: number;
}

export function countByOrigin(
  chats: ChatWithMessagesResponse[],
  limit: number = 8,
): OriginCount[] {
  const counts = new Map<string, number>();
  for (const chat of chats) {
    const origin =
      chat.variables?.origen?.trim() || chat.country?.trim() || "";
    if (!origin) continue;
    counts.set(origin, (counts.get(origin) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([origin, count]) => ({ origin, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function familyComposition(
  chats: ChatWithMessagesResponse[],
): LabelCount[] {
  let withKids = 0;
  let adultsOnly = 0;

  for (const chat of chats) {
    const pax = parseNum(chat.variables?.cantidad_pasajeros);
    if (pax <= 0) continue;
    const kids = parseNum(chat.variables?.cantidad_ninos);
    if (kids > 0) {
      withKids++;
    } else {
      adultsOnly++;
    }
  }

  return [
    { label: "Solo adultos", count: adultsOnly },
    { label: "Con ninos", count: withKids },
  ];
}

export interface RangeCount {
  range: string;
  count: number;
}

export function tripDurationDistribution(
  chats: ChatWithMessagesResponse[],
): RangeCount[] {
  const buckets = { "1-3 dias": 0, "4-7 dias": 0, "8-14 dias": 0, "15+ dias": 0 };

  for (const chat of chats) {
    const days = parseNum(chat.variables?.cantidad_dias);
    if (days <= 0) continue;
    if (days <= 3) buckets["1-3 dias"]++;
    else if (days <= 7) buckets["4-7 dias"]++;
    else if (days <= 14) buckets["8-14 dias"]++;
    else buckets["15+ dias"]++;
  }

  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}
