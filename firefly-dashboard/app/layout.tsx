import "./../src/styles/globals.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export const metadata = {
  title: "Firefly Dashboard",
  description: "Mission Control",
};

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <body className="bg-[hsl(var(--c-ink))] text-white/90 min-h-screen">
        <QueryClientProvider client={queryClient}>
          <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            {children}
          </div>
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </body>
    </html>
  );
}
