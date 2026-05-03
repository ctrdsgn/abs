import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/6282385597262"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-[#25D366] p-4 text-white shadow-2xl transition-all duration-200 hover:scale-[1.06]"
      aria-label="Chat WhatsApp"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/30 animate-ping" />
      <MessageCircle size={28} />
    </a>
  );
}
