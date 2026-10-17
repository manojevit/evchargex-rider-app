/**
 * EVCHARGEX demo — data model.
 *
 * Frontend-only prototype: these are the shapes the dummy data uses. Content is
 * lifted from the real "Sir-desing" app (user Manoj, EVIDEMO stations across
 * Delhi-NCR, INCBZG battery serials, 9-slot cabinets) and dressed in the
 * polished EVCHARGEX design. No backend, no network.
 */

export type StationStatus = 'online' | 'offline';

/** A single slot in a cabinet, mirroring sir's station-detail grid. */
export type SlotState = 'charged' | 'charging' | 'empty' | 'fault';

export interface Slot {
  slot_number: number;
  state: SlotState;
  /** State of charge 0-100; null when the slot is empty. */
  soc: number | null;
  serial: string | null;
}

export interface Station {
  id: string;
  code: string; // EVIDEMO01
  name: string; // Sector 44 Swap Point
  area: string; // Sector 44
  city: string; // Gurugram
  address: string;
  status: StationStatus;
  open_hours: string; // "24 x 7"
  helpline: string;
  distance_km: number | null;
  eta_mins: number | null;
  /** Count of charged packs ready to dispense. */
  charged: number;
  slot_count: number;
  slots: Slot[];
  /** Normalised 0-1 position for the stylised map (x = left→right, y = top→bottom). */
  map: { x: number; y: number };
}

export type SwapStatus = 'completed' | 'cancelled' | 'failed';

export interface SwapHistoryRow {
  id: string;
  status: SwapStatus;
  at: string; // ISO timestamp
  station_code: string;
  slot_in: number;
  slot_out: number;
  gave: { serial: string; soc: number };
  took: { serial: string; soc: number };
  included_in_plan: boolean;
  price_rupees: number;
}

export type AlertSeverity = 'warn' | 'danger' | 'info';

export interface AppAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  body: string;
  at: string; // ISO timestamp
  read: boolean;
}

export interface LedgerEntry {
  id: string;
  direction: 'credit' | 'debit';
  amount_rupees: number;
  type: 'topup' | 'swap_fee' | 'plan_purchase' | 'refund' | 'adjustment';
  note: string;
  at: string;
}

export interface Plan {
  code: string;
  name: string; // Unlimited Monthly
  price_rupees: number; // 2499
  period_label: string; // "/ month"
  renews_on: string; // "29 Oct 2026"
  auto_pay: boolean;
  benefits: { title: string; detail: string }[];
  this_month_swaps: number;
  saved_rupees: number;
  health_index: number; // 98.4
}

export interface Vehicle {
  plate: string; // HR 26 DK 8055
  model: string; // Lectrix LXS
  battery_pct: number; // 68
  range_km: number; // 45
}

export interface Rider {
  name: string;
  phone: string;
  avatar_letter: string;
}

export interface SupportTopic {
  id: string;
  title: string;
  body: string;
}

/** The two demo personas the in-app toggle flips between. */
export interface AccountSnapshot {
  vehicle: Vehicle | null;
  plan: Plan | null;
  swaps_today: number;
  wallet_balance_rupees: number;
  history: SwapHistoryRow[];
  alerts: AppAlert[];
  ledger: LedgerEntry[];
}
