import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query";
import  ToastProvider  from "@/components/ToastProvider"; // falls vorhanden

export const metadata: Metadata = { title: "Firefly", description: "Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ReactQueryProvider>
          {/* Toaster optional */}
          <ToastProvider />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
