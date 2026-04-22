import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BottomNav from "../components/layout/BottomNav";
import Card from "../components/ui/Card";
import { colors, typography, spacing, radius, transition } from "../lib/tokens";

// ---------------------------------------------------------------------------
// Data simulasi 30 hari — nanti dari GET /prediksi-bulanan
// ---------------------------------------------------------------------------

const generateDemoChart = () => {
  const now = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    // Simulasi pola hujan: naik di hari 8-18, turun setelahnya
    const ch = Math.round(
      180 + 60 * Math.sin((i / 30) * Math.PI) + (Math.random() - 0.5) * 20,
    );
    const suhu = Math.round(
      27 + 4 * Math.cos((i / 30) * Math.PI) + (Math.random() - 0.5) * 2,
    );
    return { label, ch, suhu };
  });
};

const CHART_DATA = generateDemoChart();

const DEMO_STOK = {
  bulan: "Mei 2026",
  lastUpdated: "14:35 WIB",
  items: [
    {
      jenis: "Urea",
      kategori: "pupuk",
      estimasi: "45 kg",
      saranBeli: "segera",
      stokSekarang: "",
    },
    {
      jenis: "NPK 15-15-15",
      kategori: "pupuk",
      estimasi: "30 kg",
      saranBeli: "1-2 minggu lagi",
      stokSekarang: "",
    },
    {
      jenis: "Mancozeb 80 WP",
      kategori: "pestisida",
      estimasi: "2 kg",
      saranBeli: "segera",
      stokSekarang: "",
    },
    {
      jenis: "Carbendazim 50 WP",
      kategori: "pestisida",
      estimasi: "1.5 kg",
      saranBeli: "belum perlu",
      stokSekarang: "",
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const saranToken = (saran) => {
  if (saran === "segera")
    return {
      bg: colors.riskHigh.bg,
      text: colors.riskHigh.text,
      border: colors.riskHigh.border,
    };
  if (saran === "1-2 minggu lagi")
    return {
      bg: colors.riskMedium.bg,
      text: colors.riskMedium.text,
      border: colors.riskMedium.border,
    };
  return {
    bg: colors.riskLow.bg,
    text: colors.riskLow.text,
    border: colors.riskLow.border,
  };
};

// ---------------------------------------------------------------------------
// Sub-komponen
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

// Tooltip custom — lebih besar dari default, mudah dibaca di mobile
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: colors.bgCard,
        border: `0.5px solid ${colors.border}`,
        borderRadius: radius.md,
        padding: `${spacing.sm} ${spacing.md}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          fontSize: typography.xs,
          color: colors.textMuted,
          marginBottom: spacing.xs,
        }}
      >
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.sm,
            marginTop: "2px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "3px",
              borderRadius: "2px",
              background: p.color,
              display: "inline-block",
            }}
          />
          <span
            style={{ fontSize: typography.sm, color: colors.textSecondary }}
          >
            {p.name}:
          </span>
          <span
            style={{
              fontSize: typography.sm,
              fontWeight: typography.semibold,
              color: colors.textPrimary,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {p.value}
            {p.name === "Suhu" ? "°C" : " mm"}
          </span>
        </div>
      ))}
    </div>
  );
};

// Baris tabel stok — satu item
const StokRow = ({
  jenis,
  kategori,
  estimasi,
  saranBeli,
  stokSekarang,
  onUpdateStok,
}) => {
  const [stok, setStok] = useState(stokSekarang);
  const token = saranToken(saranBeli);

  return (
    <div
      style={{
        padding: `${spacing.md} 0`,
        borderBottom: `0.5px solid ${colors.borderLight}`,
      }}
    >
      {/* Baris atas: nama + saran beli */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: spacing.sm,
          marginBottom: spacing.sm,
        }}
      >
        <div>
          <div
            style={{
              fontSize: typography.base,
              fontFamily: typography.fontHeading,
              fontWeight: typography.semibold,
              color: colors.textPrimary,
            }}
          >
            {jenis}
          </div>
          <div
            style={{
              fontSize: typography.xs,
              color: colors.textMuted,
              marginTop: "2px",
              textTransform: "capitalize",
            }}
          >
            {kategori}
          </div>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: token.bg,
            color: token.text,
            border: `0.5px solid ${token.border}`,
            borderRadius: radius.full,
            padding: `3px ${spacing.md}`,
            fontSize: typography.xs,
            fontWeight: typography.medium,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {saranBeli}
        </span>
      </div>

      {/* Baris bawah: estimasi + input stok */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.sm,
        }}
      >
        <div style={{ fontSize: typography.sm, color: colors.textSecondary }}>
          Estimasi kebutuhan:{" "}
          <span
            style={{
              fontWeight: typography.semibold,
              color: colors.textPrimary,
            }}
          >
            {estimasi}
          </span>
        </div>

        {/* Input stok manual */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label
            style={{
              fontSize: typography.xs,
              color: colors.textMuted,
              whiteSpace: "nowrap",
            }}
          >
            Stok saya:
          </label>
          <input
            type="text"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            placeholder="0 kg"
            style={{
              width: "64px",
              fontSize: typography.sm,
              fontFamily: typography.fontBody,
              color: colors.textPrimary,
              background: colors.bgMuted,
              border: `0.5px solid ${colors.border}`,
              borderRadius: radius.sm,
              padding: `4px ${spacing.sm}`,
              outline: "none",
              textAlign: "right",
              transition: `border-color ${transition.fast}`,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
            }}
            aria-label={`Stok ${jenis} saat ini`}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Halaman ProyeksiStok
// ---------------------------------------------------------------------------

const ProyeksiStok = ({ onNavigate }) => {
  const [activeNav, setActiveNav] = useState("proyeksi");
  const d = DEMO_STOK;

  // Tick X axis — hanya tampilkan setiap 5 hari agar tidak cramped di mobile
  const xTicks = CHART_DATA.map((item, i) => ({ ...item, i }))
    .filter((_, i) => i % 5 === 0)
    .map((item) => item.label);

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
        aria-label="Proyeksi stok bulanan"
      >
        {/* Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <h1
            style={{
              fontSize: typography.xl,
              fontFamily: typography.fontHeading,
              fontWeight: typography.bold,
              color: colors.textPrimary,
              margin: 0,
            }}
          >
            Proyeksi Stok
          </h1>
          <p
            style={{
              fontSize: typography.sm,
              color: colors.textMuted,
              margin: `${spacing.xs} 0 0`,
            }}
          >
            {d.bulan} · Dihitung {d.lastUpdated}
          </p>
        </div>

        {/* Chart prediksi cuaca */}
        <section style={{ marginBottom: spacing.xl }}>
          <SectionTitle>Prediksi Cuaca 30 Hari</SectionTitle>
          <Card
            variant="default"
            padding={`${spacing.lg} ${spacing.sm} ${spacing.lg} 0`}
          >
            {/* Legend manual di atas — lebih mobile-friendly dari legend Recharts */}
            <div
              style={{
                display: "flex",
                gap: spacing.lg,
                paddingLeft: spacing.lg,
                marginBottom: spacing.md,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "3px",
                    borderRadius: "2px",
                    background: colors.primary,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: typography.xs,
                    color: colors.textSecondary,
                  }}
                >
                  Curah Hujan (mm)
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    borderRadius: "2px",
                    background: colors.riskMedium.dot,
                    display: "inline-block",
                    opacity: 0.7,
                  }}
                />
                <span
                  style={{
                    fontSize: typography.xs,
                    color: colors.textSecondary,
                  }}
                >
                  Suhu (°C)
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={CHART_DATA}
                margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={colors.borderLight}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  ticks={xTicks}
                  tick={{
                    fontSize: 10,
                    fill: colors.textMuted,
                    fontFamily: typography.fontBody,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="ch"
                  orientation="left"
                  tick={{
                    fontSize: 10,
                    fill: colors.textMuted,
                    fontFamily: typography.fontBody,
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <YAxis
                  yAxisId="suhu"
                  orientation="right"
                  domain={[20, 38]}
                  tick={{
                    fontSize: 10,
                    fill: colors.textMuted,
                    fontFamily: typography.fontBody,
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Curah hujan — lebih tebal, warna primer */}
                <Line
                  yAxisId="ch"
                  type="monotone"
                  dataKey="ch"
                  name="CH"
                  stroke={colors.primary}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: colors.primary, strokeWidth: 0 }}
                />
                {/* Suhu — lebih tipis, warna amber */}
                <Line
                  yAxisId="suhu"
                  type="monotone"
                  dataKey="suhu"
                  name="Suhu"
                  stroke={colors.riskMedium.dot}
                  strokeWidth={1.5}
                  strokeOpacity={0.7}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: colors.riskMedium.dot,
                    strokeWidth: 0,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* Tabel kebutuhan stok */}
        <section style={{ marginBottom: spacing.xl }}>
          <SectionTitle>Kebutuhan Stok Bulan Ini</SectionTitle>
          <Card variant="default" padding={`0 ${spacing.lg}`}>
            {d.items.map((item, i) => (
              <StokRow key={i} {...item} />
            ))}
            {/* Hapus border bawah item terakhir */}
            <style>{`
              div[style*="border-bottom"]:last-child { border-bottom: none !important; }
            `}</style>
          </Card>
        </section>

        {/* Catatan */}
        <Card variant="muted" padding={`${spacing.md} ${spacing.lg}`}>
          <p
            style={{
              fontSize: typography.sm,
              fontFamily: typography.fontBody,
              color: colors.textSecondary,
              lineHeight: typography.loose,
              margin: 0,
            }}
          >
            Proyeksi dihitung dari rata-rata bergerak data sensor 30 hari
            terakhir. Input stok saat ini membantu sistem menghitung kebutuhan
            pembelian.
          </p>
        </Card>
      </main>

      <BottomNav active={activeNav} onChange={handleNavChange} />
    </div>
  );
};

export default ProyeksiStok;
