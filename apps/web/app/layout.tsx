import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import StoreProvider from "./lib/store/store/store.provider";
import { AuthInitializer } from "./components";

export const metadata: Metadata = {
  title: "Keyboom",
  description: "Keyboom is a subscription tracker",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-full flex flex-col">
        <Toaster
          position="bottom-right"
          closeButton
          richColors={false}
          expand={false}
          duration={4000}
        />
        <StoreProvider>
          <AuthInitializer />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
