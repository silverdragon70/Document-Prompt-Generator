import { useLocation } from "wouter";
import { Eye } from "lucide-react";

export function FloatingPreviewButton() {
  const [, setLocation] = useLocation();

  return (
    <button
      onClick={() => setLocation("/preview")}
      data-testid="button-floating-preview"
      title="View Full Document Preview"
      className="fixed z-50 right-6 flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-extrabold transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        bottom: "96px",
        background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #7c3aed 50%, #a855f7 100%)",
        boxShadow: "0 6px 20px rgba(94, 57, 224, 0.4), 0 2px 6px rgba(0,0,0,0.12)",
        border: "2px solid rgba(255,255,255,0.2)",
        cursor: "pointer",
      }}
    >
      <Eye size={16} />
      Preview
    </button>
  );
}
