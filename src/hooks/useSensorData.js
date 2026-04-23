import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useSensorData — hook polling ke backend Flask.
 *
 * Interval default 30 detik, sesuai frekuensi kirim DHT22 via ESP32.
 * Fallback ke data demo jika backend belum tersedia.
 *
 * Cara pakai:
 *   const { sensor, rekomendasi, loading, error, lastUpdated } = useSensorData()
 *
 * Environment variable:
 *   VITE_API_URL = http://localhost:5000   ← development
 *   VITE_API_URL = https://api-kamu.com    ← production
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const POLL_INTERVAL = 30_000; // 30 detik

// ---------------------------------------------------------------------------
// Data demo — dipakai kalau backend belum tersedia
// ---------------------------------------------------------------------------

const DEMO_SENSOR = {
  suhu: 29.4,
  kelembapan: 87.2,
  curah_hujan: 215,
  timestamp: new Date().toISOString(),
};

const DEMO_REKOMENDASI = {
  risk_level: "tinggi",
  alasan:
    "Curah hujan bulan ini 215 mm/bln dengan kelembapan 87%. Risiko Blast dan Hawar Pelepah tinggi.",
  pupuk: [
    { jenis: "Urea", dosis: "150 kg/ha", catatan: "Tunda jika hujan deras." },
    {
      jenis: "NPK 15-15-15",
      dosis: "100 kg/ha",
      catatan: "Fase anakan aktif.",
    },
  ],
  pestisida: [
    {
      opt: "Blast & Hawar Pelepah",
      produk: "Mancozeb 80 WP",
      dosis: "2 g/L — 400 L/ha",
      frekuensi: "2x seminggu",
      catatan: "Pagi hari saat angin tenang.",
    },
    {
      opt: "Hawar Pelepah",
      produk: "Carbendazim 50 WP",
      dosis: "1 g/L — 500 L/ha",
      frekuensi: "Anakan & berbunga",
      catatan: "Rotasi dengan Mancozeb.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper — format timestamp ke string human-readable
// ---------------------------------------------------------------------------

const formatUpdatedAt = (isoString) => {
  if (!isoString) return "tidak diketahui";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  return `${Math.floor(diff / 3600)} jam lalu`;
};

// ---------------------------------------------------------------------------
// Hook utama
// ---------------------------------------------------------------------------

const useSensorData = () => {
  const [sensor, setSensor] = useState(null);
  const [rekomendasi, setRekomendasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  // Ref untuk interval — agar bisa di-clear saat unmount
  const intervalRef = useRef(null);

  // ---------------------------------------------------------------------------
  // Fetch sensor terkini dari /sensor/latest
  // ---------------------------------------------------------------------------

  const fetchSensor = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/sensor/latest`, {
        signal: AbortSignal.timeout(8000), // timeout 8 detik
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setSensor({
        suhu: data.suhu,
        kelembapan: data.kelembapan,
        curah_hujan: data.curah_hujan,
        timestamp: data.timestamp,
      });
      setLastUpdated(data.timestamp);
      setIsDemo(false);
      setError(null);
    } catch (err) {
      // Backend belum tersedia → pakai demo data, tampilkan warning
      console.warn(
        "[AgriSense] Backend tidak tersedia, pakai demo data:",
        err.message,
      );
      setSensor(DEMO_SENSOR);
      setLastUpdated(DEMO_SENSOR.timestamp);
      setIsDemo(true);
      setError("Backend tidak terhubung — menampilkan data simulasi.");
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Fetch rekomendasi dari /rekomendasi
  // Dipanggil terpisah karena mungkin lebih lambat dari sensor
  // ---------------------------------------------------------------------------

  const fetchRekomendasi = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/rekomendasi`, {
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setRekomendasi(data);
    } catch (err) {
      console.warn("[AgriSense] Gagal fetch rekomendasi:", err.message);
      setRekomendasi(DEMO_REKOMENDASI);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Fetch semua data sekaligus
  // ---------------------------------------------------------------------------

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchSensor(), fetchRekomendasi()]);
    setLoading(false);
  }, [fetchSensor, fetchRekomendasi]);

  // ---------------------------------------------------------------------------
  // Setup polling
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Fetch pertama langsung
    fetchAll();

    // Polling tiap 30 detik
    intervalRef.current = setInterval(fetchAll, POLL_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  // ---------------------------------------------------------------------------
  // Format data untuk komponen
  // ---------------------------------------------------------------------------

  const sensorFormatted = sensor
    ? {
        suhu: Math.round(sensor.suhu * 10) / 10,
        kelembapan: Math.round(sensor.kelembapan * 10) / 10,
        curahHujan: Math.round(sensor.curah_hujan),
        updatedAt: formatUpdatedAt(sensor.timestamp),
        timestamp: sensor.timestamp,
      }
    : null;

  return {
    sensor: sensorFormatted,
    rekomendasi,
    loading,
    error,
    lastUpdated,
    isDemo,
    refetch: fetchAll, // bisa dipanggil manual untuk force refresh
  };
};

export default useSensorData;
