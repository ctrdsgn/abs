import { requireAdminPage } from "@/lib/admin-guard";
import { OrdersCrud } from "@/components/admin/OrdersCrud";

export default async function AdminOrderPage() {
  await requireAdminPage();
  return <OrdersCrud />;
}
