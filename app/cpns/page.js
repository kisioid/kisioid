"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const paketCPNS = [
  { id: 1, kategori: "TWK", judul: "Tryout TWK Part 1", desc: "Tes Wawasan Kebangsaan — Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika", soal: 30, waktu: 30, harga: 5000, badge: "Populer", badgeColor: "#D4A017", emoji: "📝", siswa: 1832 },
  { id: 2, kategori: "TIU", judul: "Tryout TIU Part 1", desc: "Tes Intelejensi Umum — Verbal, Numerik, Figural", soal: 35, waktu: 35, harga: 5000, badge: null, badgeColor: null, emoji: "🧮", siswa: 1456 },
  { id: 3, kategori: "TKP", judul: "Tryout TKP Part 1", desc: "Tes Karakteristik Pribadi — Pelayanan Publik, Sosial Budaya, TIK, Anti Radikalisme", soal: 45, waktu: 45, harga: 5000, badge: null, badgeColor: null, emoji: "🧠", siswa: 1234 },
  { id: 4, kategori: "SKD LENGKAP", judul: "Simulasi SKD Lengkap Part 1", desc: "Paket lengkap TWK + TIU + TKP dalam satu sesi simulasi seperti ujian sesungguhnya", soal: 110, waktu: 100, harga: 15000, badge: "Terlaris", badgeColor: "#27AE60", emoji: "📋", siswa: 3421 },
  { id: 5, kategori: "SKD LENGKAP", judul: "Simulasi SKD Lengkap Part 2", desc: "Paket lengkap TWK + TIU + TKP — soal berbeda dari Part 1", soal: 110, waktu: 100, harga: 15000, badge: null, badgeColor: null, emoji: "📋", siswa: 2876 },
  { id: 6, kategori: "BUNDLING", judul: "Bundling SKD 5 Sesi", desc: "Hemat! 5 simulasi SKD lengkap sekaligus — persiapan maksimal untuk ujian", soal: 110, waktu: 100, harga: 50000, badge: "Hemat 33%", badgeColor: "#E74C3C", emoji: "🎁", siswa: 987 },
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

const fiturPaket = [
  { icon: "📝", text: "Soal lengkap sesuai kisi-kisi BKN" },
  { icon: "⏱️", text: "Timer standar & custom" },
  { icon: "💡", text: "Pembahasan lengkap tiap soal" },
  { icon: "📊", text: "Analisis hasil & skor detail" },
  { icon: "📋", text: "Download kisi-kisi PDF" },
  { icon: "📚", text: "Riwayat latihan tersimpan" },
];

const kategoriList = ["SEMUA", "TWK", "TIU", "TKP", "SKD LENGKAP", "BUNDLING"];

export default function CPNS() {
  const [activeKat, setActiveKat] = useState("SEMUA");
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerMode, setTimerMode] = useState(null);
  const [customTimer, setCustomTimer] = useState(60);
  const [showTimerSetup, setShowTimerSetup] = useState(false);
  const router = useRouter();

  const filtered = activeKat === "SEMUA" ? paketCPNS : paketCPNS.filter(p => p.kategori === activeKat);
  const formatHarga = (h) => `Rp ${h.toLocaleString("id-ID")}`;
  const formatSiswa = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}rb` : n;

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
    <div className="min-h-screen bg-gray-100">

      {/* MODAL */}
      {showModal && selectedPaket && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {!showTimerSetup ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ fontSize: 44 }}>{selectedPaket.emoji}</div>
                  <button onClick={closeModal} style={{ background: "#F0F2F7", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>✕</button>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div style={{ background: kategoriWarna[selectedPaket.kategori], color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50 }}>{selectedPaket.kategori}</div>
                  {selectedPaket.badge && (
                    <div style={{ background: selectedPaket.badgeColor, color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50 }}>{selectedPaket.badge}</div>
                  )}
                </div>

                <div style={{ fontWeight: 900, fontSize: 20, color: "#0F1E3A", marginBottom: 6 }}>{selectedPaket.judul}</div>
                <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, marginBottom: 16 }}>{selectedPaket.desc}</div>

                <div style={{ background: "#F8F9FA", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <div className="grid-3" style={{ textAlign: "center" }}>
                    {[["📝", `${selectedPaket.soal}`, "Soal"], ["⏱️", `${selectedPaket.waktu} mnt`, "Waktu"], ["👥", formatSiswa(selectedPaket.siswa), "Peserta"]].map(([icon, val, label]) => (
                      <div key={label} style={{ background: "white", borderRadius: 10, padding: 12 }}>
                        <div style={{ fontSize: 20 }}>{icon}</div>
                        <div style={{ fontWeight: 900, fontSize: 15, color: "#1B3A6B" }}>{val}</div>
                        <div style={{ fontSize: 10, color: "#9AA5B4", fontWeight: 600 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#1B3A6B", marginBottom: 10 }}>✨ Yang kamu dapat:</div>
                  <div className="grid-2">
                    {fiturPaket.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", background: "#F8F9FA", borderRadius: 8, padding: "8px 10px" }}>
                        <span style={{ fontSize: 14 }}>{f.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#4A5568" }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#1B3A6B" }}>{formatHarga(selectedPaket.harga)}</div>
                  <div style={{ fontSize: 11, color: "#27AE60", fontWeight: 700, background: "#EEF9EE", padding: "5px 10px", borderRadius: 50 }}>👥 {formatSiswa(selectedPaket.siswa)} peserta</div>
                </div>

                <div style={{ background: "#EEF2F9", borderRadius: 10, padding: "10px 14px", marginBottom: 14, textAlign: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1B3A6B" }}>🎁 Coba 3 soal pertama GRATIS!</span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-outline" style={{ flex: 1, borderColor: "#1B3A6B", color: "#1B3A6B" }}>Coba Gratis</button>
                  <button onClick={() => setShowTimerSetup(true)} style={{ flex: 2, background: "#1B3A6B", color: "white", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Beli & Mulai →</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <button onClick={() => setShowTimerSetup(false)} style={{ background: "#F0F2F7", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>← Kembali</button>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>Pilih Mode Timer</div>
                </div>

                <div style={{ background: "#F8F9FA", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, fontWeight: 600, color: "#4A5568" }}>
                  {selectedPaket.judul}
                </div>

                <div className="grid-2" style={{ marginBottom: 20 }}>
                  {[
                    { mode: "standar", icon: "⏱️", label: "Timer Standar", desc: "Sesuai standar SKD resmi", val: `${selectedPaket.waktu} menit` },
                    { mode: "custom", icon: "🎯", label: "Timer Custom", desc: "Atur sendiri waktumu", val: "5–180 menit" },
                  ].map((t) => (
                    <div
                      key={t.mode}
                      onClick={() => setTimerMode(t.mode)}
                      style={{
                        border: `2px solid ${timerMode === t.mode ? "#1B3A6B" : "#E2E8F0"}`,
                        borderRadius: 14, padding: 16, cursor: "pointer",
                        background: timerMode === t.mode ? "#EEF2F9" : "white",
                        textAlign: "center", transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
                      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: "#9AA5B4", marginBottom: 8 }}>{t.desc}</div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: "#1B3A6B" }}>{t.val}</div>
                    </div>
                  ))}
                </div>

                {timerMode === "custom" && (
                  <div style={{ background: "#F8F9FA", borderRadius: 14, padding: 18, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1B3A6B" }}>Atur Waktu</span>
                      <span style={{ fontWeight: 900, fontSize: 22, color: "#1B3A6B" }}>{customTimer} mnt</span>
                    </div>
                    <input type="range" min={5} max={180} step={5} value={customTimer} onChange={(e) => setCustomTimer(Number(e.target.value))} style={{ accentColor: "#1B3A6B" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9AA5B4", fontWeight: 600, margin: "8px 0 14px" }}>
                      <span>5 menit</span><span>180 menit</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[30, 45, 60, 90, 100, 120].map(t => (
                        <button key={t} onClick={() => setCustomTimer(t)} style={{ background: customTimer === t ? "#1B3A6B" : "white", color: customTimer === t ? "white" : "#4A5568", border: `1px solid ${customTimer === t ? "#1B3A6B" : "#E2E8F0"}`, borderRadius: 50, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t} mnt</button>
                      ))}
                    </div>
                  </div>
                )}

                {timerMode ? (
                  <button style={{ width: "100%", background: "#1B3A6B", color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    🚀 Mulai — {timerMode === "standar" ? selectedPaket.waktu : customTimer} Menit
                  </button>
                ) : (
                  <div style={{ textAlign: "center", padding: 14, fontSize: 13, color: "#9AA5B4", fontWeight: 600, background: "#F8F9FA", borderRadius: 12 }}>
                    👆 Pilih mode timer dulu
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, background: "#D4A017", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#1B3A6B" }}>K</div>
          <span className="navbar-title" style={{ color: "white", fontWeight: 900, fontSize: 22 }}>Kisio<span style={{ color: "#D4A017" }}>ID</span></span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="navbar-btn-masuk" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "9px 20px", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Masuk</button>
          <button className="navbar-btn-daftar" style={{ background: "#D4A017", border: "none", borderRadius: 10, padding: "9px 20px", color: "#1B3A6B", cursor: "pointer", fontWeight: 800, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Daftar Gratis</button>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1B3A6B, #2D5FA8)", padding: "32px 20px 44px" }}>
        <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 16px", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ← Kembali
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ fontSize: 48 }}>🏛️</div>
          <div>
            <div style={{ display: "inline-block", background: "#D4A017", color: "#1B3A6B", fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, marginBottom: 8 }}>SKD CPNS / PPPK</div>
            <h1 className="hero-title" style={{ color: "white", marginBottom: 4 }}>Latihan Soal CPNS</h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>TWK · TIU · TKP — Simulasi SKD Resmi</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
          {[["110", "Soal/Sesi"], ["100 Mnt", "Durasi SKD"], ["3", "Sub Tes"], ["BKN 2024", "Kisi-kisi"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#D4A017" }}>{val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">

        {/* TIPS */}
        <div className="card">
          <div style={{ fontWeight: 800, fontSize: 16, color: "#1B3A6B", marginBottom: 14 }}>💡 Tips Lulus SKD</div>
          <div className="grid-2">
            {tips.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid #F0F2F7" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
                <span style={{ fontSize: 13, color: "#4A5568", fontWeight: 600, lineHeight: 1.5 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FILTER */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 14, color: "#1B3A6B" }}>Pilih Paket Latihan</div>
          <div className="filter-container">
            {kategoriList.map(k => (
              <button
                key={k}
                onClick={() => setActiveKat(k)}
                className="filter-btn"
                style={{
                  background: activeKat === k ? "#1B3A6B" : "white",
                  color: activeKat === k ? "white" : "#4A5568",
                  border: `1px solid ${activeKat === k ? "#1B3A6B" : "#E2E8F0"}`,
                }}
              >{k}</button>
            ))}
          </div>
        </div>

        {/* GRID PAKET */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {filtered.map((paket) => (
            <div key={paket.id} className="paket-card" onClick={() => openModal(paket)}>
              <div style={{
                background: `linear-gradient(135deg, ${kategoriWarna[paket.kategori] || "#1B3A6B"}, ${kategoriWarna[paket.kategori] || "#1B3A6B"}99)`,
                padding: "22px 12px", textAlign: "center", position: "relative",
              }}>
                {paket.badge && (
                  <div style={{ position: "absolute", top: 8, left: 8, background: paket.badgeColor, color: "white", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>{paket.badge}</div>
                )}
                <div style={{ fontSize: 34 }}>{paket.emoji}</div>
                <div style={{ color: "white", fontWeight: 800, fontSize: 12, marginTop: 8, lineHeight: 1.3 }}>{paket.judul}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 4, fontWeight: 600 }}>{paket.kategori}</div>
              </div>
              <div style={{ padding: "12px" }}>
                <div style={{ fontSize: 11, color: "#9AA5B4", fontWeight: 600, marginBottom: 4 }}>{paket.soal} Soal · {paket.waktu} mnt</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#1B3A6B" }}>{formatHarga(paket.harga)}</div>
                  <div style={{ fontSize: 10, color: "#9AA5B4", fontWeight: 600 }}>👥 {formatSiswa(paket.siswa)}</div>
                </div>
                <div style={{ width: "100%", background: "#1B3A6B", color: "white", border: "none", borderRadius: 8, padding: "9px", fontSize: 12, fontWeight: 800, cursor: "pointer", textAlign: "center" }}>Selengkapnya</div>
              </div>
            </div>
          ))}
        </div>

        {/* BANNER */}
        <div className="banner-coba">
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>🎁 Coba Dulu Sebelum Beli!</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 14 }}>3 soal pertama setiap paket bisa dicoba GRATIS!</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {fiturPaket.slice(0, 3).map((f, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{f.icon} {f.text}</div>
              ))}
            </div>
          </div>
          <button style={{ background: "#D4A017", border: "none", borderRadius: 12, padding: "12px 28px", color: "#1B3A6B", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Coba Gratis →
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <div className="footer">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, background: "#D4A017", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#1B3A6B" }}>K</div>
          <span style={{ color: "white", fontWeight: 900, fontSize: 15 }}>Kisio<span style={{ color: "#D4A017" }}>ID</span></span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>© 2025 KisioID — Platform Latihan Soal #1 Indonesia</div>
      </div>

    </div>
  );
}