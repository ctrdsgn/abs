import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export async function requireAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return session;
}
