import React from "react";
import { colors, typography, spacing, transition } from "../../lib/tokens";

/**
 * BottomNav — navigasi utama mobile AgriSense.
 *
 * 4 item: Dashboard, Rekomendasi, Proyeksi, Riwayat.
 * Sticky di bawah layar, respects safe area (iPhone notch/home bar).
 *
 * Props:
 *   active   : 'dashboard' | 'rekomendasi' | 'proyeksi' | 'riwayat'
 *   onChange : function(id) — dipanggil saat item di-tap
 */

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Beranda",
    icon: (active) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "rekomendasi",
    label: "Rekomendasi",
    icon: (active) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: "proyeksi",
    label: "Proyeksi",
    icon: (active) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "riwayat",
    label: "Riwayat",
    icon: (active) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const BottomNav = ({ active = "dashboard", onChange }) => {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: `0.5px solid ${colors.borderLight}`,
        // Safe area untuk iPhone home bar
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 100,
      }}
      aria-label="Navigasi utama"
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: "60px",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChange?.(item.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                background: "transparent",
                border: "none",
                padding: `${spacing.sm} ${spacing.xs}`,
                cursor: "pointer",
                color: isActive ? colors.primary : colors.textMuted,
                transition: `color ${transition.fast}`,
                // Touch target minimum 44px sudah terpenuhi karena height 60px
                WebkitTapHighlightColor: "transparent",
                outline: "none",
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              // Focus visible untuk keyboard nav
              onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid ${colors.primary}`;
                e.currentTarget.style.outlineOffset = "-2px";
                e.currentTarget.style.borderRadius = "8px";
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
            >
              {/* Ikon */}
              <span style={{ lineHeight: 1 }}>{item.icon(isActive)}</span>

              {/* Label */}
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: typography.fontBody,
                  fontWeight: isActive
                    ? typography.semibold
                    : typography.regular,
                  lineHeight: 1,
                  // Cegah text wrap di layar 320px
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "60px",
                }}
              >
                {item.label}
              </span>

              {/* Dot aktif */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "9999px",
                    background: colors.primary,
                  }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
