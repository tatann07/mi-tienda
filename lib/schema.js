import pool from "./db";

// Lee las tablas y columnas directamente de tu base de datos.
// No necesitas configurar nada: el menú y los formularios se generan solos.

export const q = (name) => "`" + String(name).replace(/`/g, "``") + "`";

export async function getTables() {
  const [rows] = await pool.query("SHOW TABLES");
  return rows.map((r) => Object.values(r)[0]);
}

function inputType(sqlType) {
  const t = sqlType.toLowerCase();
  if (/(int|decimal|numeric|float|double|real)/.test(t) && !t.startsWith("tinyint(1)")) return "number";
  return "text";
}

export async function getMeta(table) {
  const tables = await getTables();
  if (!tables.includes(table)) return null;
  const [cols] = await pool.query(`SHOW COLUMNS FROM ${q(table)}`);
  const columns = cols.map((c) => ({
    name: c.Field,
    sqlType: c.Type,
    type: inputType(c.Type),
    nullable: c.Null === "YES",
    pk: c.Key === "PRI",
    auto: /auto_increment/i.test(c.Extra || ""),
    generated: /generated/i.test(c.Extra || ""),
  }));
  const pk = columns.find((c) => c.pk)?.name ?? null;
  return { columns, pk };
}

export function errorMessage(e) {
  return e?.sqlMessage || e?.message || "Error desconocido";
}
