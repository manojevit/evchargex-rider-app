import type {
  AccountSnapshot,
  AppAlert,
  LedgerEntry,
  Plan,
  Rider,
  SupportTopic,
  SwapHistoryRow,
  Vehicle,
} from './types';

/** The rider — straight from sir's real app. */
export const RIDER: Rider = {
  name: 'Manoj',
  phone: '+91 78770 18453',
  avatar_letter: 'M',
};

const VEHICLE: Vehicle = {
  plate: 'HR 26 DK 8055',
  model: 'Lectrix LXS',
  battery_pct: 68,
  range_km: 45,
};

const PLAN: Plan = {
  code: 'UNL_MONTHLY',
  name: 'Unlimited Monthly',
  price_rupees: 2499,
  period_label: '/ month',
  renews_on: '29 Oct 2026',
  auto_pay: true,
  benefits: [
    { title: 'Unlimited swaps, every day', detail: 'No daily cap on certified pack exchanges' },
    { title: 'Any EVCHARGEX station', detail: 'Over 1,200 grid hubs nationwide' },
    { title: 'No per-swap charge, ever', detail: 'Zero station transaction overhead or hidden fees' },
    { title: 'Priority support & roadside assist', detail: 'Dedicated 24/7 technical hotline & dispatch' },
  ],
  this_month_swaps: 19,
  saved_rupees: 1420,
  health_index: 98.4,
};

/** Battery serials reused across history so "gave/took" feels real. */
const S = {
  a: 'INCBZG5145M1343',
  b: 'INCBZG5145M1344',
  c: 'INCBZG5145M1345',
  d: 'INCBZG5145M1346',
  e: 'INCBZG5241K1347',
};

const HISTORY: SwapHistoryRow[] = [
  {
    id: 'sw-1009',
    status: 'completed',
    at: '2026-10-16T16:56:00+05:30',
    station_code: 'EVIDEMO01',
    slot_in: 2,
    slot_out: 1,
    gave: { serial: S.a, soc: 14 },
    took: { serial: S.b, soc: 100 },
    included_in_plan: true,
    price_rupees: 0,
  },
  {
    id: 'sw-1008',
    status: 'completed',
    at: '2026-10-15T09:12:00+05:30',
    station_code: 'EVIDEMO04',
    slot_in: 1,
    slot_out: 2,
    gave: { serial: S.b, soc: 9 },
    took: { serial: S.a, soc: 100 },
    included_in_plan: true,
    price_rupees: 0,
  },
  {
    id: 'sw-1007',
    status: 'completed',
    at: '2026-10-14T18:41:00+05:30',
    station_code: 'EVIDEMO01',
    slot_in: 2,
    slot_out: 1,
    gave: { serial: S.a, soc: 22 },
    took: { serial: S.c, soc: 100 },
    included_in_plan: true,
    price_rupees: 0,
  },
  {
    id: 'sw-1006',
    status: 'completed',
    at: '2026-10-13T08:05:00+05:30',
    station_code: 'EVIDEMO02',
    slot_in: 3,
    slot_out: 6,
    gave: { serial: S.c, soc: 11 },
    took: { serial: S.e, soc: 100 },
    included_in_plan: true,
    price_rupees: 0,
  },
  {
    id: 'sw-1005',
    status: 'cancelled',
    at: '2026-10-12T20:30:00+05:30',
    station_code: 'EVIDEMO03',
    slot_in: 0,
    slot_out: 0,
    gave: { serial: S.d, soc: 18 },
    took: { serial: '—', soc: 0 },
    included_in_plan: true,
    price_rupees: 0,
  },
  {
    id: 'sw-1004',
    status: 'completed',
    at: '2026-10-11T13:22:00+05:30',
    station_code: 'EVIDEMO01',
    slot_in: 1,
    slot_out: 4,
    gave: { serial: S.d, soc: 16 },
    took: { serial: S.a, soc: 100 },
    included_in_plan: true,
    price_rupees: 0,
  },
];

const ALERTS: AppAlert[] = [
  {
    id: 'al-1',
    severity: 'warn',
    title: 'Slot left open',
    body: 'Slot 3 was not closed after collection at EVIDEMO01.',
    at: '2026-10-17T10:43:00+05:30',
    read: false,
  },
  {
    id: 'al-2',
    severity: 'danger',
    title: 'A flap is stuck part-open',
    body: 'Bay 3 has reported OPENING across 4 telemetry frames without ever reporting OPENED. The lock may not have released. Nothing has been assumed about it — the swap is still waiting.',
    at: '2026-10-17T10:43:00+05:30',
    read: false,
  },
  {
    id: 'al-3',
    severity: 'danger',
    title: 'A flap is stuck part-open',
    body: 'Bay 3 has reported OPENING across 4 telemetry frames without ever reporting OPENED. The lock may not have released. Nothing has been assumed about it — the swap is still waiting.',
    at: '2026-10-17T09:59:00+05:30',
    read: false,
  },
  {
    id: 'al-4',
    severity: 'warn',
    title: 'Slot left open',
    body: 'Slot 6 was not closed after collection at EVIDEMO04.',
    at: '2026-10-16T21:05:00+05:30',
    read: true,
  },
  {
    id: 'al-5',
    severity: 'info',
    title: 'Swap force-closed by an operator',
    body: '1 swap was closed as the swap did finish, not for any fault reason.',
    at: '2026-10-16T21:01:00+05:30',
    read: true,
  },
  {
    id: 'al-6',
    severity: 'info',
    title: 'Your plan renews soon',
    body: 'Unlimited Monthly renews on 29 Oct 2026. Auto-pay is enabled, nothing to do.',
    at: '2026-10-15T08:00:00+05:30',
    read: true,
  },
];

const LEDGER: LedgerEntry[] = [
  { id: 'tx-1', direction: 'debit', amount_rupees: 2499, type: 'plan_purchase', note: 'Unlimited Monthly — Oct', at: '2026-09-29T10:00:00+05:30' },
  { id: 'tx-2', direction: 'credit', amount_rupees: 3000, type: 'topup', note: 'Added via UPI', at: '2026-09-29T09:58:00+05:30' },
  { id: 'tx-3', direction: 'debit', amount_rupees: 0, type: 'swap_fee', note: 'Swap at EVIDEMO01 — included in plan', at: '2026-10-16T16:56:00+05:30' },
  { id: 'tx-4', direction: 'credit', amount_rupees: 2000, type: 'topup', note: 'Added via Card', at: '2026-10-10T19:30:00+05:30' },
];

export const SUPPORT = {
  helpline: '+91 124 456 7890',
  hours: 'Answered 24 x 7',
  topics: [
    { id: 't1', title: 'A slot won’t open', body: 'If the authorised slot does not open within a few seconds, do not force it. Cancel the swap from the app and start again — you are never charged for a swap that does not complete.' },
    { id: 't2', title: 'My battery was rejected', body: 'The cabinet verifies every returned pack. If it is rejected, the pack is handed back to you and nothing is debited. Contact the station helpline if it keeps happening.' },
    { id: 't3', title: 'Station shows offline', body: 'An offline station is not reporting its stock, so a swap cannot be started there. Pick another nearby station from the list or map.' },
    { id: 't4', title: 'Change my plan', body: 'To change your plan, contact support. Changes take effect from the next billing cycle — your current unlimited swaps keep working until then.' },
    { id: 't5', title: 'Update my vehicle', body: 'Your fleet operator links bikes to your account. If your vehicle is wrong or missing, ask your operator to update it.' },
  ] as SupportTopic[],
};

/** Rich, populated persona — the impressive demo. */
export const RICH: AccountSnapshot = {
  vehicle: VEHICLE,
  plan: PLAN,
  swaps_today: 2,
  wallet_balance_rupees: 501,
  history: HISTORY,
  alerts: ALERTS,
  ledger: LEDGER,
};

/** Faithful empty persona — exactly like sir's current screenshots. */
export const EMPTY: AccountSnapshot = {
  vehicle: null,
  plan: null,
  swaps_today: 0,
  wallet_balance_rupees: 0,
  history: [],
  alerts: ALERTS.filter((a) => a.severity !== 'info').slice(0, 2),
  ledger: [],
};

export { PLAN, VEHICLE };
