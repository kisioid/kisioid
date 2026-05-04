"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const kabupatenKalbar = [
  "Kota Pontianak","Kota Singkawang","Kabupaten Kubu Raya",
  "Kabupaten Mempawah","Kabupaten Sambas","Kabupaten Bengkayang",
  "Kabupaten Landak","Kabupaten Sanggau","Kabupaten Sekadau",
  "Kabupaten Sintang","Kabupaten Melawi","Kabupaten Kapuas Hulu",
  "Kabupaten Ketapang","Kabupaten Kayong Utara",
];

const kelasList = [
  { id: 7, label: "Kelas 7", icon: "7️⃣", desc: "Bilangan, geometri, biologi dasar" },
  { id: 8, label: "Kelas 8", icon: "8️⃣", desc: "Aljabar, fisika, IPS terpadu" },
  { id: 9, label: "Kelas 9", icon: "9️⃣", desc: "Persiapan ujian akhir SMP", ujianAkhir: true },
];

const mapelList = [
  { id: "matematika", label: "Matematika", icon: "🔢", color: "#2980B9" },
  { id: "ipa", label: "IPA", icon: "🔬", color: "#27AE60" },
  { id: "ips", label: "IPS", icon: "🌍", color: "#E67E22" },
  { id: "bind", label: "B. Indonesia", icon: "📝", color: "#8E44AD" },
  { id: "bing", label: "B. Inggris", icon: "🌐", color: "#E74C3C" },
];

const paketSoal = [
  { id: 1, judul: "Latihan Harian 1", desc: "Soal latihan harian sesuai kisi-kisi MGMP daerahmu", soal: 25, waktu: 40, harga: 4000, badge: "BARU", badgeColor: "#27AE60", emoji: "📝", siswa: 312, filter: ["terbaru","uts"] },
  { id: 2, judul: "Latihan Harian 2", desc: "Variasi soal berbeda dari Part 1, tingkat sedang", soal: 25, waktu: 40, harga: 4000, badge: null, badgeColor: null, emoji: "📝", siswa: 245, filter: ["terbaru"] },
  { id: 3, judul: "Latihan Harian 3", desc: "Soal latihan harian tingkat kesulitan lebih tinggi", soal: 25, waktu: 40, harga: 4000, badge: null, badgeColor: null, emoji: "📝", siswa: 198, filter: ["terbaru"] },
  { id: 4, judul: "Simulasi UTS", desc: "Simulasi Ujian Tengah Semester sesuai kisi-kisi daerahmu", soal: 40, waktu: 60, harga: 4000, badge: "🔥 POPULER", badgeColor: "#E67E22", emoji: "📋", siswa: 1567, filter: ["terpopuler","uts"] },
  { id: 5, judul: "Simulasi UAS", desc: "Simulasi Ujian Akhir Semester sesuai kisi-kisi daerahmu", soal: 50, waktu: 80, harga: 4000, badge: "🔥 POPULER", badgeColor: "#E67E22", emoji: "📋", siswa: 1234, filter: ["terpopuler","uas"] },
  { id: 6, judul: "Bundling Lengkap", desc: "Semua paket dalam satu — latihan harian + UTS + UAS lengkap", soal: 120, waktu: 150, harga: 12000, badge: "HEMAT 50%", badgeColor: "#E74C3C", emoji: "🎁", siswa: 678, filter: ["terpopuler","uts","uas"] },
];

const fiturPaket = [
  { icon: "📝", text: "Soal lengkap sesuai kisi-kisi MGMP" },
  { icon: "⏱️", text: "Timer standar & custom" },
  { icon: "💡", text: "Pembahasan lengkap tiap soal" },
  { icon: "📊", text: "Analisis hasil & skor detail" },
  { icon: "📋", text: "Download kisi-kisi PDF" },
  { icon: "📚", text: "Riwayat latihan tersimpan" },
];

const kisiKisiDummy = [
  { bab: "Bab 1", judul: "Bilangan dan Aljabar", kompetensi: "Memahami konsep bilangan dan operasi aljabar", indikator: ["Menyelesaikan operasi bilangan bulat", "Memfaktorkan bentuk aljabar", "Menyelesaikan persamaan linear"] },
  { bab: "Bab 2", judul: "Geometri dan Pengukuran", kompetensi: "Memahami bangun ruang dan pengukurannya", indikator: ["Menghitung luas permukaan bangun ruang", "Menghitung volume bangun ruang", "Menyelesaikan soal teorema Pythagoras"] },
  { bab: "Bab 3", judul: "Statistika dan Peluang", kompetensi: "Menyajikan dan menganalisis data statistik", indikator: ["Menghitung ukuran pemusatan data", "Menentukan peluang suatu kejadian", "Menyajikan data dalam diagram"] },
];

const filterList = [
  { id: "semua", label: "Semua" },
  { id: "terbaru", label: "🆕 Terbaru" },
  { id: "terpopuler", label: "🔥 Terpopuler" },
  { id: "uts", label: "📝 UTS" },
  { id: "uas", label: "📋 UAS" },
];

const WARNA = "#2980B9";

export default function SMP() {
  const [provinsi, setProvinsi] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [kelas, setKelas] = useState(null);
  const [mapel, setMapel] = useState(null);
  const [activeTab, setActiveTab] = useState("latihan");
  const [activeFilter, setActiveFilter] = useState("semua");
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerMode, setTimerMode] = useState(null);
  const [customTimer, setCustomTimer] = useState(40);
  const [showTimerSetup, setShowTimerSetup] = useState(false);
  const router = useRouter();

  const formatHarga = (h) => `Rp ${h.toLocaleString("id-ID")}`;
  const formatSiswa = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}rb` : n;
  const sudahLengkap = provinsi && kabupaten && kelas && mapel;
  const filteredPaket = activeFilter === "semua" ? paketSoal : paketSoal.filter(p => p.filter.includes(activeFilter));

  const openModal = (paket) => { setSelectedPaket(paket); setTimerMode(null); setShowTimerSetup(false); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedPaket(null); setTimerMode(null); setShowTimerSetup(false); };

  return (
    <div className="min-h-screen" style={{ background: "#F0F2F7" }}>

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
                {selectedPaket.badge && (
                  <div style={{ display: "inline-block", background: selectedPaket.badgeColor, color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50, marginBottom: 10 }}>{selectedPaket.badge}</div>
                )}
                <div style={{ fontWeight: 900, fontSize: 20, color: "#0F1E3A", marginBottom: 6 }}>{selectedPaket.judul}</div>
                <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, marginBottom: 16 }}>{selectedPaket.desc}</div>
                <div style={{ background: "#F8F9FA", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <div className="grid-3" style={{ textAlign: "center" }}>
                    {[["📝", `${selectedPaket.soal}`, "Soal"], ["⏱️", `${selectedPaket.waktu} mnt`, "Waktu"], ["👥", formatSiswa(selectedPaket.siswa), "Siswa"]].map(([icon, val, label]) => (
                      <div key={label} style={{ background: "white", borderRadius: 10, padding: 12 }}>
                        <div style={{ fontSize: 20 }}>{icon}</div>
                        <div style={{ fontWeight: 900, fontSize: 15, color: WARNA }}>{val}</div>
                        <div style={{ fontSize: 10, color: "#9AA5B4", fontWeight: 600 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: WARNA, marginBottom: 10 }}>✨ Yang kamu dapat:</div>
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
                  <div style={{ fontSize: 26, fontWeight: 900, color: WARNA }}>{formatHarga(selectedPaket.harga)}</div>
                  <div style={{ fontSize: 11, color: "#27AE60", fontWeight: 700, background: "#EEF9EE", padding: "5px 10px", borderRadius: 50 }}>👥 {formatSiswa(selectedPaket.siswa)} siswa</div>
                </div>
                <div style={{ background: "#EEF2F9", borderRadius: 10, padding: "10px 14px", marginBottom: 14, textAlign: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: WARNA }}>🎁 Coba 3 soal pertama GRATIS!</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-outline" style={{ flex: 1, borderColor: WARNA, color: WARNA }}>Coba Gratis</button>
                  <button onClick={() => setShowTimerSetup(true)} style={{ flex: 2, background: WARNA, color: "white", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Beli & Mulai →</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <button onClick={() => setShowTimerSetup(false)} style={{ background: "#F0F2F7", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>← Kembali</button>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>Pilih Mode Timer</div>
                </div>
                <div style={{ background: "#F8F9FA", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, fontWeight: 600, color: "#4A5568" }}>
                  {selectedPaket.judul} · {kelas?.label} · {mapel?.label}
                </div>
                <div className="grid-2" style={{ marginBottom: 20 }}>
                  {[
                    { mode: "standar", icon: "⏱️", label: "Timer Standar", desc: "Sesuai standar ujian resmi", val: `${selectedPaket.waktu} menit` },
                    { mode: "custom", icon: "🎯", label: "Timer Custom", desc: "Atur sendiri waktumu", val: "5–180 menit" },
                  ].map((t) => (
                    <div key={t.mode} onClick={() => setTimerMode(t.mode)} style={{ border: `2px solid ${timerMode === t.mode ? WARNA : "#E2E8F0"}`, borderRadius: 14, padding: 16, cursor: "pointer", background: timerMode === t.mode ? "#EEF6FF" : "white", textAlign: "center", transition: "all 0.2s" }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
                      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: "#9AA5B4", marginBottom: 8 }}>{t.desc}</div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: WARNA }}>{t.val}</div>
                    </div>
                  ))}
                </div>
                {timerMode === "custom" && (
                  <div style={{ background: "#F8F9FA", borderRadius: 14, padding: 18, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: WARNA }}>Atur Waktu</span>
                      <span style={{ fontWeight: 900, fontSize: 22, color: WARNA }}>{customTimer} mnt</span>
                    </div>
                    <input type="range" min={5} max={180} step={5} value={customTimer} onChange={(e) => setCustomTimer(Number(e.target.value))} style={{ accentColor: WARNA }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9AA5B4", fontWeight: 600, margin: "8px 0 14px" }}>
                      <span>5 menit</span><span>180 menit</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[20, 40, 60, 80, 90, 120].map(t => (
                        <button key={t} onClick={() => setCustomTimer(t)} style={{ background: customTimer === t ? WARNA : "white", color: customTimer === t ? "white" : "#4A5568", border: `1px solid ${customTimer === t ? WARNA : "#E2E8F0"}`, borderRadius: 50, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t} mnt</button>
                      ))}
                    </div>
                  </div>
                )}
                {timerMode ? (
                  <button style={{ width: "100%", background: WARNA, color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    🚀 Mulai — {timerMode === "standar" ? selectedPaket.waktu : customTimer} Menit
                  </button>
                ) : (
                  <div style={{ textAlign: "center", padding: 14, fontSize: 13, color: "#9AA5B4", fontWeight: 600, background: "#F8F9FA", borderRadius: 12 }}>👆 Pilih mode timer dulu</div>
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
      <div style={{ background: `linear-gradient(135deg, ${WARNA}, #1A5276)`, padding: "32px 20px 44px" }}>
        <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "8px 16px", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ← Kembali
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ fontSize: 48 }}>📚</div>
          <div>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.25)", color: "white", fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, marginBottom: 8 }}>SEKOLAH MENENGAH PERTAMA</div>
            <h1 className="hero-title" style={{ color: "white", marginBottom: 4 }}>Latihan Soal SMP</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>Kelas 7–9 · Semua Mata Pelajaran · Kisi-kisi MGMP Lokal</p>
          </div>
        </div>
      </div>

      <div className="container">

        {/* STEP 1 - DAERAH */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div className="step-circle" style={{ background: provinsi && kabupaten ? "#27AE60" : WARNA }}>{provinsi && kabupaten ? "✓" : "1"}</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#1B3A6B" }}>Pilih Daerah</div>
          </div>
          <div style={{ fontSize: 13, color: "#9AA5B4", marginBottom: 16, paddingLeft: 38, fontWeight: 600 }}>Soal disesuaikan dengan kisi-kisi MGMP daerahmu</div>
          <div className="grid-2">
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#4A5568", marginBottom: 8 }}>Provinsi</div>
              <select className="select-input" value={provinsi} onChange={(e) => { setProvinsi(e.target.value); setKabupaten(""); setKelas(null); setMapel(null); }}>
                <option value="">-- Pilih Provinsi --</option>
                <option value="kalbar">Kalimantan Barat</option>
              </select>
            </div>
            {provinsi && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#4A5568", marginBottom: 8 }}>Kabupaten / Kota</div>
                <select className="select-input" value={kabupaten} onChange={(e) => { setKabupaten(e.target.value); setKelas(null); setMapel(null); }}>
                  <option value="">-- Pilih Kabupaten/Kota --</option>
                  {kabupatenKalbar.map((kab) => <option key={kab} value={kab}>{kab}</option>)}
                </select>
              </div>
            )}
          </div>
          {kabupaten && (
            <div style={{ marginTop: 14, background: "#EEF9EE", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span>✅</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#27AE60" }}>Soal dari MGMP {kabupaten} siap!</span>
            </div>
          )}
        </div>

        {/* STEP 2 - KELAS */}
        {kabupaten && (
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div className="step-circle" style={{ background: kelas ? "#27AE60" : WARNA }}>{kelas ? "✓" : "2"}</div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#1B3A6B" }}>Pilih Kelas</div>
            </div>
            <div style={{ fontSize: 13, color: "#9AA5B4", marginBottom: 16, paddingLeft: 38, fontWeight: 600 }}>Pilih kelas yang ingin kamu latih</div>
            <div className="grid-3">
              {kelasList.map((k) => (
                <div key={k.id} onClick={() => { setKelas(k); setMapel(null); }} style={{ background: kelas?.id === k.id ? WARNA : "#F8F9FA", borderRadius: 14, padding: "16px 10px", cursor: "pointer", border: `2px solid ${kelas?.id === k.id ? WARNA : "transparent"}`, textAlign: "center", transition: "all 0.2s", position: "relative" }}>
                  {k.ujianAkhir && <div style={{ position: "absolute", top: -8, right: -8, background: "#E74C3C", color: "white", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 50 }}>UJIAN</div>}
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: kelas?.id === k.id ? "white" : "#1B3A6B" }}>{k.label}</div>
                  <div style={{ fontSize: 10, color: kelas?.id === k.id ? "rgba(255,255,255,0.85)" : "#9AA5B4", marginTop: 4, lineHeight: 1.4 }}>{k.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 - MAPEL */}
        {kelas && (
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div className="step-circle" style={{ background: mapel ? "#27AE60" : WARNA }}>{mapel ? "✓" : "3"}</div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#1B3A6B" }}>Pilih Mata Pelajaran</div>
            </div>
            <div style={{ fontSize: 13, color: "#9AA5B4", marginBottom: 16, paddingLeft: 38, fontWeight: 600 }}>Untuk {kelas.label} · {kabupaten}</div>
            <div className="grid-5">
              {mapelList.map((m) => (
                <div key={m.id} onClick={() => setMapel(m)} style={{ background: mapel?.id === m.id ? m.color : "#F8F9FA", borderRadius: 14, padding: "16px 8px", cursor: "pointer", border: `2px solid ${mapel?.id === m.id ? m.color : "transparent"}`, textAlign: "center", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 12, color: mapel?.id === m.id ? "white" : "#1B3A6B" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 - PAKET */}
        {sudahLengkap && (
          <div>
            <div className="card" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "12px 20px" }}>
              <div className="step-circle" style={{ background: WARNA }}>4</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#4A5568" }}>Soal untuk:</span>
              <div style={{ background: "#1B3A6B", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 50 }}>{kelas.label}</div>
              <div style={{ background: mapel.color, color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 50 }}>{mapel.label}</div>
              <div style={{ background: "#D4A017", color: "#1B3A6B", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 50 }}>📍 {kabupaten}</div>
              <button onClick={() => { setKelas(null); setMapel(null); setProvinsi(""); setKabupaten(""); }} style={{ marginLeft: "auto", background: "transparent", border: "none", fontSize: 12, color: "#9AA5B4", cursor: "pointer", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ubah ↩</button>
            </div>

            <div className="tab-container">
              {[["latihan", "📝 Latihan Soal"], ["kisiKisi", "📋 Kisi-Kisi"]].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="tab-btn" style={{ background: activeTab === tab ? WARNA : "transparent", color: activeTab === tab ? "white" : "#4A5568" }}>{label}</button>
              ))}
            </div>

            {activeTab === "latihan" && (
              <div>
                <div className="filter-container">
                  {filterList.map(f => (
                    <button key={f.id} onClick={() => setActiveFilter(f.id)} className="filter-btn" style={{ background: activeFilter === f.id ? WARNA : "white", color: activeFilter === f.id ? "white" : "#4A5568", border: `1px solid ${activeFilter === f.id ? WARNA : "#E2E8F0"}` }}>{f.label}</button>
                  ))}
                </div>

                <div className="grid-4" style={{ marginBottom: 24 }}>
                  {filteredPaket.map((paket) => (
                    <div key={paket.id} className="paket-card" onClick={() => openModal(paket)}>
                      <div style={{ background: `linear-gradient(135deg, ${mapel.color}, ${mapel.color}99)`, padding: "20px 12px", textAlign: "center", position: "relative" }}>
                        {paket.badge && <div style={{ position: "absolute", top: 8, left: 8, background: paket.badgeColor, color: "white", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>{paket.badge}</div>}
                        <div style={{ fontSize: 32 }}>{paket.emoji}</div>
                        <div style={{ color: "white", fontWeight: 800, fontSize: 12, marginTop: 6, lineHeight: 1.3 }}>{paket.judul}</div>
                      </div>
                      <div style={{ padding: "12px" }}>
                        <div style={{ fontSize: 11, color: "#9AA5B4", fontWeight: 600, marginBottom: 4 }}>{paket.soal} Soal · {paket.waktu} mnt</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <div style={{ fontSize: 15, fontWeight: 900, color: WARNA }}>{formatHarga(paket.harga)}</div>
                          <div style={{ fontSize: 10, color: "#9AA5B4", fontWeight: 600 }}>👥 {formatSiswa(paket.siswa)}</div>
                        </div>
                        <div style={{ width: "100%", background: WARNA, color: "white", border: "none", borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: 800, cursor: "pointer", textAlign: "center" }}>Selengkapnya</div>
                      </div>
                    </div>
                  ))}
                </div>

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
                  <button style={{ background: "#D4A017", border: "none", borderRadius: 12, padding: "12px 28px", color: "#1B3A6B", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Coba Gratis →</button>
                </div>
              </div>
            )}

            {activeTab === "kisiKisi" && (
              <div>
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: "#1B3A6B" }}>Kisi-Kisi {mapel.label}</div>
                      <div style={{ fontSize: 13, color: "#9AA5B4", fontWeight: 600, marginTop: 4 }}>{kelas.label} · {kabupaten}</div>
                    </div>
                    <button style={{ background: WARNA, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>⬇️ Unduh PDF</button>
                  </div>
                  <div className="grid-3">
                    {kisiKisiDummy.map((bab, i) => (
                      <div key={i} style={{ borderLeft: `3px solid ${WARNA}`, paddingLeft: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: WARNA, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{bab.bab}</div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#0F1E3A", marginBottom: 4 }}>{bab.judul}</div>
                        <div style={{ fontSize: 12, color: "#4A5568", marginBottom: 8 }}>{bab.kompetensi}</div>
                        {bab.indikator.map((ind, j) => (
                          <div key={j} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                            <span style={{ color: WARNA, fontWeight: 800, flexShrink: 0 }}>•</span>
                            <span style={{ fontSize: 12, color: "#4A5568" }}>{ind}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#EEF6FF", border: `1px solid ${WARNA}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: WARNA }}>📋 Kisi-kisi berdasarkan Kurikulum Merdeka & MGMP {kabupaten}</div>
                  <div style={{ fontSize: 12, color: "#9AA5B4", marginTop: 4 }}>Diperbarui setiap semester</div>
                </div>
              </div>
            )}
          </div>
        )}
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