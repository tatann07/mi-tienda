import Link from "next/link";
import { getTables } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function Home() {
  let tables = [];
  try { tables = await getTables(); } catch {}
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Panel de administración</h1>
      <p className="mb-6 text-stone-600">Elige una tabla para ver, agregar, modificar o borrar registros.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((t) => (
          <Link key={t} href={`/${t}`} className="rounded-lg border border-stone-200 bg-white p-4 font-medium hover:border-teal-600">
            {t}
          </Link>
        ))}
      </div>
    </div>
  );
}
