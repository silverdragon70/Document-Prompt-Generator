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
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted">
        {AI_TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTool === tool.id ? "#ffffff" : "transparent",
              color: activeTool === tool.id ? tool.color : "hsl(var(--muted-foreground))",
              boxShadow: activeTool === tool.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
            data-testid={`ai-tool-${tool.id}`}
          >
            <span>{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      {/* Header + Copy */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">
          Prompt optimized for{" "}
          <span style={{ color: activeDef.color }} className="font-bold">{activeDef.label}</span>
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
          style={{
            background: copied ? "#dcfce7" : "hsl(var(--card))",
            color: copied ? "#16a34a" : "hsl(var(--foreground))",
            border: `1px solid ${copied ? "#86efac" : "hsl(var(--border))"}`,
          }}
          data-testid="button-copy-prompt"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Prompt text */}
      <div className="relative rounded-xl border border-border overflow-hidden"
        style={{ background: "hsl(var(--muted) / 0.4)" }}>
        <pre className="text-xs text-foreground/80 font-mono p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
          {prompt}
        </pre>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Copy and paste into <span style={{ color: activeDef.color }} className="font-semibold">{activeDef.label}</span>, then add your raw text where indicated.
      </p>
    </div>
  );
}
