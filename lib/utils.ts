export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatRupiah(min)} – ${formatRupiah(max)}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export function buildWAUrl(message: string): string {
  return `https://wa.me/6285276739937?text=${encodeURIComponent(message)}`;
}

export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "..." : text;
}
