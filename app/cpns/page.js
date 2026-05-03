"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const paketCPNS = [
  { id: 1, kategori: "TWK", judul: "Tryout TWK Part 1", desc: "Tes Wawasan Kebangsaan — Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika", soal: 30, waktu: 30, harga: 5000, badge: "Populer", badgeColor: "#D4A017", emoji: "📝" },
  { id: 2, kategori: "TIU", judul: "Tryout TIU Part 1", desc: "Tes Intelejensi Umum — Verbal, Numerik, Figural", soal: 35, waktu: 35, harga: 5000, badge: null, badgeColor: null, emoji: "🧮" },
  { id: 3, kategori: "TKP", judul: "Tryout TKP Part 1", desc: "Tes Karakteristik Pribadi — Pelayanan Publik, Sosial Budaya, TIK, Anti Radikalisme", soal: 45, waktu: 45, harga: 5000, badge: null, badgeColor: null, emoji: "🧠" },
  { id: 4, kategori: "SKD LENGKAP", judul: "Simulasi SKD Lengkap Part 1", desc: "Paket lengkap TWK + TIU + TKP dalam satu sesi simulasi seperti ujian sesungguhnya", soal: 110, waktu: 100, harga: 15000, badge: "Terlaris", badgeColor: "#27AE60", emoji: "📋" },
  { id: 5, kategori: "SKD LENGKAP", judul: "Simulasi SKD Lengkap Part 2", desc: "Paket lengkap TWK + TIU + TKP — soal berbeda dari Part 1", soal: 110, waktu: 100, harga: 15000, badge: null, badgeColor: null, emoji: "📋" },
  { id: 6, kategori: "BUNDLING", judul: "Bundling SKD 5 Sesi", desc: "Hemat! 5 simulasi SKD lengkap sekaligus — persiapan maksimal untuk ujian", soal: 110, waktu: 100, harga: 50000, badge: "Hemat 33%", badgeColor: "#E74C3C", emoji: "🎁" },
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
  const [activeKat, setActiveKat] = useState("SEMUA");
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerMode, setTimerMode] = useState(null);
  const [customTimer, setCustomTimer] = useState(60);
  const [showTimerSetup, setShowTimerSetup] = useState(false);
  const router = useRouter();

  const kategoriList = ["SEMUA", "TWK", "TIU", "TKP", "SKD LENGKAP", "BUNDLING"];
  const filtered = activeKat === "SEMUA" ? paketCPNS : paketCPNS.filter(p => p.kategori === activeKat);
  const formatHarga = (h) => `Rp ${h.toLocaleString("id-ID")}`;

  const openModal = (paket) => {
    setSelectedPaket(paket);
    setTimerMode(null);
    setShowTimerSetup(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPaket(null);
    setTimerMode(null);
    setShowTimerSetup(false);
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F0F2F7", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        input[type=range] { accent-color: #1B3A6B; }
      `}</style>

      {/* MODAL */}
      {showModal && selectedPaket && (
        <div
          onClick={closeModal}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", borderRadius: 20, padding: 28, maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto" }}
          >
            {!showTimerSetup ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ fontSize: 40 }}>{selectedPaket.emoji}</div>
                  <button onClick={closeModal} style={{ background: "#F0F2F7", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>✕</button>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div style={{ background: kategoriWarna[selectedPaket.kategori], color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50 }}>{selectedPaket.kategori}</div>
                  {selectedPaket.badge && (
                    <div style={{ background: selectedPaket.badgeColor, color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50 }}>{selectedPaket.badge}</div>
                  )}
                </div>

                <div style={{ fontWeight: 900, fontSize: 20, color: "#0F1E3A", marginBottom: 8 }}>{selectedPaket.judul}</div>
                <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, marginBottom: 20 }}>{selectedPaket.desc}</div>

                <div style={{ background: "#F8F9FA", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, textAlign: "center" }}>
                    {[["📝", `${selectedPaket.soal}`, "Soal"], ["⏱️", `${selectedPaket.waktu}`, "Menit Standar"], ["💰", formatHarga(selectedPaket.harga), "Harga"]].map(([icon, val, label]) => (
                      <div key={label} style={{ background: "white", borderRadius: 10, padding: 12 }}>
                        <div style={{ fontSize: 20 }}>{icon}</div>
                        <div style={{ fontWeight: 900, fontSize: 14, color: "#1B3A6B" }}>{val}</div>
                        <div style={{ fontSize: 11, color: "#9AA5B4", fontWeight: 600 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowTimerSetup(true)}
                  style={{ width: "100%", background: "#1B3A6B", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Beli & Mulai Latihan →
                </button>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <button
                    onClick={() => setShowTimerSetup(false)}
                    style={{ background: "#F0F2F7", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >← Kembali</button>
                  <div style={{ fontWeight: 800, fontSize: 17, color: "#0F1E3A" }}>Pilih Mode Timer</div>
                </div>

                <div style={{ fontSize: 13, color: "#4A5568", marginBottom: 20 }}>{selectedPaket.judul}</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  <div
                    onClick={() => setTimerMode("standar")}
                    style={{
                      border: `2px solid ${timerMode === "standar" ? "#1B3A6B" : "#E2E8F0"}`,
                      borderRadius: 14, padding: 18, cursor: "pointer",
                      background: timerMode === "standar" ? "#EEF2F9" : "white",
                      textAlign: "center", transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>⏱️</div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#0F1E3A", marginBottom: 4 }}>Timer Standar</div>
                    <div style={{ fontSize: 12, color: "#9AA5B4", lineHeight: 1.5 }}>Waktu sesuai standar SKD resmi</div>
                    <div style={{ marginTop: 10, fontWeight: 900, fontSize: 18, color: "#1B3A6B" }}>{selectedPaket.waktu} menit</div>
                  </div>

                  <div
                    onClick={() => setTimerMode("custom")}
                    style={{
                      border: `2px solid ${timerMode === "custom" ? "#1B3A6B" : "#E2E8F0"}`,
                      borderRadius: 14, padding: 18, cursor: "pointer",
                      background: timerMode === "custom" ? "#EEF2F9" : "white",
                      textAlign: "center", transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#0F1E3A", marginBottom: 4 }}>Timer Custom</div>
                    <div style={{ fontSize: 12, color: "#9AA5B4", lineHeight: 1.5 }}>Atur sendiri waktumu</div>
                    <div style={{ marginTop: 10, fontWeight: 900, fontSize: 18, color: "#1B3A6B" }}>5–180 menit</div>
                  </div>
                </div>

                {timerMode === "custom" && (
                  <div style={{ background: "#F8F9FA", borderRadius: 14, padding: 20, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1B3A6B" }}>Atur Waktu</div>
                      <div style={{ fontWeight: 900, fontSize: 24, color: "#1B3A6B" }}>{customTimer} menit</div>
                    </div>
                    <input
                      type="range" min={5} max={180} step={5}
                      value={customTimer}
                      onChange={(e) => setCustomTimer(Number(e.target.value))}
                      style={{ width: "100%", marginBottom: 8 }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9AA5B4", fontWeight: 600 }}>
                      <span>5 menit</span><span>180 menit</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                      {[30, 45, 60, 90, 100, 120].map(t => (
                        <button
                          key={t}
                          onClick={() => setCustomTimer(t)}
                          style={{
                            background: customTimer === t ? "#1B3A6B" : "white",
                            color: customTimer === t ? "white" : "#4A5568",
                            border: `1px solid ${customTimer === t ? "#1B3A6B" : "#E2E8F0"}`,
                            borderRadius: 50, padding: "5px 14px", fontSize: 12,
                            fontWeight: 700, cursor: "pointer",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >{t} mnt</button>
                      ))}
                    </div>
                  </div>
                )}

                {timerMode && (
                  <button style={{ width: "100%", background: "#1B3A6B", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    🚀 Mulai Latihan — {timerMode === "standar" ? selectedPaket.waktu : customTimer} Menit
                  </button>
                )}

                {!timerMode && (
                  <div style={{ textAlign: "center", fontSize: 13, color: "#9AA5B4", fontWeight: 600 }}>
                    Pilih mode timer dulu untuk mulai latihan
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
      <div style={{ background: "linear-gradient(135deg, #1B3A6B, #2D5FA8)", padding: "40px 40px 52px" }}>
        <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 18px", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, marginBottom: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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

      <div style={{ padding: "28px 40px", maxWidth: 1200, margin: "0 auto" }}>

        {/* TIPS */}
        <div style={{ background: "white", borderRadius: 16, padding: 22, marginBottom: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#1B3A6B", marginBottom: 14 }}>💡 Tips Lulus SKD</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {tips.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
                <span style={{ fontSize: 13, color: "#4A5568", fontWeight: 600, lineHeight: 1.5 }}>{t.text}</span>
              </div>
            ))}
          </div>
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
                  borderRadius: 50, padding: "7px 20px", fontSize: 13,
                  fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >{k}</button>
            ))}
          </div>
        </div>

        {/* PAKET GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {filtered.map((paket) => (
            <div
              key={paket.id}
              onClick={() => openModal(paket)}
              style={{
                background: "white",
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                transition: "all 0.2s",
              }}
            >
              {/* Thumbnail */}
              <div style={{
                background: `linear-gradient(135deg, ${kategoriWarna[paket.kategori] || "#1B3A6B"}, ${kategoriWarna[paket.kategori] || "#1B3A6B"}99)`,
                padding: "24px 12px",
                textAlign: "center",
                position: "relative",
              }}>
                {paket.badge && (
                  <div style={{ position: "absolute", top: 8, left: 8, background: paket.badgeColor, color: "white", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>{paket.badge}</div>
                )}
                <div style={{ fontSize: 36 }}>{paket.emoji}</div>
                <div style={{ color: "white", fontWeight: 800, fontSize: 13, marginTop: 8, lineHeight: 1.3 }}>{paket.judul}</div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, marginTop: 4, fontWeight: 600 }}>{paket.kategori}</div>
              </div>

              {/* Info */}
              <div style={{ padding: "14px 12px" }}>
                <div style={{ fontSize: 11, color: "#9AA5B4", fontWeight: 600, marginBottom: 6 }}>
                  {paket.soal} Soal · {paket.waktu} mnt
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#1B3A6B", marginBottom: 12 }}>
                  {formatHarga(paket.harga)}
                </div>
                <div style={{
                  width: "100%", background: "#1B3A6B", color: "white",
                  border: "none", borderRadius: 8, padding: "9px",
                  fontSize: 12, fontWeight: 800, cursor: "pointer",
                  textAlign: "center", fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  Selengkapnya
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LANGGANAN */}
        <div style={{ background: "linear-gradient(135deg, #1B3A6B, #2D5FA8)", borderRadius: 18, padding: 28, color: "white", textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Atau Berlangganan Lebih Hemat</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>Akses semua paket CPNS tanpa batas hanya</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#D4A017", marginBottom: 20 }}>Rp 20.000<span style={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}>/bulan</span></div>
          <button style={{ background: "#D4A017", border: "none", borderRadius: 12, padding: "14px 40px", color: "#1B3A6B", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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