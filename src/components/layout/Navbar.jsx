import React from "react";
import {
  colors,
  typography,
  spacing,
  radius,
  transition,
} from "../../lib/tokens";

/**
 * Navbar — header top untuk desktop (≥768px).
 * Di mobile, digantikan oleh BottomNav.
 *
 * Props:
 *   title    : string — nama halaman aktif
 *   subtitle : string — info konteks, e.g. 'Ladang Pak Dedi · Subang'
 */

// Logo mark sederhana — inisial "AS" dalam lingkaran hijau
const LogoMark = () => (
  <div
    style={{
      width: "36px",
      height: "36px",
      borderRadius: "10px",
      background: colors.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
    aria-hidden="true"
  >
    <span
      style={{
        fontSize: "13px",
        fontFamily: typography.fontHeading,
        fontWeight: typography.bold,
        color: "#FFFFFF",
        letterSpacing: "0.02em",
      }}
    >
      AS
    </span>
  </div>
);

const Navbar = ({ title = "AgriSense", subtitle = "" }) => {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        background: "rgba(240,247,244,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `0.5px solid ${colors.borderLight}`,
        zIndex: 50,
        // Hanya tampil di desktop
        display: "none",
      }}
      // CSS media query tidak bisa inline — handle via className atau
      // wrapper dengan visibility toggle di Dashboard.jsx
      // Alternatif: gunakan style tag di index.html atau CSS module
      aria-label="Header navigasi"
      className="agrisense-navbar"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacing.md,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: `${spacing.md} ${spacing.xl}`,
          height: "60px",
          boxSizing: "border-box",
        }}
      >
        <LogoMark />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: typography.lg,
              fontFamily: typography.fontHeading,
              fontWeight: typography.semibold,
              color: colors.textPrimary,
              lineHeight: typography.tight,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: typography.xs,
                fontFamily: typography.fontBody,
                color: colors.textMuted,
                marginTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
