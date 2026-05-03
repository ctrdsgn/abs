export default function TentangPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-16">
      <h1 className="text-3xl font-bold text-brand-dark">Tentang Azzam Barokah Steel</h1>
      <p className="mt-4 max-w-3xl">
        Azzam Barokah Steel adalah workshop stainless steel di Duri - Bengkalis, Riau yang fokus pada kualitas pengerjaan, ketepatan waktu, dan kepuasan pelanggan. Kami melayani pesanan custom stainless steel untuk berbagai kebutuhan: pagar, pintu, tempat tidur, tangga, canopy, balkon, alat medis, baja ringan/trush, dan kubah mesjid.
      </p>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Kualitas Terjamin</h2>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Tepat Waktu</h2>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Kepuasan Pelanggan</h2>
        </article>
      </section>
    </main>
  );
}
