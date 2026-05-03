import "./globals.css";

export const metadata = {
  title: "KisioID — Platform Latihan Soal #1 Indonesia",
  description: "Latihan soal dari kisi-kisi MGMP resmi seluruh Indonesia. SD, SMP, SMA, CPNS.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}