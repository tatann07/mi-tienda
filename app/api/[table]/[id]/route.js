import pool from "@/lib/db";
import { getMeta, q, errorMessage } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { table, id } = await params;
    const meta = await getMeta(table);
    if (!meta) return NextResponse.json({ error: "La tabla no existe" }, { status: 404 });
    if (!meta.pk) return NextResponse.json({ error: "La tabla no tiene llave primaria" }, { status: 400 });
    const body = await req.json();
    const cols = meta.columns.filter((c) => !c.pk && !c.generated && body[c.name] !== undefined);
    if (cols.length === 0) return NextResponse.json({ ok: true });
    const values = cols.map((c) => {
      const v = body[c.name];
      if (v === "" || v === null) return c.type === "text" && !c.nullable ? "" : null;
      return v;
    });
    await pool.query(
      `UPDATE ${q(table)} SET ${cols.map((c) => `${q(c.name)}=?`).join(",")} WHERE ${q(meta.pk)}=?`,
      [...values, id]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: errorMessage(e) }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { table, id } = await params;
    const meta = await getMeta(table);
    if (!meta) return NextResponse.json({ error: "La tabla no existe" }, { status: 404 });
    if (!meta.pk) return NextResponse.json({ error: "La tabla no tiene llave primaria" }, { status: 400 });
    await pool.query(`DELETE FROM ${q(table)} WHERE ${q(meta.pk)}=?`, [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: errorMessage(e) }, { status: 400 });
  }
}
