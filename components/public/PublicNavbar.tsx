"use client";
import Image from 'next/image';
import Link from 'next/link';

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog" },
  { href: "/portofolio", label: "Portofolio" },
  { href: "/tentang", label: "Tentang Kami" },
];

// Komponen Logo ABS Baru
const AbsLogo = () => (
  <svg 
    viewBox="0 0 160 160" 
    className="h-8 w-8" // Ukuran disesuaikan agar pas di navbar
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(10, 10)">
      <path 
        d="M 5,70 L 40,5 L 70,70 L 40,70 L 40,90 L 70,90 L 40,150 L 5,80 Z M 70,5 L 100,5 L 130,50 L 100,100 L 70,100 Z M 135,100 L 100,100 L 100,120 L 135,120 L 135,145 L 100,145 L 100,125 M 100,100 L 100,80 L 135,80 Z M 70,5 L 70,70"
        stroke="currentColor" // Mengikuti warna text-orange-600 dari parent
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

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
          {/* Implementasi Logo Disini */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#1B4332]">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={40} // Sesuaikan ukuran
              height={40} 
              priority // Opsional: agar loading lebih cepat untuk elemen LCP
            />
            <span>Azzam Barokah Steel</span>
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

      {/* Mobile Menu */}
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