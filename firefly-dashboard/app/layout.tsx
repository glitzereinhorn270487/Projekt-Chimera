import "./../styles/globals.css";

export const metadata = {
  title: "Firefly Dashboard",
  description: "Positions Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
