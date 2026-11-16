import "./globals.css";
import Link from "next/link";
import { getTables, errorMessage } from "@/lib/schema";

export const metadata = { title: "Mi Tienda" };
export const dynamic = "force-dynamic";

export const label = (t) => t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " ");

export default async function RootLayout({ children }) {
  let tables = [];
  let error = null;
  try {
    tables = await getTables();
  } catch (e) {
    error = errorMessage(e);
  }

  return (
    <html lang="es">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <header className="border-b border-stone-200 bg-white">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <Link href="/" className="mr-4 flex items-center gap-2 text-lg font-semibold">
              <img src="/logo.svg" alt="Logo de Mi Tienda" className="h-9 w-9" />
              Mi Tienda
            </Link>
            {tables.map((t) => (
              <Link key={t} href={`/${t}`} className="rounded px-2 py-1 text-stone-700 hover:bg-teal-50 hover:text-teal-800">
                {label(t)}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">
          {error && (
            <div className="mb-4 rounded border border-red-300 bg-red-50 p-4 text-red-800">
              <p className="font-semibold">No se pudo conectar a la base de datos</p>
              <p className="text-sm">{error}</p>
              <p className="mt-1 text-sm">Revisa los datos de tu archivo .env.local y reinicia con npm run dev.</p>
            </div>
          )}
          {children}
        </main>
      </body>
    </html>
  );
}
