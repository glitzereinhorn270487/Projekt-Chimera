"use client";
export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="p-6">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-2">Globaler Fehler</h2>
          <p className="opacity-80 text-sm break-all">{error.message}</p>
        </div>
      </body>
    </html>
  );
}
