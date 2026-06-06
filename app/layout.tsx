import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Update Dashboard",
  description: "ระบบจัดการและอัพเดทสินค้าคงคลัง bebeplay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
