import { useLocation } from "wouter";
import { Eye } from "lucide-react";

export function FloatingPreviewButton() {
  const [, setLocation] = useLocation();

  return (
    <button
      onClick={() => setLocation("/preview")}
      data-testid="button-floating-preview"
      title="View Full Document Preview"
      className="fixed z-50 right-4 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        bottom: "88px",
        background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
        boxShadow: "0 4px 16px rgba(99,102,241,0.4), 0 2px 6px rgba(0,0,0,0.12)",
        border: "2px solid rgba(255,255,255,0.2)",
        cursor: "pointer",
      }}
    >
      <Eye size={13} />
      Preview
    </button>
  );
}
