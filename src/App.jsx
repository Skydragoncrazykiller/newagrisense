import React, { useState } from "react";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Rekomendasi from "./pages/Rekomendasi";
import ProyeksiStok from "./pages/ProyeksiStok";

const App = () => {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard onNavigate={setPage} />;
      case "rekomendasi":
        return <Rekomendasi onNavigate={setPage} />;
      case "proyeksi":
        return <ProyeksiStok onNavigate={setPage} />;
      case "riwayat":
        return (
          <PlaceholderPage
            title="Riwayat"
            onBack={() => setPage("dashboard")}
          />
        );
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Langsung ke konten utama
      </a>
      {renderPage()}
    </>
  );
};

const PlaceholderPage = ({ title, onBack }) => (
  <div
    style={{
      minHeight: "100dvh",
      background: "#F0F7F4",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      fontFamily: "'Inter', sans-serif",
    }}
  >
    <p style={{ color: "#4A6652", fontSize: "15px" }}>
      Halaman <strong>{title}</strong> — segera hadir.
    </p>
    <button
      onClick={onBack}
      style={{
        background: "#2D6A4F",
        color: "#fff",
        border: "none",
        borderRadius: "9999px",
        padding: "10px 24px",
        fontSize: "14px",
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      ← Kembali ke Beranda
    </button>
  </div>
);

export default App;
