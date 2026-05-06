import { useLocation } from "wouter";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { useFormatting } from "@/context/FormattingContext";
import { LivePreview } from "@/components/LivePreview";

export function PreviewPage() {
  const [, setLocation] = useLocation();
  const { state } = useFormatting();
  const enabledCount = Object.values(state.elements).filter((el) => el.enabled).length;

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col bg-background overflow-hidden" style={{ height: "100dvh" }}>

      {/* ── Top bar (hidden on print) ── */}
      <header
        className="print:hidden flex-shrink-0 flex items-center h-12 px-3 gap-2 border-b border-border bg-card z-10"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      >
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group flex-shrink-0"
          data-testid="button-back-to-editor"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Back to Editor</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="h-5 w-px bg-border mx-1 flex-shrink-0" />

        <span className="text-sm font-semibold text-foreground truncate">
          Document Preview
        </span>

        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText size={12} />
            <span>{enabledCount} active</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground hidden sm:inline">Live</span>
          </div>

          {/* Print / Export PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
              boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
            }}
            data-testid="button-print"
          >
            <Printer size={13} />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* ── Preview area ── */}
      <div className="flex-1 overflow-hidden">
        <LivePreview state={state} />
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
