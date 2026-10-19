import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { EMPTY, RICH, RIDER, TICKETS } from './data/account';
import type { AccountSnapshot, Rider, Ticket } from './data/types';

/**
 * In-memory app store for the demo. No backend — this just holds:
 *  - whether the rider is "signed in" (drives the auth flow),
 *  - which persona is active (rich ↔ empty), toggled live from Settings,
 *  - read-state of alerts so "Mark all read" feels real.
 */

type Persona = 'rich' | 'empty';

interface StoreValue {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;

  persona: Persona;
  setPersona: (p: Persona) => void;
  togglePersona: () => void;

  rider: Rider;
  updateName: (name: string) => void;
  account: AccountSnapshot;

  email: string;
  emailVerified: boolean;
  updateEmail: (email: string) => void;
  verifyEmail: () => void;

  language: string;
  setLanguage: (lang: string) => void;

  unreadAlerts: number;
  markAllAlertsRead: () => void;
  markAlertRead: (id: string) => void;

  tickets: Ticket[];
  addTicket: (category: string, body: string) => Ticket;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [persona, setPersonaState] = useState<Persona>('rich');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [riderName, setRiderName] = useState(RIDER.name);
  const [language, setLanguage] = useState('English');
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);

  const addTicket = useCallback((category: string, body: string): Ticket => {
    const ticket: Ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      body: body.trim(),
      status: 'open',
      at: new Date().toISOString(),
    };
    setTickets((prev) => [ticket, ...prev]);
    return ticket;
  }, []);

  const rider = useMemo<Rider>(() => ({ ...RIDER, name: riderName }), [riderName]);
  const updateName = useCallback((name: string) => setRiderName(name.trim() || RIDER.name), []);

  // Editing the email always drops its verified status until re-verified.
  const updateEmail = useCallback((next: string) => {
    setEmail((prev) => {
      if (prev !== next.trim()) setEmailVerified(false);
      return next.trim();
    });
  }, []);
  const verifyEmail = useCallback(() => setEmailVerified(true), []);

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p);
    setReadIds(new Set());
  }, []);

  const base = persona === 'rich' ? RICH : EMPTY;

  // Apply local read-state overrides on top of the persona's alerts.
  const account = useMemo<AccountSnapshot>(() => {
    return {
      ...base,
      alerts: base.alerts.map((a) => (readIds.has(a.id) ? { ...a, read: true } : a)),
    };
  }, [base, readIds]);

  const unreadAlerts = account.alerts.filter((a) => !a.read).length;

  const signIn = useCallback(() => setSignedIn(true), []);
  const signOut = useCallback(() => {
    setSignedIn(false);
    setReadIds(new Set());
  }, []);

  const togglePersona = useCallback(() => {
    setPersonaState((p) => (p === 'rich' ? 'empty' : 'rich'));
    setReadIds(new Set());
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setReadIds(new Set(base.alerts.map((a) => a.id)));
  }, [base.alerts]);

  const markAlertRead = useCallback((id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  }, []);

  const value: StoreValue = {
    signedIn,
    signIn,
    signOut,
    persona,
    setPersona,
    togglePersona,
    rider,
    updateName,
    account,
    email,
    emailVerified,
    updateEmail,
    verifyEmail,
    language,
    setLanguage,
    unreadAlerts,
    markAllAlertsRead,
    markAlertRead,
    tickets,
    addTicket,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
