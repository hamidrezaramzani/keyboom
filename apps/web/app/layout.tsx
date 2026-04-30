import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keyboom",
  description: "Keyboom is a subscription tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
