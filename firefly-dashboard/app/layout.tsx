import ToastProvider from "@/components/ToastProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[hsl(var(--c-ink))] text-white">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
