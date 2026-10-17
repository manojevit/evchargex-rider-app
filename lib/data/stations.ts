import type { Slot, Station } from './types';

/**
 * Builds a 9-slot cabinet. The default layout mirrors sir's real Sector 44
 * screenshot: slots 1-4 charged (100/98/94/91), 5-6 charging (62/41),
 * 7-8 empty, 9 charged (88).
 */
function cabinet(prefix: string, layout?: Slot['state'][]): Slot[] {
  const states: Slot['state'][] =
    layout ?? ['charged', 'charged', 'charged', 'charged', 'charging', 'charging', 'empty', 'empty', 'charged'];
  const socByState: Record<string, number[]> = {
    charged: [100, 98, 94, 91, 88, 97, 92],
    charging: [62, 41, 55, 38],
    empty: [],
    fault: [],
  };
  const pick: Record<string, number> = { charged: 0, charging: 0, empty: 0, fault: 0 };
  return states.map((state, i) => {
    const n = i + 1;
    if (state === 'empty' || state === 'fault') {
      return { slot_number: n, state, soc: null, serial: state === 'fault' ? `${prefix}${1340 + n}` : null };
    }
    const pool = socByState[state];
    const soc = pool[pick[state] % pool.length];
    pick[state] += 1;
    return { slot_number: n, state, soc, serial: `${prefix}${1342 + n}` };
  });
}

function chargedCount(slots: Slot[]): number {
  return slots.filter((s) => s.state === 'charged').length;
}

const raw: Omit<Station, 'charged' | 'slot_count'>[] = [
  {
    id: 'st-01',
    code: 'EVIDEMO01',
    name: 'Sector 44 Swap Point',
    area: 'Sector 44',
    city: 'Gurugram',
    address: 'Ground Floor, DSS 44, Sector 44 Market, Gurugram, Haryana 122003',
    status: 'online',
    open_hours: '24 x 7',
    helpline: '+91 124 456 7890',
    distance_km: 2.3,
    eta_mins: 8,
    slots: cabinet('INCBZG5145M'),
    map: { x: 0.32, y: 0.58 },
  },
  {
    id: 'st-02',
    code: 'EVIDEMO02',
    name: 'Connaught Place Swap Point',
    area: 'Connaught Place',
    city: 'New Delhi',
    address: 'Block A, Connaught Place, New Delhi, Delhi 110001',
    status: 'online',
    open_hours: '24 x 7',
    helpline: '+91 11 4567 8900',
    distance_km: 5.6,
    eta_mins: 14,
    slots: cabinet('INCBZG5241K', ['charged', 'charged', 'charging', 'charged', 'empty', 'charged', 'charging', 'empty', 'charged']),
    map: { x: 0.62, y: 0.3 },
  },
  {
    id: 'st-03',
    code: 'EVIDEMO03',
    name: 'Karol Bagh Swap Hub',
    area: 'Karol Bagh',
    city: 'New Delhi',
    address: 'Pusa Road, Karol Bagh, New Delhi, Delhi 110005',
    status: 'online',
    open_hours: '24 x 7',
    helpline: '+91 11 4567 8911',
    distance_km: 8.1,
    eta_mins: 18,
    slots: cabinet('INCBZG5319L', ['charged', 'charging', 'charged', 'charged', 'charged', 'empty', 'charging', 'charged', 'empty']),
    map: { x: 0.5, y: 0.24 },
  },
  {
    id: 'st-04',
    code: 'EVIDEMO04',
    name: 'Cyber Hub Swap Point',
    area: 'DLF Cyber City',
    city: 'Gurugram',
    address: 'DLF Cyber Hub, DLF Phase 2, Gurugram, Haryana 122002',
    status: 'online',
    open_hours: '24 x 7',
    helpline: '+91 124 456 7822',
    distance_km: 4.2,
    eta_mins: 12,
    slots: cabinet('INCBZG5412M', ['charged', 'charged', 'charged', 'charging', 'charged', 'charged', 'empty', 'charged', 'charging']),
    map: { x: 0.28, y: 0.44 },
  },
  {
    id: 'st-05',
    code: 'EVIDEMO05',
    name: 'Saket Metro Swap Point',
    area: 'Saket',
    city: 'New Delhi',
    address: 'Press Enclave Road, Saket, New Delhi, Delhi 110017',
    status: 'offline',
    open_hours: '24 x 7',
    helpline: '+91 11 4567 8933',
    distance_km: 6.9,
    eta_mins: 17,
    slots: cabinet('INCBZG5555N', ['fault', 'empty', 'empty', 'fault', 'empty', 'empty', 'empty', 'fault', 'empty']),
    map: { x: 0.55, y: 0.52 },
  },
  {
    id: 'st-06',
    code: 'EVIDEMO06',
    name: 'Noida Sector 18 Swap Hub',
    area: 'Sector 18',
    city: 'Noida',
    address: 'Atta Market, Sector 18, Noida, Uttar Pradesh 201301',
    status: 'online',
    open_hours: '24 x 7',
    helpline: '+91 120 456 7890',
    distance_km: 11.4,
    eta_mins: 24,
    slots: cabinet('INCBZG5620P', ['charged', 'charged', 'charged', 'charged', 'charged', 'charging', 'charged', 'empty', 'charged']),
    map: { x: 0.74, y: 0.46 },
  },
  {
    id: 'st-07',
    code: 'EVIDEMO07',
    name: 'Dwarka Sector 10 Swap Point',
    area: 'Sector 10',
    city: 'New Delhi',
    address: 'Dwarka Sector 10, New Delhi, Delhi 110075',
    status: 'online',
    open_hours: '24 x 7',
    helpline: '+91 11 4567 8944',
    distance_km: 9.3,
    eta_mins: 21,
    slots: cabinet('INCBZG5701Q', ['charging', 'charged', 'charged', 'empty', 'charged', 'charged', 'charging', 'charged', 'empty']),
    map: { x: 0.38, y: 0.2 },
  },
  {
    id: 'st-08',
    code: 'EVIDEMO08',
    name: 'Faridabad NIT Swap Hub',
    area: 'NIT',
    city: 'Faridabad',
    address: 'NIT 1, Faridabad, Haryana 121001',
    status: 'offline',
    open_hours: '06:00 – 23:00',
    helpline: '+91 129 456 7890',
    distance_km: 14.8,
    eta_mins: 29,
    slots: cabinet('INCBZG5810R', ['empty', 'fault', 'empty', 'empty', 'charged', 'empty', 'fault', 'empty', 'empty']),
    map: { x: 0.46, y: 0.78 },
  },
];

export const STATIONS: Station[] = raw.map((s) => ({
  ...s,
  slot_count: s.slots.length,
  charged: chargedCount(s.slots),
}));

export function getStation(id: string): Station | undefined {
  return STATIONS.find((s) => s.id === id || s.code === id);
}
