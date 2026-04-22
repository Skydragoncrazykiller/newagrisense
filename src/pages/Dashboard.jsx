import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import SensorCard from "../components/widgets/SensorCard";
import RiskIndex from "../components/widgets/RiskIndex";
import RecommendationSummary from "../components/widgets/RecommendationSummary";
import { colors, spacing, typography } from "../lib/tokens";

// ---------------------------------------------------------------------------
// Ikon sensor — inline SVG, konsisten Lucide stroke style
// ---------------------------------------------------------------------------

const IconThermo = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.primary}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);

const IconDroplets = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.primary}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
  </svg>
);

const IconCloud = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.primary}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
    <line x1="8" y1="19" x2="8" y2="21" />
    <line x1="8" y1="13" x2="8" y2="15" />
    <line x1="16" y1="19" x2="16" y2="21" />
    <line x1="16" y1="13" x2="16" y2="15" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="12" y1="15" x2="12" y2="17" />
  </svg>
);

// ---------------------------------------------------------------------------
// Data simulasi — nanti diganti useSensorData hook yang fetch ke /sensor/latest
// ---------------------------------------------------------------------------

const DEMO_SENSOR = {
  suhu: 29,
  kelembapan: 87,
  curahHujan: 215,
  updatedAt: "10 menit lalu",
};

// Tentukan status sensor berdasarkan threshold sederhana
const sensorStatus = (key, value) => {
  if (key === "suhu")
    return value > 32 ? "danger" : value > 30 ? "warning" : "normal";
  if (key === "kelembapan") return value > 85 ? "warning" : "normal";
  if (key === "curahHujan")
    return value > 200 ? "danger" : value > 100 ? "warning" : "normal";
  return "normal";
};

// Derive risk level dari data sensor — logika sederhana untuk demo
// Rule engine sesungguhnya ada di backend /rekomendasi
const deriveRisk = ({ suhu, kelembapan, curahHujan }) => {
  if (curahHujan > 200 && kelembapan > 85) return "tinggi";
  if (curahHujan > 100 || kelembapan > 80) return "sedang";
  return "rendah";
};

const riskDescription = {
  rendah:
    "Kondisi cuaca saat ini aman. Lakukan monitoring rutin dan belum perlu aplikasi pestisida.",
  sedang:
    "Kelembapan cukup tinggi. Pantau kemunculan gejala Wereng dan Blast di petak ladang.",
  tinggi:
    "Curah hujan dan kelembapan tinggi meningkatkan risiko Blast dan Hawar Pelepah. Segera cek rekomendasi pestisida.",
};

const DEMO_REKOMENDASI = {
  pupuk: [
    { jenis: "Urea", dosis: "150 kg/ha" },
    { jenis: "NPK", dosis: "100 kg/ha" },
  ],
  pestisida: [
    { jenis: "Mancozeb", dosis: "400 L air/ha" },
    { jenis: "Carbendazim", dosis: "500 L air/ha" },
  ],
};

// ---------------------------------------------------------------------------
// Komponen PageHeader — judul halaman di dalam konten (mobile)
// ---------------------------------------------------------------------------

const PageHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: spacing.xl }}>
    <h1
      style={{
        fontSize: typography.xl,
        fontFamily: typography.fontHeading,
        fontWeight: typography.bold,
        color: colors.textPrimary,
        margin: 0,
        lineHeight: typography.tight,
      }}
    >
      {title}
    </h1>
    {subtitle && (
      <p
        style={{
          fontSize: typography.sm,
          fontFamily: typography.fontBody,
          color: colors.textMuted,
          margin: `${spacing.xs} 0 0`,
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Section wrapper — jarak antar blok konten
// ---------------------------------------------------------------------------

const Section = ({ label, children, style = {} }) => (
  <section style={{ marginBottom: spacing.xl, ...style }}>
    {label && (
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
        {label}
      </div>
    )}
    {children}
  </section>
);

// ---------------------------------------------------------------------------
// Dashboard — halaman utama
// ---------------------------------------------------------------------------

const Dashboard = ({ onNavigate }) => {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sensor, setSensor] = useState(DEMO_SENSOR);

  // Simulasi refresh data setiap 60 detik
  // Ganti dengan useSensorData() saat API backend tersedia
  useEffect(() => {
    const interval = setInterval(() => {
      // Variasi kecil untuk simulasi sensor "hidup"
      setSensor((prev) => ({
        ...prev,
        suhu: Math.round(prev.suhu + (Math.random() - 0.5) * 2),
        kelembapan: Math.min(
          100,
          Math.max(50, Math.round(prev.kelembapan + (Math.random() - 0.5) * 3)),
        ),
        updatedAt: "baru saja",
      }));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const riskLevel = deriveRisk(sensor);

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
      {/* Desktop header */}
      <Navbar title="AgriSense" subtitle="Ladang · Jawa Barat" />

      {/* Konten utama */}
      <main
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: `${spacing.xl} ${spacing.lg}`,
          // Ruang untuk BottomNav di mobile
          paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px) + 16px)",
          boxSizing: "border-box",
        }}
        id="main-content"
        aria-label="Konten dashboard utama"
      >
        {/* Judul halaman — hanya tampil di mobile */}
        <PageHeader
          title="Beranda"
          subtitle={`Diperbarui ${sensor.updatedAt}`}
        />

        {/* Indeks risiko — paling prominent, zero-scroll */}
        <Section>
          <RiskIndex
            level={riskLevel}
            description={riskDescription[riskLevel]}
            lastChecked="14:35 WIB"
          />
        </Section>

        {/* Widget sensor */}
        <Section label="Data Sensor Ladang">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
            }}
          >
            <SensorCard
              label="Suhu Udara"
              value={sensor.suhu}
              unit="°C"
              icon={<IconThermo />}
              updatedAt={sensor.updatedAt}
              status={sensorStatus("suhu", sensor.suhu)}
            />
            <SensorCard
              label="Kelembapan"
              value={sensor.kelembapan}
              unit="%"
              icon={<IconDroplets />}
              updatedAt={sensor.updatedAt}
              status={sensorStatus("kelembapan", sensor.kelembapan)}
            />
            <SensorCard
              label="Curah Hujan"
              value={sensor.curahHujan}
              unit="mm/bln"
              icon={<IconCloud />}
              updatedAt={sensor.updatedAt}
              status={sensorStatus("curahHujan", sensor.curahHujan)}
            />
          </div>
        </Section>

        {/* Ringkasan rekomendasi */}
        <Section label="Rekomendasi Hari Ini">
          <RecommendationSummary
            pupuk={DEMO_REKOMENDASI.pupuk}
            pestisida={DEMO_REKOMENDASI.pestisida}
            onDetail={() => handleNavChange("rekomendasi")}
          />
        </Section>
      </main>

      {/* Bottom nav — mobile */}
      <BottomNav active={activeNav} onChange={handleNavChange} />
    </div>
  );
};

export default Dashboard;
