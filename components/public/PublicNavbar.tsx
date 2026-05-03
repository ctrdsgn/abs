"use client";

import Link from "next/link";
import { Menu, TreePine, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog" },
  { href: "/portofolio", label: "Portofolio" },
  { href: "/tentang", label: "Tentang Kami" },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "border-b border-white/10 bg-white/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-600">
            <TreePine className="h-5 w-5" /> Azzam Barokah Steel
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#0A1628] transition-all duration-200 hover:text-[#1B4332]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href="https://wa.me/6285276739937"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-orange-700 md:block"
          >
            Hubungi Kami
          </a>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-600 text-orange-600 transition-all duration-200 md:hidden"
            aria-label="Buka menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-[#0A1628]/70 backdrop-blur-sm md:hidden">
          <div className="pt-24">
            <div className="mx-4 rounded-2xl bg-[#FAF7F2] p-6 shadow-xl">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-semibold text-[#0A1628] transition-all duration-200 hover:text-[#1B4332]"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href="https://wa.me/6285276739937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 rounded-full bg-orange-600 px-8 py-4 text-center font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-orange-700"
                >
                  Hubungi Kami
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
