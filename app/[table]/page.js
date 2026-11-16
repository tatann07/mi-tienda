import CrudTable from "@/components/CrudTable";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { table } = await params;
  const title = table.charAt(0).toUpperCase() + table.slice(1).replace(/_/g, " ");
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <CrudTable table={table} />
    </>
  );
}
