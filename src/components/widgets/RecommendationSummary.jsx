import React from "react";
import Card from "../ui/Card";
import { colors, typography, spacing, radius } from "../../lib/tokens";

/**
 * RecommendationSummary — ringkasan rekomendasi pupuk & pestisida hari ini.
 *
 * Tampil di Dashboard Utama sebagai preview singkat.
 * Untuk detail lengkap, user navigasi ke halaman Rekomendasi.
 *
 * Props:
 *   pupuk     : Array<{ jenis: string, dosis: string }>
 *               e.g. [{ jenis: 'Urea', dosis: '150 kg/ha' }]
 *   pestisida : Array<{ jenis: string, dosis: string }>
 *               e.g. [{ jenis: 'Mancozeb', dosis: '400 L air/ha' }]
 *   onDetail  : function — callback tombol "Lihat Detail"
 */

// Ikon kecil inline SVG — tanpa emoji, konsisten dengan UUPM rule
const IconLeaf = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.primary}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const IconDroplet = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.riskMedium.dot}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

// Satu baris item rekomendasi
const RecommendItem = ({ icon, jenis, dosis }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      padding: `${spacing.sm} 0`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: spacing.sm }}>
      {icon}
      <span
        style={{
          fontSize: typography.base,
          fontFamily: typography.fontBody,
          fontWeight: typography.medium,
          color: colors.textPrimary,
        }}
      >
        {jenis}
      </span>
    </div>
    <span
      style={{
        fontSize: typography.sm,
        fontFamily: typography.fontBody,
        fontWeight: typography.regular,
        color: colors.textSecondary,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {dosis}
    </span>
  </div>
);

// Divider tipis
const Divider = () => (
  <div
    style={{
      height: "0.5px",
      background: colors.borderLight,
      margin: `${spacing.xs} 0`,
    }}
  />
);

// Header seksi kecil
const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: typography.xs,
      fontFamily: typography.fontBody,
      fontWeight: typography.medium,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: spacing.xs,
    }}
  >
    {children}
  </div>
);

const RecommendationSummary = ({ pupuk = [], pestisida = [], onDetail }) => {
  const hasPupuk = pupuk.length > 0;
  const hasPestisida = pestisida.length > 0;
  const isEmpty = !hasPupuk && !hasPestisida;

  return (
    <Card variant="default" padding={`${spacing.lg} ${spacing.xl}`}>
      {/* Header card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: spacing.lg,
        }}
      >
        <span
          style={{
            fontSize: typography.md,
            fontFamily: typography.fontHeading,
            fontWeight: typography.semibold,
            color: colors.textPrimary,
          }}
        >
          Rekomendasi Hari Ini
        </span>

        {onDetail && (
          <button
            onClick={onDetail}
            style={{
              fontSize: typography.sm,
              fontFamily: typography.fontBody,
              fontWeight: typography.medium,
              color: colors.primary,
              background: "transparent",
              border: "none",
              padding: `${spacing.xs} 0`,
              cursor: "pointer",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            aria-label="Lihat detail rekomendasi lengkap"
          >
            Lihat Detail
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* State kosong */}
      {isEmpty && (
        <div
          style={{
            textAlign: "center",
            padding: `${spacing.xl} 0`,
            color: colors.textMuted,
            fontSize: typography.base,
            fontFamily: typography.fontBody,
          }}
        >
          Belum ada data rekomendasi.
        </div>
      )}

      {/* Seksi pupuk */}
      {hasPupuk && (
        <div style={{ marginBottom: hasPestisida ? spacing.lg : 0 }}>
          <SectionLabel>Pupuk</SectionLabel>
          {pupuk.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <RecommendItem
                icon={<IconLeaf />}
                jenis={item.jenis}
                dosis={item.dosis}
              />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Seksi pestisida */}
      {hasPestisida && (
        <div>
          {hasPupuk && <Divider />}
          <SectionLabel>Pestisida / Fungisida</SectionLabel>
          {pestisida.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <RecommendItem
                icon={<IconDroplet />}
                jenis={item.jenis}
                dosis={item.dosis}
              />
            </React.Fragment>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecommendationSummary;
