/** Small formatting helpers shared across screens. */

export function rupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function rupeesDecimal(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** 95 -> "95%". */
export function pct(n: number | null): string {
  return n == null ? '—' : `${Math.round(n)}%`;
}

/** mm:ss from seconds. */
export function mmss(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

/** ISO -> "16 Oct 2026, 04:56 PM". */
export function dateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${date}, ${time}`;
}

/** ISO -> "10:43 am". */
export function timeOnly(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    .toLowerCase();
}

/** ISO -> relative-ish "Today", "Yesterday" or a date. */
export function dayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date('2026-10-17T11:00:00+05:30');
  const dayMs = 24 * 60 * 60 * 1000;
  const diff = Math.floor((now.setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / dayMs);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
