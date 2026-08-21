export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysUntil(iso: string): number {
  const today = new Date(todayISO() + "T00:00:00");
  const target = new Date(iso + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}
