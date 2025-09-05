import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "../src/components/ToastProvider";

export const metadata: Metadata = {
  title: "Firefly Dashboard",
  description: "Control center",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
