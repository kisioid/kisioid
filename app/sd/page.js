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
  { id: 1, label: "Kelas 1", icon: "1️⃣", desc: "Membaca, menulis, berhitung dasar" },
  { id: 2, label: "Kelas 2", icon: "2️⃣", desc: "Operasi hitung, membaca lancar" },
  { id: 3, label: "Kelas 3", icon: "3️⃣", desc: "Perkalian, pembagian, lingkungan" },
  { id: 4, label: "Kelas 4", icon: "4️⃣", desc: "Pecahan, bangun datar, ekosistem" },
  { id: 5, label: "Kelas 5", icon: "5️⃣", desc: "Bilangan bulat, volume, statistika" },
  { id: 6, label: "Kelas 6", icon: "6️⃣", desc: "Persiapan ujian akhir SD", ujianAkhir: true },
];

const mapelList = [
  { id: "matematika", label: "Matematika", icon: "🔢", color: "#E67E22" },
  { id: "ipa", label: "IPA", icon: "🔬", color: "#27AE60" },
  { id: "ips", label: "IPS", icon: "🌍", color: "#2980B9" },
  { id: "bind", label: "B. Indonesia", icon: "📝", color: "#8E44AD" },
  { id: "ppkn", label: "PPKn", icon: "🏛️", color: "#E74C3C" },
];

const paketSoal = [
  { id: 1, judul: "Latihan Harian 1", desc: "Soal latihan harian sesuai kisi-kisi MGMP daerahmu", soal: 20, waktu: 30, harga: 2000, badge: "BARU", badgeColor: "#27AE60", emoji: "📝", siswa: 234, filter: ["terbaru","uts"] },
  { id: 2, judul: "Latihan Harian 2", desc: "Variasi soal berbeda dari Part 1, tingkat sedang", soal: 20, waktu: 30, harga: 2000, badge: null, badgeColor: null, emoji: "📝", siswa: 189, filter: ["terbaru"] },
  { id: 3, judul: "Latihan Harian 3", desc: "Soal latihan harian tingkat kesulitan lebih tinggi", soal: 20, waktu: 30, harga: 2000, badge: null, badgeColor: null, emoji: "📝", siswa: 156, filter: ["terbaru"] },
  { id: 4, judul: "Simulasi UTS", desc: "Simulasi Ujian Tengah Semester sesuai kisi-kisi daerahmu", soal: 30, waktu: 45, harga: 2000, badge: "🔥 POPULER", badgeColor: "#E67E22", emoji: "📋", siswa: 1243, filter: ["terpopuler","uts"] },
  { id: 5, judul: "Simulasi UAS", desc: "Simulasi Ujian Akhir Semester sesuai kisi-kisi daerahmu", soal: 40, waktu: 60, harga: 2000, badge: "🔥 POPULER", badgeColor: "#E67E22", emoji: "📋", siswa: 987, filter: ["terpopuler","uas"] },
  { id: 6, judul: "Bundling Lengkap", desc: "Semua paket dalam satu — latihan harian + UTS + UAS lengkap", soal: 100, waktu: 120, harga: 8000, badge: "HEMAT 50%", badgeColor: "#E74C3C", emoji: "🎁", siswa: 567, filter: ["terpopuler","uts","uas"] },
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
  { bab: "Bab 1", judul: "Bilangan dan Operasi Hitung", kompetensi: "Memahami operasi hitung bilangan bulat dan pecahan", indikator: ["Menentukan hasil operasi hitung campuran", "Menyelesaikan soal cerita operasi hitung", "Membandingkan pecahan"] },
  { bab: "Bab 2", judul: "Geometri dan Pengukuran", kompetensi: "Memahami bangun datar dan pengukuran", indikator: ["Menghitung luas dan keliling bangun datar", "Mengkonversi satuan panjang dan berat", "Menyelesaikan soal pengukuran"] },
  { bab: "Bab 3", judul: "Statistika Sederhana", kompetensi: "Menyajikan dan mengolah data sederhana", indikator: ["Membaca diagram batang dan garis", "Menghitung rata-rata, median, modus", "Menyajikan data dalam tabel"] },
];

const filterList = [
  { id: "semua", label: "Semua" },
  { id: "terbaru", label: "🆕 Terbaru" },
  { id: "terpopuler", label: "🔥 Terpopuler" },
  { id: "uts", label: "📝 UTS" },
  { id: "uas", label: "📋 UAS" },
];

export default function SD() {
  const [provinsi, setProvinsi] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [kelas, setKelas] = useState(null);
  const [mapel, setMapel] = useState(null);
  const [activeTab, setActiveTab] = useState("latihan");
  const [activeFilter, setActiveFilter] = useState("semua");
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerMode, setTimerMode] = useState(null);
  const [customTimer, setCustomTimer] = useState(30);
  const [showTimerSetup, setShowTimerSetup] = useState(false);
  const router = useRouter();

  const formatHarga = (h) => `Rp ${h.toLocaleString("id-ID")}`;
  const formatSiswa = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}rb` : n;
  const sudahLengkap = provinsi && kabupaten && kelas && mapel;

  const filteredPaket = activeFilter === "semua"
    ? paketSoal
    : paketSoal.filter(p => p.filter.includes(activeFilter));

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
                <div className="flex justify-between items-start mb-4">
                  <div style={{ fontSize: 44 }}>{selectedPaket.emoji}</div>
                  <button onClick={closeModal} className="btn-close">✕</button>
                </div>

                {selectedPaket.badge && (
                  <div style={{ display: "inline-block", background: selectedPaket.badgeColor, color: "white", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50, marginBottom: 10 }}>{selectedPaket.badge}</div>
                )}

                <div style={{ fontWeight: 900, fontSize: 20, color: "#0F1E3A", marginBottom: 6 }}>{selectedPaket.judul}</div>
                <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7, marginBottom: 16 }}>{selectedPaket.desc}</div>

                <div style={{ background: "#F8F9FA", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <div className="grid-3" style={{ textAlign: "center" }}>
                    {[["📝", `${selectedPaket.soal}`, "Soal"], ["⏱️", `${selectedPaket.waktu} mnt`, "Waktu"], ["👥", `${formatSiswa(selectedPaket.siswa)}`, "Siswa"]].map(([icon, val, label]) => (
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
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#E67E22" }}>{formatHarga(selectedPaket.harga)}</div>
                  <div style={{ fontSize: 11, color: "#27AE60", fontWeight: 700, background: "#EEF9EE", padding: "5px 10px", borderRadius: 50 }}>👥 {formatSiswa(selectedPaket.siswa)} siswa</div>
                </div>

                <div style={{ background: "#EEF2F9", borderRadius: 10, padding: "10px 14px", marginBottom: 14, textAlign: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1B3A6B" }}>🎁 Coba 3 soal pertama GRATIS!</span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-outline" style={{ flex: 1 }}>Coba Gratis</button>
                  <button onClick={() => setShowTimerSetup(true)} className="btn-primary" style={{ flex: 2 }}>Beli & Mulai →</button>
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
                    <div
                      key={t.mode}
                      onClick={() => setTimerMode(t.mode)}
                      style={{
                        border: `2px solid ${timerMode === t.mode ? "#E67E22" : "#E2E8F0"}`,
                        borderRadius: 14, padding: 16, cursor: "pointer",
                        background: timerMode === t.mode ? "#FFF4EC" : "white",
                        textAlign: "center", transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
                      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: "#9AA5B4", marginBottom: 8 }}>{t.desc}</div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: "#E67E22" }}>{t.val}</div>
                    </div>
                  ))}
                </div>

                {timerMode === "custom" && (
                  <div style={{ background: "#F8F9FA", borderRadius: 14, padding: 18, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1B3A6B" }}>Atur Waktu</span>
                      <span style={{ fontWeight: 900, fontSize: 22, color: "#E67E22" }}>{customTimer} mnt</span>
                    </div>
                    <input type="range" min={5} max={180} step={5} value={customTimer} onChange={(e) => setCustomTimer(Number(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9AA5B4", fontWeight: 600, margin: "8px 0 14px" }}>
                      <span>5 menit</span><span>180 menit</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[15, 30, 45, 60, 90, 120].map(t => (
                        <button key={t} onClick={() => setCustomTimer(t)} style={{ background: customTimer === t ? "#E67E22" : "white", color: customTimer === t ? "white" : "#4A5568", border: `1px solid ${customTimer === t ? "#E67E22" : "#E2E8F0"}`, borderRadius: 50, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t} mnt</button>
                      ))}
                    </div>
                  </div>
                )}

                {timerMode ? (
                  <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 15 }}>
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
      <div style={{ background: "linear-gradient(135deg, #E67E22, #F39C12)", padding: "32px 20px 44px" }}>
        <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "8px 16px", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ← Kembali
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ fontSize: 48 }}>🎒</div>
          <div>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.25)", color: "white", fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, marginBottom: 8 }}>SEKOLAH DASAR</div>
            <h1 className="hero-title" style={{ color: "white", marginBottom: 4 }}>Latihan Soal SD</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>Kelas 1–6 · Semua Mata Pelajaran · Kisi-kisi MGMP Lokal</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container">

        {/* STEP 1 - PILIH DAERAH */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div className="step-circle" style={{ background: provinsi && kabupaten ? "#27AE60" : "#E67E22" }}>
              {provinsi && kabupaten ? "✓" : "1"}
            </div>
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
                  {kabupatenKalbar.map((kab) => (
                    <option key={kab} value={kab}>{kab}</option>
                  ))}
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

        {/* STEP 2 - PILIH KELAS */}
        {kabupaten && (
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div className="step-circle" style={{ background: kelas ? "#27AE60" : "#E67E22" }}>
                {kelas ? "✓" : "2"}
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#1B3A6B" }}>Pilih Kelas</div>
            </div>
            <div style={{ fontSize: 13, color: "#9AA5B4", marginBottom: 16, paddingLeft: 38, fontWeight: 600 }}>Pilih kelas yang ingin kamu latih</div>
            <div className="grid-6">
              {kelasList.map((k) => (
                <div
                  key={k.id}
                  onClick={() => { setKelas(k); setMapel(null); }}
                  style={{
                    background: kelas?.id === k.id ? "#E67E22" : "#F8F9FA",
                    borderRadius: 14, padding: "14px 8px", cursor: "pointer",
                    border: `2px solid ${kelas?.id === k.id ? "#E67E22" : "transparent"}`,
                    textAlign: "center", transition: "all 0.2s", position: "relative",
                  }}
                >
                  {k.ujianAkhir && (
                    <div style={{ position: "absolute", top: -8, right: -8, background: "#E74C3C", color: "white", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 50 }}>UJIAN</div>
                  )}
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{k.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 12, color: kelas?.id === k.id ? "white" : "#1B3A6B" }}>{k.label}</div>
                  <div style={{ fontSize: 9, color: kelas?.id === k.id ? "rgba(255,255,255,0.85)" : "#9AA5B4", marginTop: 2, lineHeight: 1.4 }}>{k.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 - PILIH MAPEL */}
        {kelas && (
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div className="step-circle" style={{ background: mapel ? "#27AE60" : "#E67E22" }}>
                {mapel ? "✓" : "3"}
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#1B3A6B" }}>Pilih Mata Pelajaran</div>
            </div>
            <div style={{ fontSize: 13, color: "#9AA5B4", marginBottom: 16, paddingLeft: 38, fontWeight: 600 }}>Untuk {kelas.label} · {kabupaten}</div>
            <div className="grid-5">
              {mapelList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMapel(m)}
                  style={{
                    background: mapel?.id === m.id ? m.color : "#F8F9FA",
                    borderRadius: 14, padding: "16px 8px", cursor: "pointer",
                    border: `2px solid ${mapel?.id === m.id ? m.color : "transparent"}`,
                    textAlign: "center", transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 12, color: mapel?.id === m.id ? "white" : "#1B3A6B" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 - PAKET SOAL */}
        {sudahLengkap && (
          <div>
            {/* Info */}
            <div className="card" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "12px 20px" }}>
              <div className="step-circle" style={{ background: "#E67E22" }}>4</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#4A5568" }}>Soal untuk:</span>
              <div style={{ background: "#1B3A6B", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 50 }}>{kelas.label}</div>
              <div style={{ background: mapel.color, color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 50 }}>{mapel.label}</div>
              <div style={{ background: "#D4A017", color: "#1B3A6B", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 50 }}>📍 {kabupaten}</div>
              <button onClick={() => { setKelas(null); setMapel(null); setProvinsi(""); setKabupaten(""); }} style={{ marginLeft: "auto", background: "transparent", border: "none", fontSize: 12, color: "#9AA5B4", cursor: "pointer", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ubah ↩</button>
            </div>

            {/* TAB */}
            <div className="tab-container">
              {[["latihan", "📝 Latihan Soal"], ["kisiKisi", "📋 Kisi-Kisi"]].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="tab-btn" style={{ background: activeTab === tab ? "#E67E22" : "transparent", color: activeTab === tab ? "white" : "#4A5568" }}>{label}</button>
              ))}
            </div>

            {/* LATIHAN SOAL */}
            {activeTab === "latihan" && (
              <div>
                {/* FILTER */}
                <div className="filter-container">
                  {filterList.map(f => (
                    <button key={f.id} onClick={() => setActiveFilter(f.id)} className="filter-btn" style={{ background: activeFilter === f.id ? "#E67E22" : "white", color: activeFilter === f.id ? "white" : "#4A5568", border: `1px solid ${activeFilter === f.id ? "#E67E22" : "#E2E8F0"}` }}>{f.label}</button>
                  ))}
                </div>

                {/* GRID PAKET */}
                <div className="grid-4" style={{ marginBottom: 24 }}>
                  {filteredPaket.map((paket) => (
                    <div key={paket.id} className="paket-card" onClick={() => openModal(paket)}>
                      <div style={{ background: `linear-gradient(135deg, ${mapel.color}, ${mapel.color}99)`, padding: "20px 12px", textAlign: "center", position: "relative" }}>
                        {paket.badge && (
                          <div style={{ position: "absolute", top: 8, left: 8, background: paket.badgeColor, color: "white", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>{paket.badge}</div>
                        )}
                        <div style={{ fontSize: 32 }}>{paket.emoji}</div>
                        <div style={{ color: "white", fontWeight: 800, fontSize: 12, marginTop: 6, lineHeight: 1.3 }}>{paket.judul}</div>
                      </div>
                      <div style={{ padding: "12px" }}>
                        <div style={{ fontSize: 11, color: "#9AA5B4", fontWeight: 600, marginBottom: 4 }}>{paket.soal} Soal · {paket.waktu} mnt</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <div style={{ fontSize: 15, fontWeight: 900, color: "#E67E22" }}>{formatHarga(paket.harga)}</div>
                          <div style={{ fontSize: 10, color: "#9AA5B4", fontWeight: 600 }}>👥 {formatSiswa(paket.siswa)}</div>
                        </div>
                        <div style={{ width: "100%", background: "#E67E22", color: "white", border: "none", borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: 800, cursor: "pointer", textAlign: "center" }}>Selengkapnya</div>
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
            )}

            {/* KISI-KISI */}
            {activeTab === "kisiKisi" && (
              <div>
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: "#1B3A6B" }}>Kisi-Kisi {mapel.label}</div>
                      <div style={{ fontSize: 13, color: "#9AA5B4", fontWeight: 600, marginTop: 4 }}>{kelas.label} · {kabupaten}</div>
                    </div>
                    <button className="btn-primary" style={{ fontSize: 13 }}>⬇️ Unduh PDF</button>
                  </div>
                  <div className="grid-3">
                    {kisiKisiDummy.map((bab, i) => (
                      <div key={i} style={{ borderLeft: "3px solid #E67E22", paddingLeft: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#E67E22", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{bab.bab}</div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#0F1E3A", marginBottom: 4 }}>{bab.judul}</div>
                        <div style={{ fontSize: 12, color: "#4A5568", marginBottom: 8 }}>{bab.kompetensi}</div>
                        {bab.indikator.map((ind, j) => (
                          <div key={j} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                            <span style={{ color: "#E67E22", fontWeight: 800, flexShrink: 0 }}>•</span>
                            <span style={{ fontSize: 12, color: "#4A5568" }}>{ind}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#FFF8EE", border: "1px solid #F39C12", borderRadius: 14, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#E67E22" }}>📋 Kisi-kisi berdasarkan Kurikulum Merdeka & MGMP {kabupaten}</div>
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