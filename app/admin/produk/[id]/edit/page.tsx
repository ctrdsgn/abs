import { requireAdminPage } from "@/lib/admin-guard";

export default async function EditProdukPage() {
  await requireAdminPage();
  return <h1 className="text-2xl font-bold text-brand-dark">Edit Produk</h1>;
}
