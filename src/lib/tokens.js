// AgriSense Design Tokens
// Sumber kebenaran tunggal untuk seluruh warna, spacing, radius, dan tipografi.
// Import file ini di komponen manapun yang butuh nilai desain.

export const colors = {
  // Brand
  primary: "#2D6A4F",
  primaryLight: "#52B788",
  primaryFaint: "#E8F4EE",

  // Background
  bgPage: "#F0F7F4",
  bgCard: "#FFFFFF",
  bgMuted: "#F5F8F6",

  // Text
  textPrimary: "#1B2D1E",
  textSecondary: "#4A6652",
  textMuted: "#7A9B84",

  // Border
  border: "#C8DDD5",
  borderLight: "#E2EDE8",

  // Risiko — semantik, jangan dipakai untuk dekorasi
  riskLow: {
    bg: "#E6F4EE",
    text: "#1B5E38",
    dot: "#2D9B5A",
    border: "#A8D5B8",
  },
  riskMedium: {
    bg: "#FEF3E2",
    text: "#7A4400",
    dot: "#F4A261",
    border: "#F5CC8A",
  },
  riskHigh: {
    bg: "#FDECEA",
    text: "#7B1A1A",
    dot: "#E63946",
    border: "#F5AAAA",
  },
};

export const typography = {
  // Font families — fallback ke sistem jika Google Fonts tidak di-load
  fontHeading: "'Nunito', 'Segoe UI', sans-serif",
  fontBody: "'Inter', 'Segoe UI', sans-serif",

  // Scale
  xs: "11px",
  sm: "13px",
  base: "15px",
  md: "16px",
  lg: "18px",
  xl: "22px",
  data: "28px", // angka sensor besar

  // Weight
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,

  // Line height
  tight: 1.25,
  normal: 1.5,
  loose: 1.7,
};

export const spacing = {
  // 4px grid — semua spacing kelipatan 4
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
};

export const radius = {
  sm: "8px",
  md: "12px", // card standar
  lg: "16px", // card besar / RiskIndex
  full: "9999px", // badge / pill
};

export const shadow = {
  // Minimal — hanya untuk elevasi fungsional
  card: "0 1px 4px rgba(45,106,79,0.06), 0 0 0 0.5px rgba(45,106,79,0.08)",
  focus: "0 0 0 3px rgba(45,106,79,0.25)",
};

export const transition = {
  fast: "150ms ease-out",
  normal: "200ms ease-out",
  slow: "300ms ease-out",
};

// Risk level helper — kembalikan token warna berdasarkan string level
export const riskTokens = (level) => {
  const map = {
    rendah: colors.riskLow,
    sedang: colors.riskMedium,
    tinggi: colors.riskHigh,
  };
  return map[level?.toLowerCase()] ?? colors.riskLow;
};
