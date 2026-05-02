"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  {
    id: "sd",
    label: "SD",
    full: "Sekolah Dasar",
    grade: "Kelas 1 – 6",
    icon: "🎒",
    color: "#E67E22",
    desc: "Matematika, IPA, IPS, Bahasa Indonesia",
  },
  {
    id: "smp",
    label: "SMP",
    full: "Sekolah Menengah Pertama",
    grade: "Kelas 7 – 9",
    icon: "📚",
    color: "#2980B9",
    desc: "Matematika, IPA, IPS, Bahasa Inggris",
  },
  {
    id: "sma",
    label: "SMA",
    full: "Sekolah Menengah Atas",
    grade: "Kelas 10 – 12",
    icon: "🎓",
    color: "#8E44AD",
    desc: "Matematika, Fisika, Kimia, Biologi, Ekonomi",
  },
  {
    id: "cpns",
    label: "CPNS",
    full: "SKD CPNS / PPPK",
    grade: "TWK · TIU · TKP",
    icon: "🏛️",
    color: "#27AE60",
    desc: "Tes Wawasan Kebangsaan, Intelejensi Umum, Karakteristik Pribadi",
  },
];

const features = [
  { icon: "🎯", title: "Kisi-kisi MGMP Resmi", desc: "Soal sesuai kisi-kisi dari MGMP seluruh Indonesia" },
  { icon: "⏱️", title: "Simulasi Ujian", desc: "Timer hitung mundur seperti ujian sesungguhnya" },
  { icon: "📖", title: "Pembahasan Lengkap", desc: "Setiap soal ada pembahasannya" },
  { icon: "📊", title: "Analisis Hasil", desc: "Pantau perkembangan belajarmu" },
];

export default function Home() {
  const [hovered, setHovered] = useState(null);
  const router = useRouter();

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

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #2D5FA8 100%)", padding: "64px 28px 72px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#D4A017", color: "#1B3A6B", fontSize: 12, fontWeight: 800, padding: "5px 18px", borderRadius: 50, marginBottom: 24, letterSpacing: 1 }}>
          PLATFORM LATIHAN SOAL #1 INDONESIA
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: "white", lineHeight: 1.25, marginBottom: 18, maxWidth: 520, margin: "0 auto 18px" }}>
          Belajar Lebih Cerdas,<br />
          <span style={{ color: "#D4A017" }}>Lulus Lebih Pasti</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 17, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Latihan soal dari kisi-kisi MGMP resmi seluruh Indonesia. Pilih jenjangmu dan mulai latihan sekarang!
        </p>
        <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap", marginTop: 36 }}>
          {[["10.000+", "Soal"], ["34", "Provinsi"], ["500+", "Kab/Kota"], ["4", "Jenjang"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#D4A017" }}>{val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PILIH JENJANG */}
      <div style={{ padding: "48px 24px", maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, textAlign: "center", marginBottom: 8 }}>Pilih Jenjangmu</h2>
        <p style={{ textAlign: "center", color: "#4A5568", fontSize: 16, marginBottom: 32 }}>
          Klik jenjang untuk melihat paket latihan soal yang tersedia
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => router.push(`/${cat.id}`)}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "white",
                borderRadius: 20,
                padding: "28px 22px",
                cursor: "pointer",
                border: `2px solid ${hovered === cat.id ? cat.color : "transparent"}`,
                boxShadow: hovered === cat.id ? `0 8px 28px ${cat.color}33` : "0 2px 10px rgba(0,0,0,0.07)",
                transition: "all 0.2s",
                transform: hovered === cat.id ? "translateY(-5px)" : "none",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{cat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: cat.color, marginBottom: 4 }}>{cat.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1B3A6B", marginBottom: 4 }}>{cat.full}</div>
              <div style={{ fontSize: 13, color: "#9AA5B4", fontWeight: 600, marginBottom: 10 }}>{cat.grade}</div>
              <div style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.6, marginBottom: 16 }}>{cat.desc}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: cat.color }}>Lihat Paket →</div>
            </div>
          ))}
        </div>
      </div>

      {/* MGMP BANNER */}
      <div style={{ padding: "0 24px 48px", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #1B3A6B, #2D5FA8)", borderRadius: 22, padding: "32px 28px", color: "white" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🤝</div>
          <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Bermitra dengan Ribuan MGMP Se-Indonesia</h3>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 20 }}>
            Soal KisioID disusun berdasarkan kisi-kisi resmi MGMP dari setiap kabupaten/kota di seluruh Indonesia — memastikan relevansi dengan ujian lokal di daerahmu.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["34 Provinsi", "500+ Kab/Kota", "Semua Mapel", "Update Berkala"].map(tag => (
              <div key={tag} style={{ background: "rgba(212,160,23,0.25)", border: "1px solid #D4A017", borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 700, color: "#D4A017" }}>{tag}</div>
            ))}
          </div>
        </div>
      </div>

      {/* FITUR */}
      <div style={{ padding: "0 24px 48px", maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: "center", marginBottom: 24 }}>Kenapa KisioID?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: "white", borderRadius: 16, padding: 22, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, color: "#1B3A6B" }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#1B3A6B", padding: "48px 28px", textAlign: "center" }}>
        <h2 style={{ color: "white", fontWeight: 900, fontSize: 26, marginBottom: 12 }}>Siap Mulai Latihan?</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 28 }}>
          Pilih jenjangmu dan mulai latihan soal sekarang juga
        </p>
        <button style={{ background: "#D4A017", border: "none", borderRadius: 12, padding: "16px 44px", color: "#1B3A6B", fontWeight: 800, fontSize: 17, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Mulai Latihan Gratis →
        </button>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#0F1E3A", padding: "24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 30, height: 30, background: "#D4A017", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#1B3A6B" }}>K</div>
          <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>Kisio<span style={{ color: "#D4A017" }}>ID</span></span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>© 2025 KisioID — Platform Latihan Soal #1 Indonesia</div>
      </div>

    </div>
  );
}