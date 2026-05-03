import { requireAdminPage } from "@/lib/admin-guard";

export default async function EditPortofolioPage() {
  await requireAdminPage();
  return <h1 className="text-2xl font-bold text-brand-dark">Edit Portofolio</h1>;
}
