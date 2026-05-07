import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { AiTool } from "@/types/formatting";

interface PromptOutputProps {
  generatePrompt: (tool: AiTool) => string;
}

const AI_TOOLS: { id: AiTool; label: string; icon: string; color: string }[] = [
  { id: "chatgpt", label: "ChatGPT", icon: "🤖", color: "#10a37f" },
  { id: "claude",  label: "Claude",  icon: "🔶", color: "#c96a2b" },
  { id: "gemini",  label: "Gemini",  icon: "✦",  color: "#4285f4" },
];

export function PromptOutput({ generatePrompt }: PromptOutputProps) {
  const [activeTool, setActiveTool] = useState<AiTool>("chatgpt");
  const [copied, setCopied] = useState(false);

  const prompt = generatePrompt(activeTool);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeDef = AI_TOOLS.find((t) => t.id === activeTool)!;

  return (
    <div className="flex flex-col gap-3">

      {/* AI tool tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-muted/60 border border-border/40">
        {AI_TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-[13px] font-bold transition-all"
            style={{
              background: activeTool === tool.id ? "hsl(var(--card))" : "transparent",
              color: activeTool === tool.id ? tool.color : "hsl(var(--muted-foreground))",
              boxShadow: activeTool === tool.id ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            }}
            data-testid={`ai-tool-${tool.id}`}
          >
            <span className="text-base">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      {/* Header + Copy */}
      <div className="flex items-center justify-between px-1 mt-2">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Optimized for{" "}
          <span style={{ color: activeDef.color }} className="font-black">{activeDef.label}</span>
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-full font-bold transition-all shadow-sm hover:shadow"
          style={{
            background: copied ? "#10b981" : "hsl(var(--card))",
            color: copied ? "#ffffff" : "hsl(var(--foreground))",
            border: `2px solid ${copied ? "#10b981" : "hsl(var(--border) / 0.5)"}`,
          }}
          data-testid="button-copy-prompt"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Prompt text */}
      <div className="relative rounded-2xl border-2 border-border/50 bg-background shadow-sm overflow-hidden mt-1">
        <pre className="text-[13px] text-foreground font-mono p-5 overflow-x-auto whitespace-pre-wrap leading-[1.6] max-h-72 overflow-y-auto no-scrollbar">
          {prompt}
        </pre>
      </div>

      <p className="text-[11px] font-bold text-muted-foreground leading-relaxed px-1">
        Copy and paste into <span style={{ color: activeDef.color }} className="font-black">{activeDef.label}</span>, then add your raw text where indicated.
      </p>
    </div>
  );
}
