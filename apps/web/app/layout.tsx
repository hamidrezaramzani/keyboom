import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import StoreProvider from "./lib/store/store/store.provider";
import { AuthInitializer } from "./components";
import { ConfirmProvider } from "./lib/store/context";
import SWRegister from "./sw-register";

export const metadata: Metadata = {
  metadataBase: new URL("https://keyboom.ir"),
  title: "کی‌بوم | مدیریت هوشمند اشتراک‌ها و هزینه‌ها",
  description:
    "کی‌بوم ابزار مدیریت هوشمند اشتراک‌هاست؛ هزینه‌ها، تاریخ تمدید، یادآوری‌ها و گزارش‌های مالی سرویس‌های اشتراکی خود را در یک داشبورد ساده کنترل کنید.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "کی‌بوم | مدیریت هوشمند اشتراک‌ها و هزینه‌ها",
    description:
      "با کی‌بوم اشتراک‌ها، هزینه‌ها و تاریخ تمدید سرویس‌های خود را یکجا مدیریت کنید و قبل از تمدیدهای مهم یادآوری بگیرید.",
    url: "https://keyboom.ir/",
    siteName: "کی‌بوم",
    locale: "fa_IR",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Keyboom",
  },
  icons: {
    icon: "web-app-manifest-192x192.png",
    apple: "web-app-manifest-512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="apple-mobile-web-app-title" content="Keyboom" />
      </head>
      <body className="min-h-full flex flex-col">
        <Toaster
          position="bottom-right"
          closeButton
          richColors={false}
          expand={false}
          duration={4000}
        />
        <StoreProvider>
          <ConfirmProvider>
            <AuthInitializer />
            <SWRegister />
            {children}
          </ConfirmProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
