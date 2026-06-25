import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export default function FloatingQuoteButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/quote") || pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/_authenticated")) {
    return null;
  }
  return (
    <Link
      to="/quote"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#203f24] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#203f24]/30 transition hover:bg-[#17331d] hover:shadow-xl"
    >
      <Sparkles className="h-4 w-4" />
      Get a free quote
    </Link>
  );
}