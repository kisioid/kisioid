export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#1B3A6B",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      color: "white",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#D4A017",
        width: 60,
        height: 60,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 900,
        color: "#1B3A6B",
        marginBottom: 20
      }}>
        K
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
        Kisio<span style={{ color: "#D4A017" }}>ID</span>
      </h1>

      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 40 }}>
        Platform Latihan Soal #1 Indonesia
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {["SD", "SMP", "SMA", "CPNS"].map(j => (
          <div key={j} style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            padding: "12px 24px",
            fontSize: 18,
            fontWeight: 800
          }}>
            {j}
          </div>
        ))}
      </div>

      <p style={{ marginTop: 40, color: "#D4A017", fontWeight: 700 }}>
        🚀 Segera Hadir
      </p>
    </main>
  );
}