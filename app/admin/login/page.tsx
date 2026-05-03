"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Email atau password salah");
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-brand-dark">Azzam Barokah Steel Admin</h1>
        <div className="mt-6 space-y-4">
          <input name="email" type="email" required className="w-full rounded-xl border px-4 py-3" placeholder="Email" />
          <input name="password" type="password" required className="w-full rounded-xl border px-4 py-3" placeholder="Password" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-full bg-brand-primary px-6 py-3 font-semibold text-white">
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </div>
      </form>
    </main>
  );
}
