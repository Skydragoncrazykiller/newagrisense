import React from "react";
import {
  riskTokens,
  typography,
  radius,
  transition,
  spacing,
} from "../../lib/tokens";

/**
 * RiskBadge — indikator risiko OPT dalam format pill.
 *
 * Props:
 *   level : 'rendah' | 'sedang' | 'tinggi'
 *   size  : 'sm' | 'md' (default md)
 *
 * Contoh pemakaian:
 *   <RiskBadge level="tinggi" />
 *   <RiskBadge level="sedang" size="sm" />
 */
const RiskBadge = ({ level = "rendah", size = "md" }) => {
  const token = riskTokens(level);

  const label =
    {
      rendah: "Risiko Rendah",
      sedang: "Risiko Sedang",
      tinggi: "Risiko Tinggi",
    }[level?.toLowerCase()] ?? "Tidak Diketahui";

  const sizeStyles = {
    sm: {
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.xs,
      dotSize: "6px",
      gap: spacing.sm,
    },
    md: {
      padding: `6px ${spacing.lg}`,
      fontSize: typography.sm,
      dotSize: "8px",
      gap: spacing.sm,
    },
  };

  const s = sizeStyles[size] ?? sizeStyles.md;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        background: token.bg,
        color: token.text,
        border: `0.5px solid ${token.border}`,
        borderRadius: radius.full,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: typography.fontBody,
        fontWeight: typography.medium,
        lineHeight: typography.tight,
        transition: `opacity ${transition.fast}`,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
      // Accessibility: beri konteks untuk screen reader
      role="status"
      aria-label={`Indeks risiko: ${label}`}
    >
      {/* Dot indikator */}
      <span
        style={{
          width: s.dotSize,
          height: s.dotSize,
          borderRadius: radius.full,
          background: token.dot,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
};

export default RiskBadge;
