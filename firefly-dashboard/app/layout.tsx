// firefly-dashboard/app/layout.tsx
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import QueryProvider from "@/providers/react-query";

export const metadata = { title: "Firefly" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-dvh">
        <QueryProvider>
          {/* wenn vorhanden: Toaster / ThemeProvider etc */}
          {/* <ToastProvider /> */}
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
