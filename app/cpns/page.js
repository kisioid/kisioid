"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const paketCPNS = [
  {
    id: 1,
    kategori: "TWK",
    judul: "Tryout TWK Part 1",
    desc: "Tes Wawasan Kebangsaan — Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika",
    soal: 30,
    waktu: 30,
    harga: 5000,
    badge: "Populer",
    badgeColor: "#D4A017",
  },
  {
    id: 2,
    kategori: "TIU",
    judul: "Tryout TIU Part 1",
    desc: "Tes Intelejensi Umum — Verbal, Numerik, Figural",
    soal: 35,
    waktu: 35,
    harga: 5000,
    badge: null,
    badgeColor: null,
  },
  {
    id: 3,
    kategori: "TKP",
    judul: "Tryout TKP Part 1",
    desc: "Tes Karakteristik Pribadi — Pelayanan Publik, Sosial Budaya, TIK, Anti Radikalisme",
    soal: 45,
    waktu: 45,
    harga: 5000,
    badge: null,
    badgeColor: null,
  },
  {
    id: 4,
    kategori: "SKD LENGKAP",
    judul: "Simulasi SKD Lengkap Part 1",
    desc: "Paket lengkap TWK + TIU + TKP dalam satu sesi simulasi seperti ujian sesungguhnya",
    soal: 110,
    waktu: 100,
    harga: 15000,
    badge: "Terlaris",
    badgeColor: "#27AE60",
  },
  {
    id: 5,
    kategori: "SKD LENGKAP",
    judul: "Simulasi SKD Lengkap Part 2",
    desc: "Paket lengkap TWK + TIU + TKP — soal berbeda dari Part 1",
    soal: 110,
    waktu: 100,
    harga: 15000,
    badge: null,
    badgeColor: null,
  },
  {
    id: 6,
    kategori: "BUNDLING",
    judul: "Bundling SKD 5 Sesi",
    desc: "Hemat! 5 simulasi SKD lengkap sekaligus — persiapan maksimal untuk ujian",
    soal: 110,
    waktu: 100,
    harga: 50000,
    badge: "Hemat 33%",
    badgeColor: "#E74C3C",
  },
];

const kategoriWarna = {
  "TWK": "#2980B9",
  "TIU": "#8E44AD",
  "TKP": "#27AE60",
  "SKD LENGKAP": "#1B3A6B",
  "BUNDLING": "#E74C3C",
};

const tips = [
  { icon: "📌", text: "Passing grade TWK: 65, TIU: 80, TKP: 166" },
  { icon: "⏱️", text: "Total waktu SKD: 100 menit untuk 110 soal" },
  { icon: "🎯", text: "Fokus TIU karena passing grade tertinggi" },
  { icon: "📖", text: "Pelajari soal HOTS untuk TWK terbaru" },
];

export default function CPNS() {
  const [hovered, setHovered] = useState(null);
  const [activeKat, setActiveKat] = useState("SEMUA");
  const router = useRouter();

  const kategoriList = ["SEMUA", "TWK", "TIU", "TKP", "SKD LENGKAP", "BUNDLING"];

  const filtered = activeKat === "SEMUA"
    ? paketCPNS
    : paketCPNS.filter(p => p.kategori === activeKat);

  const formatHarga = (h) => `Rp ${h.toLocaleString("id-ID")}`;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F0F2F7", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* NAVBAR */}
      <nav style={{ background: "#1B3A6B", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "#D4A017", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#1B3A6B" }}>K</div>
          <span style={{ color: "white", fontWeight: 900, fontSize: 22 }}>Kisio<span style={{ color: "#D4A017" }}>ID</span></span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "9px 22px", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Masuk</button>
          <button style={{ background: "#D4A017", border: "none", borderRadius: 10, padding: "9px 22px", color: "#1B3A6B", cursor: "pointer", fontWeight: 800, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Daftar Gratis</button>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1B3A6B, #2D5FA8)", padding: "40px 28px 52px" }}>
        <button
          onClick={() => router.push("/")}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 18px", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, marginBottom: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          ← Kembali
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 52 }}>🏛️</div>
          <div>
            <div style={{ display: "inline-block", background: "#D4A017", color: "#1B3A6B", fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, marginBottom: 8 }}>SKD CPNS / PPPK</div>
            <h1 style={{ color: "white", fontWeight: 900, fontSize: 28, marginBottom: 6 }}>Latihan Soal CPNS</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>TWK · TIU · TKP — Simulasi SKD Resmi</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 28, flexWrap: "wrap" }}>
          {[["110", "Soal per Sesi"], ["100 Menit", "Durasi SKD"], ["3", "Sub Tes"], ["Kisi-kisi Resmi", "BKN 2024"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#D4A017" }}>{val}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 24px", maxWidth: 680, margin: "0 auto" }}>

        {/* TIPS */}
        <div style={{ background: "white", borderRadius: 16, padding: 22, marginBottom: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#1B3A6B", marginBottom: 14 }}>💡 Tips Lulus SKD</div>
          {tips.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < tips.length - 1 ? "1px solid #F0F2F7" : "none" }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ fontSize: 14, color: "#4A5568", fontWeight: 600 }}>{t.text}</span>
            </div>
          ))}
        </div>

        {/* FILTER */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 14 }}>Pilih Paket Latihan</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {kategoriList.map(k => (
              <button
                key={k}
                onClick={() => setActiveKat(k)}
                style={{
                  background: activeKat === k ? "#1B3A6B" : "white",
                  color: activeKat === k ? "white" : "#4A5568",
                  border: `1px solid ${activeKat === k ? "#1B3A6B" : "#E2E8F0"}`,
                  borderRadius: 50,
                  padding: "7px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* PAKET LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((paket) => (
            <div
              key={paket.id}
              onMouseEnter={() => setHovered(paket.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "white",
                borderRadius: 18,
                padding: 24,
                boxShadow: hovered === paket.id ? "0 8px 24px rgba(27,58,107,0.15)" : "0 2px 10px rgba(0,0,0,0.07)",
                border: `2px solid ${hovered === paket.id ? "#1B3A6B" : "transparent"}`,
                transition: "all 0.2s",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ background: kategoriWarna[paket.kategori] || "#1B3A6B", color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50 }}>
                    {paket.kategori}
                  </div>
                  {paket.badge && (
                    <div style={{ background: paket.badgeColor, color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50 }}>
                      {paket.badge}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1B3A6B" }}>{formatHarga(paket.harga)}</div>
              </div>

              <div style={{ fontWeight: 800, fontSize: 17, color: "#0F1E3A", marginBottom: 8 }}>{paket.judul}</div>
              <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, marginBottom: 16 }}>{paket.desc}</div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ fontSize: 13, color: "#9AA5B4", fontWeight: 700 }}>📝 {paket.soal} Soal</div>
                  <div style={{ fontSize: 13, color: "#9AA5B4", fontWeight: 700 }}>⏱️ {paket.waktu} Menit</div>
                </div>
                <button style={{ background: "#1B3A6B", color: "white", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Mulai →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* LANGGANAN */}
        <div style={{ background: "linear-gradient(135deg, #1B3A6B, #2D5FA8)", borderRadius: 18, padding: 24, marginTop: 28, color: "white", textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Atau Berlangganan Lebih Hemat</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>Akses semua paket CPNS tanpa batas hanya</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#D4A017", marginBottom: 18 }}>Rp 20.000<span style={{ fontSize: 15, color: "rgba(255,255,255,0.6)" }}>/bulan</span></div>
          <button style={{ background: "#D4A017", border: "none", borderRadius: 12, padding: "14px 36px", color: "#1B3A6B", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Berlangganan Sekarang
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: "#0F1E3A", padding: "24px", textAlign: "center", marginTop: 48 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 30, height: 30, background: "#D4A017", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#1B3A6B" }}>K</div>
          <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>Kisio<span style={{ color: "#D4A017" }}>ID</span></span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>© 2025 KisioID — Platform Latihan Soal #1 Indonesia</div>
      </div>

    </div>
  );
}