"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

function KuisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paketId = searchParams.get("paket");
  const customWaktu = searchParams.get("waktu");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paket, setPaket] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [ragu, setRagu] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [hasil, setHasil] = useState(null);
  const timerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  useEffect(() => {
    if (!paketId) { setError("Paket soal tidak ditemukan!"); setLoading(false); return; }
    loadSoal();
  }, [paketId]);

  useEffect(() => {
    if (!loading && !selesai && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); handleSelesai(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, selesai]);

  const loadSoal = async () => {
    try {
      const { data: paketData, error: paketError } = await supabase
        .from("paket_soal").select("*").eq("id", paketId).single();
      if (paketError) throw paketError;
      setPaket(paketData);
      const waktu = customWaktu ? parseInt(customWaktu) : paketData.waktu;
      setTimeLeft(waktu * 60);

      const { data: soalData, error: soalError } = await supabase
        .from("soal").select("*").eq("paket_id", paketId).order("urutan");
      if (soalError) throw soalError;

      const soalLengkap = await Promise.all(soalData.map(async (s) => {
        if (s.tipe === "PG" || s.tipe === "PGK") {
          const { data: pilihan } = await supabase
            .from("pilihan_jawaban").select("*").eq("soal_id", s.id).order("huruf");
          return { ...s, pilihan: pilihan || [] };
        } else if (s.tipe === "MJ") {
          const { data: pasangan } = await supabase
            .from("pasangan_menjodohkan").select("*").eq("soal_id", s.id).order("nomor_item");
          const { data: pilihanKanan } = await supabase
            .from("pilihan_menjodohkan").select("*").eq("soal_id", s.id).order("huruf");
          return { ...s, pasangan: pasangan || [], pilihanKanan: pilihanKanan || [] };
        } else if (s.tipe === "IS") {
          const { data: isianData } = await supabase
            .from("jawaban_isian").select("*").eq("soal_id", s.id);
          return { ...s, isian: isianData?.[0] || null };
        }
        return s;
      }));

      setSoalList(soalLengkap);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleJawabPG = (soalId, huruf) => setJawaban(prev => ({ ...prev, [soalId]: huruf }));

  const handleJawabPGK = (soalId, huruf) => {
    const current = jawaban[soalId] || [];
    if (current.includes(huruf)) {
      setJawaban(prev => ({ ...prev, [soalId]: current.filter(h => h !== huruf) }));
    } else {
      if (current.length >= 2) return;
      setJawaban(prev => ({ ...prev, [soalId]: [...current, huruf] }));
    }
  };

  const handleJawabMJ = (soalId, nomorItem, huruf) => {
    const current = jawaban[soalId] || {};
    setJawaban(prev => ({ ...prev, [soalId]: { ...current, [nomorItem]: huruf } }));
  };

  const handleJawabIS = (soalId, teks) => setJawaban(prev => ({ ...prev, [soalId]: teks }));

  const toggleRagu = (soalId) => setRagu(prev => ({ ...prev, [soalId]: !prev[soalId] }));

  // Cari konteks yang berlaku untuk soal saat ini
  // Konteks dari soal sebelumnya yang masih relevan
  const getKonteksAktif = (index) => {
    const soal = soalList[index];
    if (soal?.konteks) return soal.konteks;
    // Cari konteks dari soal sebelumnya yang terdekat
    for (let i = index - 1; i >= 0; i--) {
      if (soalList[i]?.konteks) {
        // Cek apakah konteks masih relevan (soal berikutnya tidak punya konteks baru)
        return soalList[i].konteks;
      }
    }
    return null;
  };

  const hitungSkor = () => {
    let totalSkor = 0;
    let detail = [];
    soalList.forEach(soal => {
      const jwb = jawaban[soal.id];
      let skorDapat = 0;
      let benar = false;

      if (soal.tipe === "PG") {
        const jawabanBenar = soal.pilihan?.find(p => p.adalah_benar)?.huruf;
        benar = jwb === jawabanBenar;
        skorDapat = benar ? soal.skor : 0;
      } else if (soal.tipe === "PGK") {
        const jawabanBenar = soal.pilihan?.filter(p => p.adalah_benar).map(p => p.huruf).sort();
        const jwbArray = (jwb || []).sort();
        const benarCount = jwbArray.filter(h => jawabanBenar?.includes(h)).length;
        const salahCount = jwbArray.filter(h => !jawabanBenar?.includes(h)).length;
        if (salahCount === 0 && benarCount === 2) skorDapat = 2;
        else if (benarCount === 1 && salahCount === 0) skorDapat = 1;
        else skorDapat = 0;
        benar = skorDapat === 2;
      } else if (soal.tipe === "MJ") {
        const jwbObj = jwb || {};
        let skorMJ = 0;
        soal.pasangan?.forEach(p => { if (jwbObj[p.nomor_item] === p.jawaban_benar) skorMJ++; });
        skorDapat = skorMJ;
        benar = skorMJ === soal.pasangan?.length;
      } else if (soal.tipe === "IS") {
        const jwbTeks = (jwb || "").trim().toLowerCase();
        const benarTeks = soal.isian?.jawaban_benar?.toLowerCase() || "";
        const alternatif = soal.isian?.jawaban_alternatif?.map(a => a.toLowerCase()) || [];
        benar = jwbTeks === benarTeks || alternatif.includes(jwbTeks);
        skorDapat = benar ? soal.skor : 0;
      }

      totalSkor += skorDapat;
      detail.push({ soal, skorDapat, benar, jwb });
    });

    const nilai = hitungNilai(totalSkor, paket?.skor_maks || 73);
    return { totalSkor, nilai, detail };
  };

  const hitungNilai = (skor, skorMaks) => {
    const tabel = [
      [1,1],[2,3],[3,4],[4,5],[5,7],[6,8],[7,10],[8,11],[9,12],[10,14],
      [11,15],[12,16],[13,18],[14,19],[15,21],[16,22],[17,23],[18,25],[19,26],[20,27],
      [21,29],[22,30],[23,32],[24,33],[25,34],[26,36],[27,37],[28,38],[29,40],[30,41],
      [31,42],[32,44],[33,45],[34,47],[35,48],[36,49],[37,51],[38,52],[39,53],[40,55],
      [41,56],[42,58],[43,59],[44,60],[45,62],[46,63],[47,64],[48,66],[49,67],[50,68],
      [51,70],[52,71],[53,73],[54,74],[55,75],[56,77],[57,78],[58,79],[59,81],[60,82],
      [61,84],[62,85],[63,86],[64,88],[65,89],[66,90],[67,92],[68,93],[69,95],[70,96],
      [71,97],[72,99],[73,100]
    ];
    const entry = tabel.find(([s]) => s === skor);
    return entry ? entry[1] : Math.round((skor / skorMaks) * 100);
  };

  const handleSelesai = () => {
    clearInterval(timerRef.current);
    const h = hitungSkor();
    setHasil(h);
    setSelesai(true);
  };

  const fmtTimer = (s) => ({
    jam: Math.floor(s / 3600).toString().padStart(2, "0"),
    menit: Math.floor((s % 3600) / 60).toString().padStart(2, "0"),
    detik: (s % 60).toString().padStart(2, "0"),
  });

  const sudahDijawab = (s) => {
    const jwb = jawaban[s.id];
    if (!jwb) return false;
    if (typeof jwb === "string") return jwb.length > 0;
    if (Array.isArray(jwb)) return jwb.length > 0;
    if (typeof jwb === "object") return Object.keys(jwb).length > 0;
    return false;
  };

  const tipeConfig = {
    PG: { label: "Pilihan Ganda", color: "#2980B9", bg: "#EEF6FF", desc: "Pilih 1 jawaban yang benar" },
    PGK: { label: "Pilihan Ganda Kompleks", color: "#E67E22", bg: "#FFF4EC", desc: "⚠️ Pilih tepat 2 jawaban yang benar!" },
    MJ: { label: "Menjodohkan", color: "#8E44AD", bg: "#F5EEF8", desc: "Pasangkan item kiri dengan jawaban yang tepat" },
    IS: { label: "Isian Singkat", color: "#27AE60", bg: "#EEF9EE", desc: "Tuliskan jawaban dengan tepat" },
  };

  const urgent = timeLeft < 60;
  const soal = soalList[currentIndex];
  const timer = fmtTimer(timeLeft);
  const konteksAktif = soal ? getKonteksAktif(currentIndex) : null;

  // LOADING
  if (loading) return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F2F7" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: "#1B3A6B" }}>Memuat soal...</div>
        <div style={{ fontSize: 14, color: "#9AA5B4", marginTop: 8 }}>Mohon tunggu sebentar</div>
      </div>
    </div>
  );

  // ERROR
  if (error) return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F2F7" }}>
      <div style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: "#E74C3C" }}>Terjadi Kesalahan</div>
        <div style={{ fontSize: 14, color: "#9AA5B4", marginTop: 8, marginBottom: 20 }}>{error}</div>
        <button onClick={() => router.back()} style={{ background: "#1B3A6B", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>← Kembali</button>
      </div>
    </div>
  );

  // HASIL
  if (selesai && hasil) {
    const { totalSkor, nilai, detail } = hasil;
    const grade = nilai >= 80 ? { label: "Luar Biasa!", color: "#27AE60", bg: "#EEF9EE", icon: "🏆" }
      : nilai >= 65 ? { label: "Cukup Baik!", color: "#E67E22", bg: "#FFF4EC", icon: "👍" }
      : { label: "Perlu Latihan Lagi", color: "#E74C3C", bg: "#FEE2E2", icon: "💪" };

    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F0F2F7", minHeight: "100vh" }}>
        <nav style={{ background: "#1B3A6B", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#D4A017", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#1B3A6B" }}>K</div>
            <span style={{ color: "white", fontWeight: 900, fontSize: 20 }}>Kisio<span style={{ color: "#D4A017" }}>ID</span></span>
          </div>
        </nav>

        <div style={{ background: grade.bg, padding: "40px 20px", textAlign: "center", borderBottom: `3px solid ${grade.color}` }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{grade.icon}</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: grade.color, marginBottom: 6 }}>{grade.label}</h1>
          <p style={{ fontSize: 14, color: "#4A5568" }}>{paket?.judul}</p>
        </div>

        <div className="container">
          <div className="card" style={{ marginTop: -20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 40, fontWeight: 900, color: grade.color }}>{nilai}</div>
                <div style={{ fontSize: 12, color: "#9AA5B4", fontWeight: 600 }}>NILAI</div>
              </div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 900, color: "#1B3A6B" }}>{totalSkor}</div>
                <div style={{ fontSize: 12, color: "#9AA5B4", fontWeight: 600 }}>SKOR</div>
              </div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 900, color: "#1B3A6B" }}>{paket?.skor_maks}</div>
                <div style={{ fontSize: 12, color: "#9AA5B4", fontWeight: 600 }}>MAKS</div>
              </div>
            </div>
            <div className="grid-2">
              {["PG","PGK","MJ","IS"].map(tipe => {
                const soalTipe = detail.filter(d => d.soal.tipe === tipe);
                const skorTipe = soalTipe.reduce((a,b) => a + b.skorDapat, 0);
                const maksTipe = soalTipe.reduce((a,b) => a + b.soal.skor, 0);
                const cfg = tipeConfig[tipe];
                return (
                  <div key={tipe} style={{ background: cfg.bg, borderRadius: 12, padding: 14, border: `1px solid ${cfg.color}33` }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: cfg.color, marginBottom: 4 }}>{cfg.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#1B3A6B" }}>{skorTipe}<span style={{ fontSize: 13, color: "#9AA5B4" }}>/{maksTipe}</span></div>
                    <div style={{ height: 5, background: "#E2E8F0", borderRadius: 3, marginTop: 8 }}>
                      <div style={{ height: "100%", background: cfg.color, borderRadius: 3, width: `${maksTipe > 0 ? (skorTipe/maksTipe)*100 : 0}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, color: "#1B3A6B" }}>📋 Review Jawaban</div>
            {detail.map((d, i) => {
              const cfg = tipeConfig[d.soal.tipe];
              return (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #F0F2F7", alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: d.benar ? "#27AE60" : d.skorDapat > 0 ? "#E67E22" : "#E74C3C", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{d.soal.nomor}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: cfg.color, marginBottom: 2 }}>{cfg.label} · Skor: {d.skorDapat}/{d.soal.skor}</div>
                    <div style={{ fontSize: 12, color: "#4A5568" }}>{d.soal.pertanyaan.slice(0, 70)}{d.soal.pertanyaan.length > 70 ? "..." : ""}</div>
                  </div>
                  <div style={{ fontSize: 18 }}>{d.benar ? "✅" : d.skorDapat > 0 ? "⚡" : "❌"}</div>
                </div>
              );
            })}
          </div>

          <button onClick={() => router.back()} style={{ width: "100%", background: "#1B3A6B", color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 12 }}>← Kembali ke Paket Soal</button>
          <button onClick={() => { setSelesai(false); setHasil(null); setJawaban({}); setRagu({}); setCurrentIndex(0); loadSoal(); }} style={{ width: "100%", background: "white", color: "#1B3A6B", border: "2px solid #1B3A6B", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 32 }}>🔁 Ulangi Latihan</button>
        </div>
      </div>
    );
  }

  if (!soal) return null;
  const cfg = tipeConfig[soal.tipe];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F0F2F7", minHeight: "100vh" }}>

      {/* TOP BAR */}
      <div style={{ background: "#1B3A6B", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: "2px solid #D4A017" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#D4A017", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#1B3A6B" }}>K</div>
          <div>
            <div style={{ color: "white", fontWeight: 900, fontSize: 15 }}>Kisio<span style={{ color: "#D4A017" }}>ID</span></div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 600 }}>{paket?.judul}</div>
          </div>
        </div>

        {/* TIMER */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[["JAM", timer.jam], ["MENIT", timer.menit], ["DETIK", timer.detik]].map(([label, val]) => (
            <div key={label} style={{ background: urgent ? "#E74C3C" : "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 48 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: urgent ? "white" : "#D4A017", lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 9, color: urgent ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)", fontWeight: 700 }}>{label}</div>
            </div>
          ))}
        </div>

        <button onClick={handleSelesai} style={{ background: "#D4A017", border: "none", borderRadius: 8, padding: "8px 16px", color: "#1B3A6B", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Selesai ✓
        </button>
      </div>

      {/* PROGRESS */}
      <div style={{ height: 4, background: "#E2E8F0" }}>
        <div style={{ height: "100%", background: "#D4A017", width: `${((currentIndex + 1) / soalList.length) * 100}%`, transition: "width 0.3s" }} />
      </div>

      {/* MAIN LAYOUT 2 KOLOM */}
      <div style={{ display: "flex", maxWidth: 1400, margin: "0 auto", padding: "20px 16px", gap: 20, alignItems: "flex-start" }}>

        {/* KOLOM KIRI - KONTEN SOAL */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* BANNER TIPE SOAL */}
          <div style={{ background: cfg.bg, border: `2px solid ${cfg.color}`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ background: cfg.color, color: "white", fontSize: 13, fontWeight: 900, padding: "6px 16px", borderRadius: 50 }}>
                {cfg.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.desc}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ background: "#1B3A6B", color: "white", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 50 }}>
                Skor: {soal.skor}
              </div>
              <button
                onClick={() => toggleRagu(soal.id)}
                style={{ background: ragu[soal.id] ? "#F39C12" : "white", color: ragu[soal.id] ? "white" : "#9AA5B4", border: `1px solid ${ragu[soal.id] ? "#F39C12" : "#E2E8F0"}`, borderRadius: 50, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {ragu[soal.id] ? "⚑ Ragu-ragu" : "⚐ Tandai"}
              </button>
            </div>
          </div>

          {/* BACAAN/KONTEKS */}
          {konteksAktif && (
            <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: "20px 22px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1B3A6B", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
                📖 Bacaan
              </div>
              <div style={{ fontSize: 15, color: "#1a1a2e", lineHeight: 1.9, whiteSpace: "pre-line" }}>{konteksAktif}</div>
            </div>
          )}

          {/* PERTANYAAN */}
          <div style={{ background: "white", borderLeft: `5px solid ${cfg.color}`, borderRadius: 14, padding: "20px 22px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: cfg.color, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Soal {soal.nomor}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3A", lineHeight: 1.8 }}>{soal.pertanyaan}</div>
          </div>

          {/* PG */}
          {soal.tipe === "PG" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {soal.pilihan?.map(p => (
                <button key={p.huruf} onClick={() => handleJawabPG(soal.id, p.huruf)}
                  style={{ display: "flex", alignItems: "center", gap: 14, background: jawaban[soal.id] === p.huruf ? cfg.color : "white", color: jawaban[soal.id] === p.huruf ? "white" : "#1B3A6B", border: `2px solid ${jawaban[soal.id] === p.huruf ? cfg.color : "#E2E8F0"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: "left", fontSize: 15, fontWeight: 600, transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: jawaban[soal.id] === p.huruf ? "rgba(255,255,255,0.25)" : "#F0F2F7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{p.huruf}</div>
                  {p.teks}
                </button>
              ))}
            </div>
          )}

          {/* PGK */}
          {soal.tipe === "PGK" && (
            <div>
              <div style={{ background: "#FFF4EC", border: "1px solid #E67E22", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, fontWeight: 700, color: "#E67E22" }}>
                ✓ Dipilih: {(jawaban[soal.id] || []).length}/2 — Maksimal 2 pilihan
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {soal.pilihan?.map(p => {
                  const dipilih = (jawaban[soal.id] || []).includes(p.huruf);
                  const maxed = (jawaban[soal.id] || []).length >= 2 && !dipilih;
                  return (
                    <button key={p.huruf} onClick={() => handleJawabPGK(soal.id, p.huruf)} disabled={maxed}
                      style={{ display: "flex", alignItems: "center", gap: 14, background: dipilih ? "#E67E22" : maxed ? "#F8F9FA" : "white", color: dipilih ? "white" : maxed ? "#C0C0C0" : "#1B3A6B", border: `2px solid ${dipilih ? "#E67E22" : "#E2E8F0"}`, borderRadius: 12, padding: "14px 18px", cursor: maxed ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: "left", fontSize: 15, fontWeight: 600, transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: dipilih ? "rgba(255,255,255,0.25)" : "#F0F2F7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{dipilih ? "✓" : p.huruf}</div>
                      {p.teks}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MJ */}
          {soal.tipe === "MJ" && (
            <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8E44AD", marginBottom: 20 }}>Pasangkan setiap item di kiri dengan jawaban yang tepat di kanan:</div>
              {soal.pasangan?.map(p => (
                <div key={p.nomor_item} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0F1E3A", marginBottom: 10, padding: "12px 16px", background: "#F5EEF8", borderRadius: 10, borderLeft: "4px solid #8E44AD" }}>
                    {p.nomor_item}. {p.teks_kiri}
                  </div>
                  <div className="grid-2">
                    {soal.pilihanKanan?.map(pk => {
                      const dipilih = jawaban[soal.id]?.[p.nomor_item] === pk.huruf;
                      return (
                        <button key={pk.huruf} onClick={() => handleJawabMJ(soal.id, p.nomor_item, pk.huruf)}
                          style={{ background: dipilih ? "#8E44AD" : "white", color: dipilih ? "white" : "#1B3A6B", border: `2px solid ${dipilih ? "#8E44AD" : "#E2E8F0"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, textAlign: "left", transition: "all 0.2s" }}>
                          <span style={{ fontWeight: 900, marginRight: 6 }}>{pk.huruf}.</span>{pk.teks}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* IS */}
          {soal.tipe === "IS" && (
            <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#27AE60", marginBottom: 12 }}>✏️ Tuliskan jawaban kamu:</div>
              <input type="text" value={jawaban[soal.id] || ""} onChange={(e) => handleJawabIS(soal.id, e.target.value)}
                placeholder="Ketik jawaban di sini..."
                style={{ width: "100%", padding: "16px 18px", borderRadius: 10, border: "2px solid #E2E8F0", fontSize: 16, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1B3A6B", outline: "none", boxSizing: "border-box" }} />
              <div style={{ fontSize: 12, color: "#9AA5B4", marginTop: 8 }}>* Tidak case-sensitive (huruf besar/kecil tidak berpengaruh)</div>
            </div>
          )}

          {/* NAVIGASI BAWAH */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, marginBottom: 32 }}>
            <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}
              style={{ flex: 1, background: currentIndex === 0 ? "#F0F2F7" : "white", color: currentIndex === 0 ? "#C0C0C0" : "#1B3A6B", border: `2px solid ${currentIndex === 0 ? "#E2E8F0" : "#1B3A6B"}`, borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 800, cursor: currentIndex === 0 ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ← Sebelumnya
            </button>
            {currentIndex < soalList.length - 1 ? (
              <button onClick={() => setCurrentIndex(i => i + 1)}
                style={{ flex: 2, background: "#1B3A6B", color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Berikutnya →
              </button>
            ) : (
              <button onClick={handleSelesai}
                style={{ flex: 2, background: "#27AE60", color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ✅ Selesai & Lihat Hasil
              </button>
            )}
          </div>
        </div>

        {/* KOLOM KANAN - NAVIGASI SOAL */}
<div style={{ display: isMobile ? "none" : "block", width: 280, flexShrink: 0, position: "sticky", top: 80 }}>

          {/* INFO SOAL */}
          <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1B3A6B", marginBottom: 12 }}>📊 Progress</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#9AA5B4", fontWeight: 600 }}>Dijawab</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#27AE60" }}>{soalList.filter(s => sudahDijawab(s)).length}/{soalList.length}</span>
            </div>
            <div style={{ height: 6, background: "#E2E8F0", borderRadius: 3, marginBottom: 12 }}>
              <div style={{ height: "100%", background: "#27AE60", borderRadius: 3, width: `${(soalList.filter(s => sudahDijawab(s)).length / soalList.length) * 100}%`, transition: "width 0.3s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#9AA5B4", fontWeight: 600 }}>Belum dijawab</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#E74C3C" }}>{soalList.filter(s => !sudahDijawab(s)).length}</span>
            </div>
          </div>

          {/* GRID NOMOR SOAL */}
          <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1B3A6B", marginBottom: 12 }}>Daftar Soal</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {soalList.map((s, i) => {
                const dijawab = sudahDijawab(s);
                const isRagu = ragu[s.id];
                const isCurrent = currentIndex === i;
                return (
                  <button key={s.id} onClick={() => setCurrentIndex(i)}
                    style={{
                      width: 38, height: 38, borderRadius: 8,
                      background: isCurrent ? "#1B3A6B" : isRagu ? "#F39C12" : dijawab ? "#27AE60" : "white",
                      color: isCurrent || isRagu || dijawab ? "white" : "#4A5568",
                      border: `1px solid ${isCurrent ? "#1B3A6B" : isRagu ? "#F39C12" : dijawab ? "#27AE60" : "#E2E8F0"}`,
                      fontWeight: 800, fontSize: 12, cursor: "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: "all 0.15s",
                    }}>
                    {s.nomor}
                  </button>
                );
              })}
            </div>

            {/* LEGENDA */}
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["#1B3A6B", "Soal aktif"],
                ["#27AE60", "Sudah dijawab"],
                ["#F39C12", "Ragu-ragu"],
                ["white", "Belum dijawab"],
              ].map(([color, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: color, border: color === "white" ? "1px solid #E2E8F0" : "none", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#9AA5B4", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOMBOL SELESAI */}
          <button onClick={handleSelesai}
            style={{ width: "100%", background: "#27AE60", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ✅ Selesai & Lihat Hasil
          </button>
        </div>

      </div>
    </div>
  );
}
export default function Kuis() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KuisContent />
    </Suspense>
  );
}