"use client";
import { useCallback, useEffect, useState } from "react";

export default function CrudTable({ table }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/${table}`);
    const json = await res.json();
    if (!res.ok) { setError(json.error); return; }
    setError(null);
    setData(json);
  }, [table]);

  useEffect(() => { setData(null); setForm({}); setEditId(null); load(); }, [load]);

  if (error) return <p className="rounded border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>;
  if (!data) return <p className="text-stone-500">Cargando…</p>;

  const { columns, pk, rows } = data;
  const fields = columns.filter((c) => !c.auto && !c.generated);

  const reset = () => { setForm({}); setEditId(null); };

  const save = async (e) => {
    e.preventDefault();
    const url = editId !== null ? `/api/${table}/${encodeURIComponent(editId)}` : `/api/${table}`;
    const res = await fetch(url, {
      method: editId !== null ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    reset();
    load();
  };

  const edit = (row) => {
    setEditId(row[pk]);
    setForm(Object.fromEntries(fields.map((f) => [f.name, row[f.name] ?? ""])));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (row) => {
    if (!confirm("¿Borrar este registro?")) return;
    const res = await fetch(`/api/${table}/${encodeURIComponent(row[pk])}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    load();
  };

  return (
    <div>
      <form onSubmit={save} className="mb-6 rounded-lg border border-stone-200 bg-white p-4">
        <p className="mb-3 font-medium">{editId !== null ? `Modificando registro ${editId}` : "Agregar registro"}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <label key={f.name} className="text-sm">
              <span className="mb-1 block text-stone-600">{f.name}</span>
              <input
                type={f.type}
                step="any"
                value={form[f.name] ?? ""}
                disabled={editId !== null && f.pk}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full rounded border border-stone-300 p-2 disabled:bg-stone-100"
              />
            </label>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded bg-teal-700 px-4 py-2 text-white hover:bg-teal-800">
            {editId !== null ? "Guardar cambios" : "Agregar"}
          </button>
          {editId !== null && (
            <button type="button" onClick={reset} className="rounded border border-stone-300 px-4 py-2">Cancelar</button>
          )}
        </div>
      </form>

      {!pk && <p className="mb-3 text-sm text-amber-700">Esta tabla no tiene llave primaria, así que no se puede modificar ni borrar.</p>}

      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100">
            <tr>
              {columns.map((c) => <th key={c.name} className="p-2 font-semibold">{c.name}</th>)}
              <th className="p-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="p-4 text-stone-500">No hay registros todavía.</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={pk ? r[pk] : i} className="border-t border-stone-200">
                {columns.map((c) => (
                  <td key={c.name} className="max-w-xs truncate p-2">{r[c.name] === null ? "" : String(r[c.name])}</td>
                ))}
                <td className="whitespace-nowrap p-2">
                  {pk && (
                    <div className="flex gap-2">
                      <button onClick={() => edit(r)} className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600">Modificar</button>
                      <button onClick={() => remove(r)} className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">Borrar</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
