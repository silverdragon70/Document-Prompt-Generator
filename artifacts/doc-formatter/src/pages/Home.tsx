import { useState, useRef } from "react";
import {
  FileText, Download, Upload, RotateCcw, Sparkles,
  Settings2, AlignLeft, ArrowLeft, Palette,
  Undo2, Redo2, Search, X, LayoutTemplate, Layers,
  Plus, Send, ChevronRight
} from "lucide-react";
import { useFormatting } from "@/context/FormattingContext";
import { CompactElementRow, ElementEditPanel } from "@/components/ElementEditor";
import { PromptOutput } from "@/components/PromptOutput";
import { LivePreview } from "@/components/LivePreview";
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

  const [activeTab, setActiveTab] = useState<Tab>("elements");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [showPrompt, setShowPrompt] = useState(false);
  const [importError, setImportError] = useState("");
  const [search, setSearch] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const elementList = Object.values(state.elements);
  const filteredList = search.trim()
    ? elementList.filter((e) => e.label.toLowerCase().includes(search.toLowerCase()))
    : elementList;

  const selectedElement = elementList.find(e => e.id === selectedElementId);

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
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground antialiased relative">
      
      {/* ── Global Top Navbar ── */}
      <header className="h-[60px] flex-shrink-0 flex justify-between items-center px-4 md:px-6 bg-card border-b border-border z-40 relative shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[18px] text-primary tracking-tight">
            DocFormatter
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 mr-2">
            <button onClick={undo} disabled={!canUndo} className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30">
              <Undo2 size={16} />
            </button>
            <button onClick={redo} disabled={!canRedo} className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30">
              <Redo2 size={16} />
            </button>
            <button onClick={resetToDefault} className="p-2 ml-1 rounded-xl text-muted-foreground hover:bg-muted hover:text-destructive transition-colors disabled:opacity-30">
              <RotateCcw size={16} />
            </button>
          </div>
          
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-[13px] font-bold text-muted-foreground hover:bg-muted rounded-xl transition-all">
            Import
          </button>
          <button onClick={exportSettings} className="px-5 py-2 text-[13px] font-bold bg-primary text-primary-foreground rounded-xl shadow-md hover:opacity-90 transition-all">
            Export
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </header>

      {importError && (
        <div className="flex-shrink-0 bg-destructive/10 text-destructive text-[11px] px-8 py-3 border-b border-destructive/20 font-bold z-40 relative">
          ⚠ {importError}
        </div>
      )}

      {/* ── Workspace ── */}
      <div className="flex-1 flex overflow-hidden relative z-0">
        
        {/* 1. Sidenav Spacer & Hover Sidebar */}
        <div className="w-[48px] flex-shrink-0 bg-card border-r border-border z-10" />
        
        <aside className="absolute left-0 top-0 bottom-0 w-[48px] hover:w-[200px] bg-card border-r border-border flex flex-col py-4 z-40 transition-[width] duration-300 ease-in-out group overflow-hidden shadow-none hover:shadow-xl">
          <div className="flex flex-col gap-1 w-[200px]">
            {([
              { id: "elements" as Tab, icon: Layers,    label: "Elements" },
              { id: "layout"   as Tab, icon: Settings2, label: "Layout" },
              { id: "output"   as Tab, icon: AlignLeft, label: "Output" },
            ]).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSelectedElementId(null); }}
                className={`w-full h-[40px] px-[14px] flex items-center gap-3 transition-all ${
                  activeTab === id 
                    ? "text-primary bg-primary/5 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary before:rounded-r-full" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-bold text-[14px]">
                  {label}
                </span>
              </button>
            ))}
          </div>
          
          <div className="w-5 h-[1px] bg-border my-2 mx-auto group-hover:w-[160px] transition-all duration-300" />
          
          <div className="flex flex-col gap-1 w-[200px] mt-auto">
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to start a new project? This will reset all current styling.")) {
                  resetToDefault();
                  setActiveTab("elements");
                  setSelectedElementId(null);
                }
              }}
              className="w-full h-[40px] px-[14px] flex items-center gap-3 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              <Plus size={18} className="flex-shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-bold text-[14px]">
                New Project
              </span>
            </button>
          </div>
        </aside>

        {/* 2. List Panel */}
        <div className="w-[280px] flex-shrink-0 bg-card flex flex-col border-r border-border z-20 relative">
          
          <div className="px-4 py-3 border-b border-border/50 shrink-0">
             {activeTab === "elements" && <h2 className="text-[14px] font-bold text-foreground">Style Guide</h2>}
             {activeTab === "layout" && <h2 className="text-[14px] font-bold text-foreground">Document Layout</h2>}
             {activeTab === "output" && <h2 className="text-[14px] font-bold text-foreground">Export Options</h2>}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-3">
            {activeTab === "elements" && (
              <div className="flex flex-col gap-2">
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search elements…"
                    className="w-full pl-9 pr-3 py-2.5 text-[12px] rounded-xl bg-muted/30 border-2 border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-muted">
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div 
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-colors border-2 mb-3 ${
                      selectedElementId === "global-colors" 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-card border-transparent hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedElementId("global-colors")}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Palette size={16} />
                    </div>
                    <span className={`flex-1 text-[14px] font-bold truncate ${selectedElementId === "global-colors" ? "text-primary" : "text-foreground"}`}>
                      Color Style
                    </span>
                    <ChevronRight size={18} className={selectedElementId === "global-colors" ? "text-primary" : "text-muted-foreground"} />
                  </div>

                  {filteredList.map(el => (
                    <CompactElementRow
                      key={el.id}
                      element={el}
                      isSelected={selectedElementId === el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      onToggleEnabled={updateElementEnabled}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "layout" && (
              <div className="flex flex-col gap-6 px-1 py-2">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Page Margins (mm)</h3>
                  {(["marginTop","marginBottom","marginLeft","marginRight"] as const).map((key) => (
                    <div key={key} className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-bold text-foreground capitalize">{key.replace("margin","")}</span>
                        <span className="text-[11px] font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{state.layout[key]}</span>
                      </div>
                      <input type="range" min="5" max="60" step="1" value={state.layout[key]}
                        onChange={(e) => updateLayout(key, Number(e.target.value))}
                        className="w-full accent-primary h-1.5 rounded-full bg-muted appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Spacing</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-foreground">Line Spacing</span>
                      <span className="text-[11px] font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{state.layout.lineSpacing}×</span>
                    </div>
                    <input type="range" min="1.0" max="3.0" step="0.1" value={state.layout.lineSpacing}
                      onChange={(e) => updateLayout("lineSpacing", Number(e.target.value))}
                      className="w-full accent-primary h-1.5 rounded-full bg-muted appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-foreground">Paragraph Spacing</span>
                      <span className="text-[11px] font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{state.layout.paragraphSpacing}px</span>
                    </div>
                    <input type="range" min="0" max="48" step="2" value={state.layout.paragraphSpacing}
                      onChange={(e) => updateLayout("paragraphSpacing", Number(e.target.value))}
                      className="w-full accent-primary h-1.5 rounded-full bg-muted appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "output" && (
              <div className="flex flex-col gap-6 px-1 py-2">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Output Format</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {OUTPUT_FORMATS.map((fmt) => (
                      <button key={fmt.value} onClick={() => setOutputFormat(fmt.value)}
                        className="flex flex-col items-center py-4 px-2 rounded-2xl border-2 transition-all shadow-sm"
                        style={{
                          borderColor: state.outputFormat === fmt.value ? "hsl(var(--primary))" : "hsl(var(--border) / 0.5)",
                          background: state.outputFormat === fmt.value ? "hsl(var(--primary) / 0.08)" : "hsl(var(--background))",
                        }}>
                        <span className="text-2xl mb-1">{fmt.icon}</span>
                        <span className={`text-[12px] font-bold ${state.outputFormat === fmt.value ? "text-primary" : "text-foreground"}`}>
                          {fmt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Advanced Options</h3>
                  <label className="flex items-start gap-3 text-[12px] font-bold cursor-pointer bg-muted/30 p-3 rounded-2xl border border-border/50 hover:bg-muted/50 transition-colors">
                    <input type="checkbox" checked={state.include_images ?? true}
                      onChange={(e) => setIncludeImages(e.target.checked)}
                      className="mt-0.5 h-4 w-4 text-primary rounded border-border focus:ring-primary accent-primary" />
                    <span className="leading-tight">Include images from source</span>
                  </label>
                  <label className="flex items-start gap-3 text-[12px] font-bold cursor-pointer bg-muted/30 p-3 rounded-2xl border border-border/50 hover:bg-muted/50 transition-colors">
                    <input type="checkbox" checked={state.strictContentPreservation ?? true}
                      onChange={(e) => setStrictContentPreservation(e.target.checked)}
                      className="mt-0.5 h-4 w-4 text-primary rounded border-border focus:ring-primary accent-primary" />
                    <span className="leading-tight">Strict content preservation</span>
                  </label>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => setShowPrompt((p) => !p)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-[13px] text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #7c3aed 50%, #a855f7 100%)" }}
                  >
                    {showPrompt ? <Send size={14} /> : <Sparkles size={14} />}
                    {showPrompt ? "Hide Prompt" : "Generate Prompt"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Edit Panel (Slides in) */}
        <div 
          className="absolute top-0 bottom-0 w-[300px] bg-card border-r border-border shadow-[4px_0_24px_rgba(0,0,0,0.08)] z-10 flex flex-col transition-transform duration-200 ease-out"
          style={{
            left: "328px", // 48 (sidenav) + 280 (list)
            transform: (selectedElementId && activeTab === "elements") ? "translateX(0)" : "translateX(-100%)"
          }}
        >
          {selectedElementId === "global-colors" && activeTab === "elements" && (
            <div className="flex flex-col h-full bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50 shrink-0">
                <button onClick={() => setSelectedElementId(null)} className="p-1.5 rounded-xl border-2 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
                  <ArrowLeft size={18} />
                </button>
                <span className="font-extrabold text-[16px] flex-1 text-foreground truncate">Color Style</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 no-scrollbar flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="pb-1 border-b border-border/50">
                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">Document Palettes</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(COLOR_PALETTES).map(([key, pal]) => {
                      const bgColors: Record<string, string> = {
                        default: "#5e39e0", ocean: "#0ea5e9", forest: "#10b981",
                        sunset: "#f97316", monochrome: "#171717", pastel: "#f472b6"
                      };
                      return (
                        <button
                          key={key}
                          onClick={() => applyPalette(key as ColorPalette)}
                          className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all shadow-sm hover:shadow"
                          style={{
                            borderColor: state.palette === key ? "hsl(var(--primary))" : "hsl(var(--border) / 0.5)",
                            background: state.palette === key ? "hsl(var(--primary) / 0.05)" : "hsl(var(--card))",
                          }}
                        >
                          <div className="w-8 h-8 rounded-full shadow-sm" style={{ background: bgColors[key] || "#5e39e0" }} />
                          <span className={`text-[12px] font-bold ${state.palette === key ? "text-primary" : "text-foreground"}`}>
                            {pal.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedElement && activeTab === "elements" && (
            <ElementEditPanel
              element={selectedElement}
              onClose={() => setSelectedElementId(null)}
              onStyleChange={updateElementStyle}
              onToggleAiDecide={updateElementAiDecide}
              onToggleIfApplicable={updateElementIfApplicable}
            />
          )}
        </div>

        {/* 4. Canvas */}
        <div 
          className="flex-1 flex flex-col transition-all duration-200 ease-out bg-muted/10 relative z-0 h-full overflow-hidden"
          style={{
            marginLeft: (selectedElementId && activeTab === "elements") ? "300px" : "0"
          }}
        >
          {/* Top Bar for Canvas (Removed as per requested, palette moved to Style Guide) */}
          <div className="h-[44px] flex-shrink-0 bg-card border-b border-border px-6 flex justify-between items-center z-10">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Canvas Preview</span>
          </div>
          
          <div className="flex-1 overflow-auto p-6 md:p-8 relative">
             <div className="max-w-[1200px] mx-auto bg-card rounded-[2rem] shadow-xl border border-border/40 min-h-full p-0 overflow-hidden relative">
               <div className="absolute inset-0 overflow-y-auto no-scrollbar">
                 {showPrompt && activeTab === "output" ? (
                   <div className="p-8">
                     <PromptOutput generatePrompt={generatePrompt} />
                   </div>
                 ) : (
                   <LivePreview state={state} />
                 )}
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
