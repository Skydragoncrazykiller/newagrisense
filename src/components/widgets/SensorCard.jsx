import React from "react";
import Card from "../ui/Card";
import { colors, typography, spacing } from "../../lib/tokens";

/**
 * SensorCard — menampilkan satu pembacaan sensor AWS.
 *
 * Props:
 *   label     : string   — nama sensor, e.g. 'Suhu Udara'
 *   value     : number   — nilai terkini
 *   unit      : string   — satuan, e.g. '°C', '%', 'mm'
 *   icon      : ReactNode — ikon SVG (dari lib/icons.js atau inline)
 *   updatedAt : string   — waktu pembaruan, e.g. '10 menit lalu'
 *   status    : 'normal' | 'warning' | 'danger' — warna aksen opsional
 */

// Threshold sederhana untuk warna aksen nilai
const accentColor = (status) => {
  if (status === "danger") return colors.riskHigh.dot;
  if (status === "warning") return colors.riskMedium.dot;
  return colors.primary;
};

const SensorCard = ({
  label = "Sensor",
  value = 0,
  unit = "",
  icon,
  updatedAt = "",
  status = "normal",
}) => {
  const accent = accentColor(status);

  return (
    <Card
      variant="default"
      style={{ display: "flex", alignItems: "center", gap: spacing.lg }}
    >
      {/* Ikon di lingkaran faint */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: colors.primaryFaint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Konten */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: typography.xs,
            fontFamily: typography.fontBody,
            fontWeight: typography.medium,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: spacing.xs,
          }}
        >
          {label}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span
            style={{
              fontSize: typography.data,
              fontFamily: typography.fontBody,
              fontWeight: typography.bold,
              color: accent,
              fontVariantNumeric: "tabular-nums",
              lineHeight: typography.tight,
            }}
          >
            {value}
          </span>
          <span
            style={{
              fontSize: typography.md,
              fontFamily: typography.fontBody,
              fontWeight: typography.regular,
              color: colors.textSecondary,
            }}
          >
            {unit}
          </span>
        </div>
      </div>

      {/* Timestamp pojok kanan bawah */}
      {updatedAt && (
        <div
          style={{
            fontSize: typography.xs,
            fontFamily: typography.fontBody,
            color: colors.textMuted,
            alignSelf: "flex-end",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          aria-label={`Diperbarui ${updatedAt}`}
        >
          {updatedAt}
        </div>
      )}
    </Card>
  );
};

export default SensorCard;
