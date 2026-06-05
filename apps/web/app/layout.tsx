import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import StoreProvider from "./lib/store/store/store.provider";
import { AuthInitializer } from "./components";
import { ConfirmProvider } from "./lib/store/context";

export const metadata: Metadata = {
  title: "Keyboom",
  description: "Keyboom is a subscription tracker and calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
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
            {children}
          </ConfirmProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
