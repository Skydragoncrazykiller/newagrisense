import React, { useState } from "react";
import BottomNav from "../components/layout/BottomNav";
import RiskBadge from "../components/ui/RiskBadge";
import Card from "../components/ui/Card";
import { colors, typography, spacing, radius, transition } from "../lib/tokens";

// ---------------------------------------------------------------------------
// Data simulasi — nanti dari GET /rekomendasi
// ---------------------------------------------------------------------------

const DEMO_DATA = {
  riskLevel: "tinggi",
  lastChecked: "14:35 WIB",
  alasan:
    "Curah hujan bulan ini mencapai 215 mm/bln dengan kelembapan 87%. Kondisi ini meningkatkan risiko serangan Blast dan Hawar Pelepah secara signifikan.",
  pupuk: [
    {
      jenis: "Urea",
      dosis: "150 kg/ha",
      catatan:
        "Tunda aplikasi jika hujan deras. Sebarkan merata di antara barisan.",
    },
    {
      jenis: "NPK (15-15-15)",
      dosis: "100 kg/ha",
      catatan: "Aplikasikan pada fase anakan aktif.",
    },
  ],
  pestisida: [
    {
      opt: "Blast & Hawar Pelepah",
      produk: "Mancozeb 80 WP",
      dosis: "2 g/L air — 400 L/ha",
      frekuensi: "2x seminggu selama 2 minggu",
      catatan: "Semprotkan pagi hari saat angin tenang.",
    },
    {
      opt: "Hawar Pelepah",
      produk: "Carbendazim 50 WP",
      dosis: "1 g/L air — 500 L/ha",
      frekuensi: "Saat anakan & fase berbunga",
      catatan: "Fungisida sistemik, rotasi dengan Mancozeb.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Sub-komponen lokal
// ---------------------------------------------------------------------------

const SectionTitle = ({ children }) => (
  <div
    style={{
      fontSize: typography.xs,
      fontFamily: typography.fontBody,
      fontWeight: typography.medium,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: spacing.md,
    }}
  >
    {children}
  </div>
);

// Baris label + nilai dalam kartu detail
const DetailRow = ({ label, value, highlight = false }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing.lg,
      padding: `${spacing.sm} 0`,
    }}
  >
    <span
      style={{
        fontSize: typography.sm,
        fontFamily: typography.fontBody,
        color: colors.textMuted,
        flexShrink: 0,
        lineHeight: typography.normal,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: typography.sm,
        fontFamily: typography.fontBody,
        fontWeight: highlight ? typography.semibold : typography.regular,
        color: highlight ? colors.textPrimary : colors.textSecondary,
        textAlign: "right",
        lineHeight: typography.normal,
      }}
    >
      {value}
    </span>
  </div>
);

const Divider = () => (
  <div
    style={{
      height: "0.5px",
      background: colors.borderLight,
      margin: `${spacing.xs} 0`,
    }}
  />
);

// Kartu satu item pupuk
const PupukCard = ({ jenis, dosis, catatan }) => (
  <Card variant="default" padding={`${spacing.md} ${spacing.lg}`}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing.sm,
        marginBottom: spacing.sm,
      }}
    >
      {/* Ikon daun kecil */}
      <svg
        width="16"
        height="16"
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
      <span
        style={{
          fontSize: typography.base,
          fontFamily: typography.fontHeading,
          fontWeight: typography.semibold,
          color: colors.textPrimary,
        }}
      >
        {jenis}
      </span>
    </div>

    <DetailRow label="Dosis" value={dosis} highlight />
    {catatan && (
      <>
        <Divider />
        <p
          style={{
            fontSize: typography.sm,
            fontFamily: typography.fontBody,
            color: colors.textSecondary,
            lineHeight: typography.loose,
            margin: `${spacing.sm} 0 0`,
          }}
        >
          {catatan}
        </p>
      </>
    )}
  </Card>
);

// Kartu satu item pestisida — lebih detail dari pupuk
const PestisidaCard = ({ opt, produk, dosis, frekuensi, catatan }) => (
  <Card variant="default" padding={`${spacing.md} ${spacing.lg}`}>
    {/* Header: OPT target */}
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: colors.riskHigh.bg,
        color: colors.riskHigh.text,
        border: `0.5px solid ${colors.riskHigh.border}`,
        borderRadius: radius.full,
        padding: `3px ${spacing.md}`,
        fontSize: typography.xs,
        fontWeight: typography.medium,
        marginBottom: spacing.md,
      }}
    >
      {/* Ikon bug kecil */}
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8l2-2M8 8L6 6M16 16l2 2M8 16l-2 2M20 12h2M2 12h2M12 2v2M12 20v2" />
      </svg>
      {opt}
    </div>

    <div
      style={{
        fontSize: typography.base,
        fontFamily: typography.fontHeading,
        fontWeight: typography.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
      }}
    >
      {produk}
    </div>

    <DetailRow label="Dosis" value={dosis} highlight />
    <Divider />
    <DetailRow label="Frekuensi" value={frekuensi} />

    {catatan && (
      <>
        <Divider />
        <p
          style={{
            fontSize: typography.sm,
            fontFamily: typography.fontBody,
            color: colors.textSecondary,
            lineHeight: typography.loose,
            margin: `${spacing.sm} 0 0`,
          }}
        >
          {catatan}
        </p>
      </>
    )}
  </Card>
);

// ---------------------------------------------------------------------------
// Halaman Rekomendasi
// ---------------------------------------------------------------------------

const Rekomendasi = ({ onNavigate }) => {
  const [activeNav, setActiveNav] = useState("rekomendasi");
  const d = DEMO_DATA;

  const handleNavChange = (id) => {
    setActiveNav(id);
    onNavigate?.(id);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: colors.bgPage,
        fontFamily: typography.fontBody,
      }}
    >
      <main
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: `${spacing.xl} ${spacing.lg}`,
          paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px) + 16px)",
          boxSizing: "border-box",
        }}
        id="main-content"
        aria-label="Detail rekomendasi pupuk dan pestisida"
      >
        {/* Header halaman */}
        <div style={{ marginBottom: spacing.xl }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: spacing.sm,
            }}
          >
            <h1
              style={{
                fontSize: typography.xl,
                fontFamily: typography.fontHeading,
                fontWeight: typography.bold,
                color: colors.textPrimary,
                margin: 0,
              }}
            >
              Rekomendasi
            </h1>
            <RiskBadge level={d.riskLevel} />
          </div>
          <p
            style={{
              fontSize: typography.sm,
              fontFamily: typography.fontBody,
              color: colors.textMuted,
              margin: `${spacing.xs} 0 0`,
            }}
          >
            Dihitung pukul {d.lastChecked}
          </p>
        </div>

        {/* Alasan rekomendasi */}
        <Card
          variant="muted"
          padding={`${spacing.md} ${spacing.lg}`}
          style={{ marginBottom: spacing.xl }}
        >
          <div style={{ display: "flex", gap: spacing.sm }}>
            {/* Ikon info */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.primaryLight}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0, marginTop: "2px" }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p
              style={{
                fontSize: typography.sm,
                fontFamily: typography.fontBody,
                color: colors.textSecondary,
                lineHeight: typography.loose,
                margin: 0,
              }}
            >
              {d.alasan}
            </p>
          </div>
        </Card>

        {/* Seksi pupuk */}
        <section style={{ marginBottom: spacing.xl }}>
          <SectionTitle>Pupuk</SectionTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
            }}
          >
            {d.pupuk.map((item, i) => (
              <PupukCard key={i} {...item} />
            ))}
          </div>
        </section>

        {/* Seksi pestisida */}
        <section style={{ marginBottom: spacing.xl }}>
          <SectionTitle>Pestisida / Fungisida</SectionTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
            }}
          >
            {d.pestisida.map((item, i) => (
              <PestisidaCard key={i} {...item} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav active={activeNav} onChange={handleNavChange} />
    </div>
  );
};

export default Rekomendasi;
