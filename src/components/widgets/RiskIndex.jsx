import React from "react";
import RiskBadge from "../ui/RiskBadge";
import {
  colors,
  typography,
  spacing,
  radius,
  transition,
} from "../../lib/tokens";

/**
 * RiskIndex — komponen utama indeks risiko OPT di Dashboard.
 *
 * Ini komponen paling prominent di halaman — harus visible zero-scroll
 * di mobile. Warna background berubah sesuai level risiko.
 *
 * Props:
 *   level       : 'rendah' | 'sedang' | 'tinggi'
 *   description : string — satu kalimat penjelasan singkat kondisi saat ini
 *                 e.g. 'Curah hujan tinggi meningkatkan risiko Blast dan Hawar Pelepah.'
 *   lastChecked : string — waktu kalkulasi terakhir, e.g. '14:35 WIB'
 */

// Token warna per level untuk background card besar
const levelCard = {
  rendah: {
    bg: "#EAF6F0",
    border: "#A8D5B8",
    labelColor: "#1B5E38",
    barColor: "#2D9B5A",
    barWidth: "33%",
    barBg: "#C5E8D2",
  },
  sedang: {
    bg: "#FEF7EC",
    border: "#F5CC8A",
    labelColor: "#7A4400",
    barColor: "#F4A261",
    barWidth: "66%",
    barBg: "#FADEB3",
  },
  tinggi: {
    bg: "#FDF0EF",
    border: "#F5AAAA",
    labelColor: "#7B1A1A",
    barColor: "#E63946",
    barWidth: "100%",
    barBg: "#FACACA",
  },
};

const RiskIndex = ({
  level = "rendah",
  description = "",
  lastChecked = "",
}) => {
  const key = level?.toLowerCase() ?? "rendah";
  const token = levelCard[key] ?? levelCard.rendah;

  return (
    <div
      style={{
        background: token.bg,
        border: `1px solid ${token.border}`,
        borderRadius: radius.lg,
        padding: `${spacing.xl} ${spacing.xl}`,
        transition: `background ${transition.slow}, border-color ${transition.slow}`,
      }}
      role="region"
      aria-label={`Indeks risiko saat ini: ${level}`}
    >
      {/* Baris atas: label kecil + badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: spacing.sm,
          marginBottom: spacing.lg,
        }}
      >
        <span
          style={{
            fontSize: typography.xs,
            fontFamily: typography.fontBody,
            fontWeight: typography.medium,
            color: token.labelColor,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Indeks Risiko OPT
        </span>

        <RiskBadge level={level} size="md" />
      </div>

      {/* Progress bar risiko */}
      <div
        style={{
          background: token.barBg,
          borderRadius: radius.full,
          height: "8px",
          overflow: "hidden",
          marginBottom: spacing.lg,
        }}
        role="img"
        aria-label={`Level risiko: ${level}`}
      >
        <div
          style={{
            width: token.barWidth,
            height: "100%",
            background: token.barColor,
            borderRadius: radius.full,
            transition: `width ${transition.slow}`,
          }}
        />
      </div>

      {/* Kalimat penjelasan */}
      {description && (
        <p
          style={{
            fontSize: typography.base,
            fontFamily: typography.fontBody,
            fontWeight: typography.regular,
            color: token.labelColor,
            lineHeight: typography.loose,
            margin: 0,
            marginBottom: lastChecked ? spacing.lg : 0,
          }}
        >
          {description}
        </p>
      )}

      {/* Waktu kalkulasi */}
      {lastChecked && (
        <div
          style={{
            fontSize: typography.xs,
            fontFamily: typography.fontBody,
            color: token.labelColor,
            opacity: 0.65,
          }}
        >
          Dihitung pukul {lastChecked}
        </div>
      )}
    </div>
  );
};

export default RiskIndex;
