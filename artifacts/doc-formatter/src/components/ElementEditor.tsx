import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Wand2, GitCompare } from "lucide-react";
import { FormattingElement, ElementStyle, FONT_OPTIONS, FONT_WEIGHT_OPTIONS, FONT_SIZE_OPTIONS, CONDITIONAL_ELEMENT_IDS } from "@/types/formatting";
import { ElementMiniPreview } from "@/components/ElementMiniPreview";

interface ElementEditorProps {
  element: FormattingElement;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onToggleAiDecide: (id: string, aiDecide: boolean) => void;
  onToggleIfApplicable: (id: string, ifApplicable: boolean) => void;
  onStyleChange: (id: string, key: keyof ElementStyle, value: string) => void;
}

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
      className="relative flex-shrink-0 focus:outline-none"
      style={{
        width: "46px", height: "26px", borderRadius: "13px",
        background: on ? "#22c55e" : "#ef4444",
        transition: "background 0.2s", border: "none", cursor: "pointer",
        boxShadow: on
          ? "inset 0 1px 3px rgba(0,0,0,0.15), 0 0 0 2px rgba(34,197,94,0.25)"
          : "inset 0 1px 3px rgba(0,0,0,0.15), 0 0 0 2px rgba(239,68,68,0.20)",
        padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: "3px", left: on ? "23px" : "3px",
        width: "20px", height: "20px", borderRadius: "50%",
        background: "#ffffff", boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        transition: "left 0.2s", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "9px", fontWeight: 700,
        color: on ? "#16a34a" : "#dc2626",
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
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-border bg-background">
      <label className="text-xs font-semibold text-foreground whitespace-nowrap">{label}</label>
      <div className="flex items-center gap-2 min-w-0">
        <label
          className="relative flex-shrink-0 w-7 h-7 rounded-lg cursor-pointer border-2 border-border overflow-hidden"
          style={{ background: isHex ? value : "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px" }}
          title="Pick color"
        >
          <input type="color" value={isHex ? value : "#334155"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute opacity-0 w-full h-full cursor-pointer"
            style={{ top: 0, left: 0 }} data-testid={dataTestid} />
        </label>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-[96px] text-xs px-2 py-1.5 rounded-lg border border-border bg-muted text-foreground font-mono text-center"
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground tracking-wide">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="text-xs px-2.5 py-2 rounded-lg border border-border bg-background text-foreground cursor-pointer"
        data-testid={dataTestid}>
        {normalized.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function ElementEditor({ element, onToggleEnabled, onToggleAiDecide, onToggleIfApplicable, onStyleChange }: ElementEditorProps) {
  const [open, setOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const originalStyleRef = useRef<ElementStyle | null>(null);
  const { id, label, enabled, aiDecide, ifApplicable, style } = element;
  const isConditional = CONDITIONAL_ELEMENT_IDS.has(id);

  // Capture the style snapshot the moment the panel opens
  useEffect(() => {
    if (open && originalStyleRef.current === null) {
      originalStyleRef.current = { ...style };
    }
    if (!open) {
      originalStyleRef.current = null;
      setCompareMode(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasChanges =
    open &&
    originalStyleRef.current !== null &&
    JSON.stringify(originalStyleRef.current) !== JSON.stringify(style);

  const originalElement: FormattingElement | null = originalStyleRef.current
    ? { ...element, style: originalStyleRef.current }
    : null;

  return (
    <div
      className="rounded-xl border transition-all duration-150 overflow-hidden relative group/card"
      style={{
        borderColor: open
          ? "hsl(var(--primary) / 0.4)"
          : enabled
            ? "hsl(var(--border))"
            : "hsl(var(--border) / 0.4)",
        background: enabled ? "hsl(var(--card))" : "hsl(var(--muted) / 0.3)",
        opacity: enabled ? 1 : 0.6,
        boxShadow: open
          ? "0 0 0 1px hsl(var(--primary) / 0.15), 0 4px 16px rgba(0,0,0,0.08)"
          : "none",
      }}
    >
      {/* Left accent strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl transition-all duration-200"
        style={{
          background: enabled
            ? open
              ? "hsl(var(--primary))"
              : "hsl(var(--primary) / 0.5)"
            : "transparent",
        }}
      />
      {/* Header row */}
      <div className="px-3 py-2.5 sm:px-4 sm:py-3">
        {/* Top: toggle + label */}
        <div className="flex items-start gap-2.5">
          <PillToggle on={enabled} onToggle={() => onToggleEnabled(id, !enabled)} testId={`toggle-enabled-${id}`} />
          <span className={`flex-1 text-sm font-semibold leading-snug min-w-0 ${enabled ? "text-foreground" : "text-muted-foreground"}`}>
            {label}
          </span>
          {/* On desktop show buttons inline; on mobile they go below */}
          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            {enabled && isConditional && (
              <button
                onClick={() => onToggleIfApplicable(id, !ifApplicable)}
                title={ifApplicable ? "If Applicable: AI skips if content doesn't warrant it" : "Always Apply"}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium transition-all"
                style={{
                  background: ifApplicable ? "#f59e0b" : "transparent",
                  color: ifApplicable ? "#fff" : "hsl(var(--muted-foreground))",
                  borderColor: ifApplicable ? "#f59e0b" : "hsl(var(--border))",
                }}
                data-testid={`toggle-ifapplicable-${id}`}
              >
                {ifApplicable ? "if avail." : "always"}
              </button>
            )}
            {enabled && (
              <button
                onClick={() => onToggleAiDecide(id, !aiDecide)}
                title={aiDecide ? "AI will decide the style — click to customize manually" : "Let AI decide the style automatically"}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium transition-all"
                style={{
                  background: aiDecide ? "#7c3aed" : "transparent",
                  color: aiDecide ? "#fff" : "hsl(var(--muted-foreground))",
                  borderColor: aiDecide ? "#7c3aed" : "hsl(var(--border))",
                }}
                data-testid={`toggle-ai-${id}`}
              >
                <Wand2 size={10} />
                {aiDecide ? "AI decides" : "AI"}
              </button>
            )}
            {enabled && !aiDecide && (
              <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                style={{
                  background: open ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                  color: open ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
                data-testid={`expand-${id}`}
              >
                {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {open ? "Close" : "Edit Style"}
              </button>
            )}
          </div>
        </div>

        {/* Mobile-only: action buttons on second row, indented under label */}
        {enabled && (
          <div className="flex sm:hidden items-center gap-1.5 mt-2 pl-[46px] flex-wrap">
            {isConditional && (
              <button
                onClick={() => onToggleIfApplicable(id, !ifApplicable)}
                title={ifApplicable ? "If Applicable: AI skips if content doesn't warrant it" : "Always Apply"}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border font-medium transition-all"
                style={{
                  background: ifApplicable ? "#f59e0b" : "transparent",
                  color: ifApplicable ? "#fff" : "hsl(var(--muted-foreground))",
                  borderColor: ifApplicable ? "#f59e0b" : "hsl(var(--border))",
                }}
                data-testid={`toggle-ifapplicable-${id}-mobile`}
              >
                {ifApplicable ? "if avail." : "always"}
              </button>
            )}
            <button
              onClick={() => onToggleAiDecide(id, !aiDecide)}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border font-medium transition-all"
              style={{
                background: aiDecide ? "#7c3aed" : "transparent",
                color: aiDecide ? "#fff" : "hsl(var(--muted-foreground))",
                borderColor: aiDecide ? "#7c3aed" : "hsl(var(--border))",
              }}
              data-testid={`toggle-ai-${id}-mobile`}
            >
              <Wand2 size={10} />
              {aiDecide ? "AI decides" : "AI"}
            </button>
            {!aiDecide && (
              <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-muted text-muted-foreground font-medium transition-colors"
                data-testid={`expand-${id}-mobile`}
              >
                {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {open ? "Collapse" : "Edit Style"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded panel */}
      {enabled && !aiDecide && open && (
        <div className="border-t border-border/60">

          {/* Preview area */}
          <div className="px-4 pt-4 pb-3">
            {/* Compare toggle — only shown when there are actual changes */}
            {hasChanges && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">
                  {compareMode ? "Showing before & after" : "Changes detected"}
                </span>
                <button
                  onClick={() => setCompareMode((p) => !p)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold transition-all"
                  style={{
                    background: compareMode ? "#6366f1" : "hsl(var(--muted))",
                    color: compareMode ? "#fff" : "hsl(var(--muted-foreground))",
                    border: "none",
                  }}
                  data-testid={`compare-${id}`}
                >
                  <GitCompare size={11} />
                  {compareMode ? "Hide Compare" : "Compare"}
                </button>
              </div>
            )}

            {/* Side-by-side compare */}
            {compareMode && originalElement ? (
              <div className="grid grid-cols-2 gap-2">
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

          {/* Style controls */}
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
            <div className="col-span-2 pb-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Style Controls</p>
            </div>

            <div className="col-span-2">
              <SelectInput label="Font Family" value={style.fontFamily} options={FONT_OPTIONS}
                onChange={(v) => onStyleChange(id, "fontFamily", v)} dataTestid={`font-family-${id}`} />
            </div>

            <SelectInput label="Font Size" value={style.fontSize} options={FONT_SIZE_OPTIONS}
              onChange={(v) => onStyleChange(id, "fontSize", v)} dataTestid={`font-size-${id}`} />
            <SelectInput label="Font Weight" value={style.fontWeight} options={FONT_WEIGHT_OPTIONS}
              onChange={(v) => onStyleChange(id, "fontWeight", v)} dataTestid={`font-weight-${id}`} />

            <div className="col-span-2">
              <ColorInput label="Text Color" value={style.color}
                onChange={(v) => onStyleChange(id, "color", v)} dataTestid={`color-${id}`} />
            </div>
            <div className="col-span-2">
              <ColorInput label="Background" value={style.backgroundColor}
                onChange={(v) => onStyleChange(id, "backgroundColor", v)} dataTestid={`bg-color-${id}`} />
            </div>

            <SelectInput label="Text Align" value={style.textAlign} options={ALIGN_OPTIONS}
              onChange={(v) => onStyleChange(id, "textAlign", v)} dataTestid={`align-${id}`} />
            <SelectInput label="Line Height" value={style.lineHeight} options={LINE_HEIGHT_OPTIONS}
              onChange={(v) => onStyleChange(id, "lineHeight", v)} dataTestid={`line-height-${id}`} />

            <SelectInput label="Letter Spacing" value={style.letterSpacing} options={LETTER_SPACING_OPTIONS}
              onChange={(v) => onStyleChange(id, "letterSpacing", v)} dataTestid={`letter-spacing-${id}`} />
            <SelectInput label="Margin Bottom" value={style.marginBottom} options={SPACING_OPTIONS}
              onChange={(v) => onStyleChange(id, "marginBottom", v)} dataTestid={`margin-bottom-${id}`} />

            <SelectInput label="Padding Top" value={style.paddingTop} options={SPACING_OPTIONS}
              onChange={(v) => onStyleChange(id, "paddingTop", v)} dataTestid={`padding-top-${id}`} />
            <SelectInput label="Padding Bottom" value={style.paddingBottom} options={SPACING_OPTIONS}
              onChange={(v) => onStyleChange(id, "paddingBottom", v)} dataTestid={`padding-bottom-${id}`} />

            <SelectInput label="Padding Left" value={style.paddingLeft} options={SPACING_OPTIONS}
              onChange={(v) => onStyleChange(id, "paddingLeft", v)} dataTestid={`padding-left-${id}`} />
            <SelectInput label="Border Width" value={style.borderWidth} options={BORDER_WIDTH_OPTIONS}
              onChange={(v) => onStyleChange(id, "borderWidth", v)} dataTestid={`border-width-${id}`} />

            <SelectInput label="Border Radius" value={style.borderRadius} options={BORDER_RADIUS_OPTIONS}
              onChange={(v) => onStyleChange(id, "borderRadius", v)} dataTestid={`border-radius-${id}`} />

            <div className="col-span-2">
              <ColorInput label="Border Color" value={style.borderColor}
                onChange={(v) => onStyleChange(id, "borderColor", v)} dataTestid={`border-color-${id}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
