import pool from "@/lib/db";
import { getMeta, q, errorMessage } from "@/lib/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    const { table } = await params;
    const meta = await getMeta(table);
    if (!meta) return NextResponse.json({ error: "La tabla no existe" }, { status: 404 });
    const order = meta.pk ? ` ORDER BY ${q(meta.pk)} DESC` : "";
    const [rows] = await pool.query(`SELECT * FROM ${q(table)}${order} LIMIT 500`);
    return NextResponse.json({ ...meta, rows });
  } catch (e) {
    return NextResponse.json({ error: errorMessage(e) }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { table } = await params;
    const meta = await getMeta(table);
    if (!meta) return NextResponse.json({ error: "La tabla no existe" }, { status: 404 });
    const body = await req.json();
    // Solo columnas con valor; las vacías usan el valor por defecto de la base
    const cols = meta.columns.filter(
      (c) => !c.auto && !c.generated && body[c.name] !== undefined && body[c.name] !== ""
    );
    if (cols.length === 0) {
      await pool.query(`INSERT INTO ${q(table)} () VALUES ()`);
    } else {
      await pool.query(
        `INSERT INTO ${q(table)} (${cols.map((c) => q(c.name)).join(",")}) VALUES (${cols.map(() => "?").join(",")})`,
        cols.map((c) => body[c.name])
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: errorMessage(e) }, { status: 400 });
  }
}
