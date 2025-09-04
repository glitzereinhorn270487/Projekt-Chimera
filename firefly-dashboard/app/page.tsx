import PositionsDashboard from "../components/PositionsDashboard";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">🔥 Firefly Dashboard</h1>
        <p className="opacity-70">Alle offenen & geschlossenen Positionen</p>
      </header>

      <PositionsDashboard />
    </main>
  );
}
