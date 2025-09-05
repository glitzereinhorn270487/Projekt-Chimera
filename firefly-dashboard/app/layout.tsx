// firefly-dashboard/app/layout.tsx
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

export const metadata = { title: "Firefly" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {/* Optional: very subtle noise layer */}
        {/* <div className="pointer-events-none fixed inset-0 opacity-[0.03]" style={{backgroundImage:"url('/noise.png')"}} /> */}

        <main className="relative mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-6">
          {children}
        </main>

        <ToastProvider />
      </body>
    </html>
  );
}
