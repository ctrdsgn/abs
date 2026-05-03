import { requireAdminPage } from "@/lib/admin-guard";
import { ProductsCrud } from "@/components/admin/ProductsCrud";

export default async function AdminProdukPage() {
  await requireAdminPage();
  return <ProductsCrud />;
}
