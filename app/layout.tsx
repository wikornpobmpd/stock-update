import type { Metadata } from "next";
import { Fredoka, Sarabun } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hosttail Stock Dashboard",
  description: "ระบบจัดการสินค้าคงคลัง Hosttail by bebeplay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${fredoka.variable} ${sarabun.variable}`}>
      <body className="min-h-screen" style={{ background: "var(--brand-warm)", fontFamily: "var(--font-sarabun)" }}>
        {children}
      </body>
    </html>
  );
}
