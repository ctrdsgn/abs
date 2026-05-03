import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-guard";
import { UsersCrud } from "@/components/admin/UsersCrud";

export default async function AdminPenggunaPage() {
  const session = await requireAdminPage();
  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }
  return <UsersCrud />;
}
