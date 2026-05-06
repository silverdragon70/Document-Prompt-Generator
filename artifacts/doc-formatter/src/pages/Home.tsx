import { useState, useRef } from "react";
import {
  FileText, Download, Upload, RotateCcw, Sparkles,
  Moon, Sun, Layers, Settings2, AlignLeft,
  Send, Undo2, Redo2, Search, X, LayoutTemplate, Palette,
} from "lucide-react";
import { useFormatting } from "@/context/FormattingContext";
import { ElementEditor } from "@/components/ElementEditor";
import { PromptOutput } from "@/components/PromptOutput";
import { FloatingPreviewButton } from "@/components/FloatingPreviewButton";
import { COLOR_PALETTES, ColorPalette, OutputFormat, DOCUMENT_PRESETS, LanguageDirection } from "@/types/formatting";

const OUTPUT_FORMATS: { value: OutputFormat; label: string; desc: string; icon: string }[] = [
  { value: "pdf",      label: "PDF",      desc: "Portable document", icon: "📄" },
  { value: "docx",     label: "Word",     desc: ".docx file",        icon: "📝" },
  { value: "html",     label: "HTML",     desc: "Web page",          icon: "🌐" },
  { value: "markdown", label: "Markdown", desc: ".md file",          icon: "✍️" },
];

const LANG_DIRS: { value: LanguageDirection; label: string; desc: string }[] = [
  { value: "auto",  label: "Auto-detect", desc: "Detect language and direction automatically" },
  { value: "ltr",   label: "Force LTR",   desc: "Left-to-right layout for all content" },
  { value: "rtl",   label: "Force RTL",   desc: "Right-to-left layout for all content" },
  { value: "mixed", label: "Mixed",       desc: "Per-paragraph direction based on language" },
];

type Tab = "elements" | "layout" | "output";

export function Home() {
  const {
    state,
    undo, redo, canUndo, canRedo,
    updateElementEnabled, updateElementAiDecide, updateElementIfApplicable, updateElementStyle,
    setAllEnabled,
    applyPalette, applyPreset,
    updateLayout, setOutputFormat,
    setIncludeImages, setLanguageDirection, setStrictContentPreservation,
    setConflictResolution, setStrictDecisionRules,
    resetToDefault, exportSettings, importSettings,
    generatePrompt,
  } = useFormatting();

  const [activeTab, setActiveTab]     = useState<Tab>("elements");
  const [showPrompt, setShowPrompt]   = useState(false);
  const [darkMode, setDarkMode]       = useState(false);
  const [importError, setImportError] = useState("");
  const [search, setSearch]           = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const elementList  = Object.values(state.elements);
  const enabledCount = elementList.filter((e) => e.enabled).length;
  const filteredList = search.trim()
    ? elementList.filter((e) => e.label.toLowerCase().includes(search.toLowerCase()))
    : elementList;

  const toggleDark = () => {
    setDarkMode((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportError(importSettings(text) ? "" : "Invalid settings file.");
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col bg-background overflow-hidden" style={{ height: "100dvh" }}>

      {/* ── Navbar — single clean row ── */}
      <header
        className="flex-shrink-0 flex items-center h-12 px-3 gap-2 border-b border-border bg-card z-10"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
            <FileText size={14} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground hidden sm:block tracking-tight">
            DocFormatter
          </span>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={undo} disabled={!canUndo} title="Undo"
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            data-testid="button-undo">
            <Undo2 size={15} />
          </button>
          <button onClick={redo} disabled={!canRedo} title="Redo"
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            data-testid="button-redo">
            <Redo2 size={15} />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button onClick={exportSettings} title="Export settings"
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
            data-testid="button-export">
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} title="Import settings"
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
            data-testid="button-import">
            <Upload size={13} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button onClick={resetToDefault} title="Reset to defaults"
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
            data-testid="button-reset">
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button onClick={toggleDark} title="Toggle dark mode"
            className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
            data-testid="button-dark-mode">
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {importError && (
        <div className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs px-4 py-2 border-b border-red-200 font-medium">
          ⚠ {importError}
        </div>
      )}

      {/* ── Palette sub-bar — horizontal scroll on all sizes ── */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border bg-background overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex items-center gap-1 flex-shrink-0 mr-1">
          <Palette size={12} className="text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Theme
          </span>
        </div>
        {(Object.entries(COLOR_PALETTES) as [ColorPalette, (typeof COLOR_PALETTES)[ColorPalette]][]).map(([key, pal]) => (
          <button
            key={key}
            onClick={() => applyPalette(key)}
            className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full font-medium transition-all whitespace-nowrap"
            style={{
              background: state.palette === key ? "hsl(var(--primary))" : "hsl(var(--muted))",
              color: state.palette === key ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
              boxShadow: state.palette === key ? "0 1px 6px rgba(99,102,241,0.35)" : "none",
            }}
            data-testid={`palette-${key}`}
          >
            {pal.label}
          </button>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex-shrink-0 flex bg-card border-b border-border">
        {([
          { id: "elements" as Tab, icon: Layers,    label: "Elements", count: `${enabledCount}/${elementList.length}` as string | undefined },
          { id: "layout"   as Tab, icon: Settings2, label: "Layout",   count: undefined as string | undefined },
          { id: "output"   as Tab, icon: AlignLeft, label: "Output",   count: undefined as string | undefined },
        ]).map(({ id, icon: Icon, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all border-b-2"
            style={{
              borderBottomColor: activeTab === id ? "hsl(var(--primary))" : "transparent",
              color: activeTab === id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              background: activeTab === id ? "hsl(var(--primary) / 0.05)" : "transparent",
            }}
            data-testid={`tab-${id}`}
          >
            <Icon size={13} />
            {label}
            {count && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-0.5"
                style={{
                  background: activeTab === id ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  color: activeTab === id ? "#fff" : "hsl(var(--muted-foreground))",
                }}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* ── ELEMENTS ── */}
        {activeTab === "elements" && (
          <div className="px-3 sm:px-4 py-3 flex flex-col gap-2.5">

            {/* Templates + Search row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPresets((p) => !p)}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold transition-all"
                style={{
                  background: showPresets ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  color: showPresets ? "#fff" : "hsl(var(--muted-foreground))",
                }}
                data-testid="button-presets"
              >
                <LayoutTemplate size={13} />
                <span className="hidden sm:inline">Templates</span>
                <span className="sm:hidden">Tmpl</span>
              </button>

              <div className="flex-1 relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search elements…"
                  className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-search"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Enable all / Disable all */}
              {!search && (
                <div className="flex-shrink-0 flex items-center gap-1">
                  <button
                    onClick={() => setAllEnabled(true)}
                    title="Enable all elements"
                    disabled={enabledCount === elementList.length}
                    className="text-[10px] font-semibold px-2 py-1.5 rounded-lg transition-colors disabled:opacity-30"
                    style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    data-testid="button-enable-all"
                  >
                    All On
                  </button>
                  <button
                    onClick={() => setAllEnabled(false)}
                    title="Disable all elements"
                    disabled={enabledCount === 0}
                    className="text-[10px] font-semibold px-2 py-1.5 rounded-lg transition-colors disabled:opacity-30"
                    style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    data-testid="button-disable-all"
                  >
                    All Off
                  </button>
                </div>
              )}

              {/* Search result count */}
              {search && filteredList.length > 0 && (
                <span className="flex-shrink-0 text-[10px] font-semibold text-muted-foreground whitespace-nowrap">
                  {filteredList.length}/{elementList.length}
                </span>
              )}
            </div>

            {/* Presets panel */}
            {showPresets && (
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Document Templates
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCUMENT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => { applyPreset(preset.id); setShowPresets(false); }}
                      className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-left transition-all"
                      data-testid={`preset-${preset.id}`}
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{preset.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{preset.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{preset.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {filteredList.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No elements match "{search}"
              </div>
            )}

            {/* Element list */}
            {filteredList.map((el) => (
              <ElementEditor
                key={el.id}
                element={el}
                onToggleEnabled={updateElementEnabled}
                onToggleAiDecide={updateElementAiDecide}
                onToggleIfApplicable={updateElementIfApplicable}
                onStyleChange={updateElementStyle}
              />
            ))}
          </div>
        )}

        {/* ── LAYOUT ── */}
        {activeTab === "layout" && (
          <div className="p-4 flex flex-col gap-6">

            <section>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px]">⬜</span>
                Page Margins (mm)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(["marginTop","marginBottom","marginLeft","marginRight"] as const).map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-foreground capitalize">{key.replace("margin","")}</span>
                      <span className="text-xs font-mono font-bold text-primary">{state.layout[key]}mm</span>
                    </div>
                    <input type="range" min="5" max="60" step="1" value={state.layout[key]}
                      onChange={(e) => updateLayout(key, Number(e.target.value))}
                      className="w-full accent-primary h-1.5 rounded-full" data-testid={`slider-${key}`} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px]">↕</span>
                Spacing
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-foreground">Line Spacing</span>
                    <span className="text-xs font-mono font-bold text-primary">{state.layout.lineSpacing}×</span>
                  </div>
                  <input type="range" min="1.0" max="3.0" step="0.1" value={state.layout.lineSpacing}
                    onChange={(e) => updateLayout("lineSpacing", Number(e.target.value))}
                    className="w-full accent-primary h-1.5 rounded-full" data-testid="slider-lineSpacing" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-foreground">Paragraph Spacing</span>
                    <span className="text-xs font-mono font-bold text-primary">{state.layout.paragraphSpacing}px</span>
                  </div>
                  <input type="range" min="0" max="48" step="2" value={state.layout.paragraphSpacing}
                    onChange={(e) => updateLayout("paragraphSpacing", Number(e.target.value))}
                    className="w-full accent-primary h-1.5 rounded-full" data-testid="slider-paragraphSpacing" />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px]">↔</span>
                Content Width
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(["fixed","fluid"] as const).map((w) => (
                  <button key={w} onClick={() => updateLayout("contentWidth", w)}
                    className="flex flex-col items-center py-4 px-3 rounded-xl border-2 font-medium transition-all"
                    style={{
                      borderColor: state.layout.contentWidth === w ? "hsl(var(--primary))" : "hsl(var(--border))",
                      background: state.layout.contentWidth === w ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))",
                      color: state.layout.contentWidth === w ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    }}
                    data-testid={`content-width-${w}`}>
                    <span className="text-xl mb-1">{w === "fixed" ? "📏" : "↔"}</span>
                    <span className="text-sm font-bold">{w === "fixed" ? "Fixed" : "Full Width"}</span>
                    <span className="text-xs mt-0.5 opacity-70">{w === "fixed" ? "720px max" : "Fills container"}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── OUTPUT ── */}
        {activeTab === "output" && (
          <div className="p-4 flex flex-col gap-6">

            <section>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Output Format</h3>
              <div className="grid grid-cols-2 gap-3">
                {OUTPUT_FORMATS.map((fmt) => (
                  <button key={fmt.value} onClick={() => setOutputFormat(fmt.value)}
                    className="flex flex-col items-center py-4 px-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: state.outputFormat === fmt.value ? "hsl(var(--primary))" : "hsl(var(--border))",
                      background: state.outputFormat === fmt.value ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))",
                    }}
                    data-testid={`output-format-${fmt.value}`}>
                    <span className="text-2xl mb-1.5">{fmt.icon}</span>
                    <span className={`text-sm font-bold ${state.outputFormat === fmt.value ? "text-primary" : "text-foreground"}`}>
                      {fmt.label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Active Theme</h3>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-bold text-foreground">{COLOR_PALETTES[state.palette].label}</p>
                <p className="text-xs text-muted-foreground mt-1">{COLOR_PALETTES[state.palette].description}</p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Active Elements ({enabledCount})
              </h3>
              <div className="flex flex-wrap gap-2">
                {elementList.filter((el) => el.enabled).map((el) => (
                  <span key={el.id} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                    {el.label}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Image Handling
              </h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    id="include_images"
                    checked={state.include_images ?? true}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span>Include images from source document</span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                When enabled, extracted image rules will be included in the generated prompt
              </p>
            </section>

            {/* ── Advanced Prompt Options ── */}
            <section>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Advanced Prompt Options</h3>
              <div className="grid gap-4">
                {/* Language & Direction */}
                <div>
                  <label className="block text-xs font-medium mb-1">Language & Direction</label>
                  <select
                    value={state.languageDirection}
                    onChange={(e) => setLanguageDirection(e.target.value as LanguageDirection)}
                    className="w-full text-xs p-1 border border-border rounded bg-background"
                  >
                    {LANG_DIRS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-0.5">{LANG_DIRS.find(o=>o.value===state.languageDirection)?.desc}</p>
                </div>

                {/* Content Integrity */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="content_integrity"
                    checked={state.strictContentPreservation ?? true}
                    onChange={(e) => setStrictContentPreservation(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="content_integrity" className="text-xs font-medium">Strict content preservation (no fabrication)</label>
                </div>

                {/* Conflict Resolution */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="conflict_resolution"
                    checked={state.conflictResolution ?? true}
                    onChange={(e) => setConflictResolution(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="conflict_resolution" className="text-xs font-medium">Include conflict resolution rules</label>
                </div>

                {/* Decision Rules for Optional Elements */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="decision_rules"
                    checked={state.strictDecisionRules ?? true}
                    onChange={(e) => setStrictDecisionRules(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="decision_rules" className="text-xs font-medium">Add strict decision rules for optional elements</label>
                </div>
              </div>
            </section>

          </div>
        )}
      </div>

      {/* ── Sticky Generate Prompt ── */}
      <div
        className="flex-shrink-0 border-t border-border bg-card px-4 pt-3 pb-3"
        style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.06)" }}
      >
        <button
          onClick={() => setShowPrompt((p) => !p)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #4f46e5 100%)",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
          }}
          data-testid="button-generate-prompt"
        >
          {showPrompt ? <Send size={16} /> : <Sparkles size={16} />}
          {showPrompt ? "Hide Prompt" : "Generate AI Prompt"}
        </button>

        {showPrompt && (
          <div className="mt-3">
            <PromptOutput generatePrompt={generatePrompt} />
          </div>
        )}
      </div>

      <FloatingPreviewButton />
    </div>
  );
}
