import React from 'react';
import { type NavProps, type Page } from '../data/events';

const tabs: { label: string; page: Page; icon: (active: boolean) => React.ReactElement }[] = [
  {
    label: 'Home',
    page: 'home',
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? '#C1440E' : 'none'} stroke={a ? '#C1440E' : '#9A8B82'} strokeWidth={1.8}>
        <path d="M3 12L12 3l9 9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Radar',
    page: 'radar',
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C1440E' : '#9A8B82'} strokeWidth={1.8}>
        <circle cx="12" cy="12" r="2" fill={a ? '#C1440E' : '#9A8B82'} />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    label: 'Calendar',
    page: 'calendar',
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C1440E' : '#9A8B82'} strokeWidth={1.8}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <rect x="8" y="14" width="3" height="3" rx="0.5" fill={a ? '#C1440E' : '#9A8B82'} stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Events',
    page: 'events',
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C1440E' : '#9A8B82'} strokeWidth={1.8}>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" />
        <line x1="9" y1="16" x2="13" y2="16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Mine',
    page: 'my-requests',
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#C1440E' : '#9A8B82'} strokeWidth={1.8}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav({ navigate, currentPage }: NavProps) {
  const active = (p: Page) =>
    currentPage === p ||
    (p === 'home' && ['jugaad-success', 'find-jugaad'].includes(currentPage)) ||
    (p === 'events' && ['event-detail', 'request-pass', 'request-success'].includes(currentPage));

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-1"
      style={{
        background: 'rgba(250,247,242,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(26,22,18,0.09)',
        paddingTop: 6,
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      {tabs.map(({ label, page, icon }) => (
        <button
          key={page}
          onClick={() => navigate(page)}
          className="flex flex-col items-center gap-[3px] py-1 px-2 min-w-[52px] transition-opacity"
          style={{ opacity: active(page) ? 1 : 0.55 }}
        >
          {icon(active(page))}
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.05em', color: active(page) ? '#C1440E' : '#9A8B82', textTransform: 'uppercase' }}>
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
