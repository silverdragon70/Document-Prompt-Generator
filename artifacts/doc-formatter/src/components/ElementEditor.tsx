import { useState, useRef, useEffect } from "react";
import { ChevronRight, Wand2, GitCompare, ArrowLeft } from "lucide-react";
import { FormattingElement, ElementStyle, FONT_OPTIONS, FONT_WEIGHT_OPTIONS, FONT_SIZE_OPTIONS, CONDITIONAL_ELEMENT_IDS } from "@/types/formatting";
import { ElementMiniPreview } from "@/components/ElementMiniPreview";

const SPACING_OPTIONS = ["0px","2px","4px","6px","8px","10px","12px","14px","16px","18px","20px","24px","28px","32px","40px","48px"];
const ALIGN_OPTIONS = ["left","center","right","justify"];
const LINE_HEIGHT_OPTIONS = ["1.0","1.2","1.3","1.4","1.5","1.6","1.7","1.8","2.0","2.2","2.5"];
const LETTER_SPACING_OPTIONS = ["-0.05em","-0.02em","0em","0.02em","0.04em","0.06em","0.08em","0.1em","0.12em","0.15em"];
const BORDER_WIDTH_OPTIONS = ["0px","1px","2px","3px","4px"];
const BORDER_RADIUS_OPTIONS = ["0px","2px","4px","6px","8px","12px","16px","24px"];

function PillToggle({ on, onToggle, testId }: { on: boolean; onToggle: () => void; testId?: string }) {
  return (
    <button
      onClick={onToggle}
      data-testid={testId}
      aria-pressed={on}
      title={on ? "Disable" : "Enable"}
      className="relative flex-shrink-0 focus:outline-none rounded-full"
      style={{
        width: "50px", height: "28px",
        background: on ? "hsl(var(--primary))" : "hsl(var(--muted))",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", border: "none", cursor: "pointer",
        boxShadow: on
          ? "inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 2px hsl(var(--primary) / 0.2)"
          : "inset 0 2px 4px rgba(0,0,0,0.05), 0 0 0 2px hsl(var(--border) / 0.5)",
        padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: "2px", left: on ? "24px" : "2px",
        width: "24px", height: "24px", borderRadius: "50%",
        background: "#ffffff", boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "10px", fontWeight: 800,
        color: on ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
      }}>
        {on ? "✓" : "✕"}
      </span>
    </button>
  );
}

function ColorInput({ label, value, onChange, dataTestid }: {
  label: string; value: string; onChange: (v: string) => void; dataTestid?: string;
}) {
  const isHex = value.startsWith("#");
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-border/50 bg-background shadow-sm">
      <label className="text-xs font-bold text-foreground whitespace-nowrap">{label}</label>
      <div className="flex items-center gap-3 min-w-0">
        <label
          className="relative flex-shrink-0 w-8 h-8 rounded-xl cursor-pointer border-2 border-border/60 overflow-hidden shadow-sm hover:scale-105 transition-transform"
          style={{ background: isHex ? value : "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px" }}
          title="Pick color"
        >
          <input type="color" value={isHex ? value : "#334155"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute opacity-0 w-full h-full cursor-pointer"
            style={{ top: 0, left: 0 }} data-testid={dataTestid} />
        </label>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-[96px] text-xs px-3 py-2 rounded-xl border-2 border-border/50 bg-muted/50 text-foreground font-mono font-bold text-center focus:outline-none focus:border-primary transition-all"
          placeholder="#000000" data-testid={`${dataTestid}-text`} />
      </div>
    </div>
  );
}

function SelectInput({ label, value, options, onChange, dataTestid }: {
  label: string; value: string;
  options: { label: string; value: string }[] | string[];
  onChange: (v: string) => void; dataTestid?: string;
}) {
  const normalized = (options as (string | { label: string; value: string })[]).map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="text-sm px-3 py-2.5 rounded-xl border-2 border-border/50 bg-background text-foreground font-medium cursor-pointer shadow-sm focus:outline-none focus:border-primary transition-all hover:bg-muted/20"
        data-testid={dataTestid}>
        {normalized.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── COMPACT ELEMENT ROW ──
export function CompactElementRow({ 
  element, 
  isSelected, 
  onClick, 
  onToggleEnabled 
}: { 
  element: FormattingElement; 
  isSelected: boolean; 
  onClick: () => void; 
  onToggleEnabled: (id: string, enabled: boolean) => void 
}) {
  return (
    <div 
      className={`flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-colors border-2 ${
        isSelected 
          ? "bg-primary/5 border-primary/30" 
          : "bg-card border-transparent hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
        <PillToggle on={element.enabled} onToggle={() => onToggleEnabled(element.id, !element.enabled)} />
      </div>
      <span className={`flex-1 text-[14px] font-bold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
        {element.label}
      </span>
      <ChevronRight size={18} className={isSelected ? "text-primary" : "text-muted-foreground"} />
    </div>
  );
}

// ── EDIT PANEL CONTENT ──
export function ElementEditPanel({
  element,
  onClose,
  onStyleChange,
  onToggleAiDecide,
  onToggleIfApplicable
}: {
  element: FormattingElement;
  onClose: () => void;
  onStyleChange: (id: string, key: keyof ElementStyle, value: string) => void;
  onToggleAiDecide: (id: string, aiDecide: boolean) => void;
  onToggleIfApplicable: (id: string, ifApplicable: boolean) => void;
}) {
  const [compareMode, setCompareMode] = useState(false);
  const originalStyleRef = useRef<ElementStyle | null>(null);
  
  const { id, label, enabled, aiDecide, ifApplicable, style } = element;
  const isConditional = CONDITIONAL_ELEMENT_IDS.has(id);

  // Capture original style when panel mounts for this element
  useEffect(() => {
    originalStyleRef.current = { ...style };
    setCompareMode(false);
    return () => {
      originalStyleRef.current = null;
    };
  }, [id]);

  const hasChanges =
    originalStyleRef.current !== null &&
    JSON.stringify(originalStyleRef.current) !== JSON.stringify(style);

  const originalElement: FormattingElement | null = originalStyleRef.current
    ? { ...element, style: originalStyleRef.current }
    : null;

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50 shrink-0">
        <button onClick={onClose} className="p-1.5 rounded-xl border-2 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-[16px] flex-1 text-foreground truncate">{label}</span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 no-scrollbar flex flex-col gap-6">
        
        {/* Toggle Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => onToggleAiDecide(id, !aiDecide)}
            className="flex items-center justify-center gap-1.5 text-[12px] px-3 py-2.5 rounded-full font-bold transition-all shadow-sm flex-1"
            style={{
              background: aiDecide ? "hsl(var(--primary))" : "transparent",
              color: aiDecide ? "#fff" : "hsl(var(--primary))",
              border: "2px solid hsl(var(--primary) / 0.5)",
            }}
          >
            <Wand2 size={14} />
            {aiDecide ? "AI Decides" : "Style with AI"}
          </button>
          
          {isConditional && (
            <button
              onClick={() => onToggleIfApplicable(id, !ifApplicable)}
              className="flex items-center justify-center gap-1.5 text-[12px] px-3 py-2.5 rounded-full font-bold transition-all shadow-sm flex-1"
              style={{
                background: ifApplicable ? "hsl(var(--accent))" : "transparent",
                color: ifApplicable ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                border: ifApplicable ? "2px solid hsl(var(--accent))" : "2px solid hsl(var(--border) / 0.5)",
              }}
            >
              {ifApplicable ? "If Applicable" : "Always Apply"}
            </button>
          )}
        </div>

        {/* Content depending on AI decide */}
        {aiDecide ? (
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <Wand2 size={24} />
              </div>
              <p className="text-sm font-bold text-foreground">AI Styling Enabled</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The styling for this element will be automatically determined based on your document's content.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Preview & Compare */}
            <div className="shrink-0 space-y-3">
              {hasChanges && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {compareMode ? "Comparing changes" : "Changes detected"}
                  </span>
                  <button
                    onClick={() => setCompareMode((p) => !p)}
                    className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full font-bold transition-all"
                    style={{
                      background: compareMode ? "hsl(var(--primary))" : "hsl(var(--card))",
                      color: compareMode ? "#fff" : "hsl(var(--muted-foreground))",
                      border: compareMode ? "2px solid hsl(var(--primary))" : "2px solid hsl(var(--border) / 0.5)",
                    }}
                  >
                    <GitCompare size={10} />
                    {compareMode ? "Hide Compare" : "Compare"}
                  </button>
                </div>
              )}

              {compareMode && originalElement ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                      Before
                    </p>
                    <ElementMiniPreview element={originalElement} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      After
                    </p>
                    <ElementMiniPreview element={element} />
                  </div>
                </div>
              ) : (
                <ElementMiniPreview element={element} />
              )}
            </div>

            {/* Style Controls Grid */}
            <div className="flex flex-col gap-4">
              <div className="pb-1 border-b border-border/50">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">Typography</p>
              </div>

              <SelectInput label="Font Family" value={style.fontFamily} options={FONT_OPTIONS}
                onChange={(v) => onStyleChange(id, "fontFamily", v)} />
                
              <div className="grid grid-cols-2 gap-3">
                <SelectInput label="Font Size" value={style.fontSize} options={FONT_SIZE_OPTIONS}
                  onChange={(v) => onStyleChange(id, "fontSize", v)} />
                <SelectInput label="Font Weight" value={style.fontWeight} options={FONT_WEIGHT_OPTIONS}
                  onChange={(v) => onStyleChange(id, "fontWeight", v)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectInput label="Text Align" value={style.textAlign} options={ALIGN_OPTIONS}
                  onChange={(v) => onStyleChange(id, "textAlign", v)} />
                <SelectInput label="Line Height" value={style.lineHeight} options={LINE_HEIGHT_OPTIONS}
                  onChange={(v) => onStyleChange(id, "lineHeight", v)} />
              </div>

              <SelectInput label="Letter Spacing" value={style.letterSpacing} options={LETTER_SPACING_OPTIONS}
                onChange={(v) => onStyleChange(id, "letterSpacing", v)} />

              <div className="pb-1 pt-2 border-b border-border/50">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">Colors</p>
              </div>

              <ColorInput label="Text Color" value={style.color}
                onChange={(v) => onStyleChange(id, "color", v)} />
              <ColorInput label="Background" value={style.backgroundColor}
                onChange={(v) => onStyleChange(id, "backgroundColor", v)} />

              <div className="pb-1 pt-2 border-b border-border/50">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">Box Model</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectInput label="Margin Bottom" value={style.marginBottom} options={SPACING_OPTIONS}
                  onChange={(v) => onStyleChange(id, "marginBottom", v)} />
                <SelectInput label="Border Radius" value={style.borderRadius} options={BORDER_RADIUS_OPTIONS}
                  onChange={(v) => onStyleChange(id, "borderRadius", v)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectInput label="Padding Top" value={style.paddingTop} options={SPACING_OPTIONS}
                  onChange={(v) => onStyleChange(id, "paddingTop", v)} />
                <SelectInput label="Padding Bottom" value={style.paddingBottom} options={SPACING_OPTIONS}
                  onChange={(v) => onStyleChange(id, "paddingBottom", v)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectInput label="Padding Left" value={style.paddingLeft} options={SPACING_OPTIONS}
                  onChange={(v) => onStyleChange(id, "paddingLeft", v)} />
                <SelectInput label="Border Width" value={style.borderWidth} options={BORDER_WIDTH_OPTIONS}
                  onChange={(v) => onStyleChange(id, "borderWidth", v)} />
              </div>

              <ColorInput label="Border Color" value={style.borderColor}
                onChange={(v) => onStyleChange(id, "borderColor", v)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
