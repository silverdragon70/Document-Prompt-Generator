export interface ElementStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  textAlign: string;
  marginTop: string;
  marginBottom: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  letterSpacing: string;
  lineHeight: string;
  borderRadius: string;
  borderColor: string;
  borderWidth: string;
}

export interface FormattingElement {
  id: string;
  label: string;
  enabled: boolean;
  aiDecide: boolean;
  ifApplicable?: boolean;
  style: ElementStyle;
}

export const CONDITIONAL_ELEMENT_IDS = new Set([
  "callout", "quote", "abstract", "keywords", "divider", "chapterHeader",
]);

export type ColorPalette = "medical" | "academic" | "modern" | "warm" | "ai" | "ocean" | "royal" | "dark" | "forest" | "corporate" | "sunset" | "legal" | "pastel";
export type OutputFormat = "pdf" | "docx" | "html" | "markdown";
export type AiTool = "chatgpt" | "claude" | "gemini";
export type LanguageDirection = "auto" | "ltr" | "rtl" | "mixed";

export interface LayoutControls {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  lineSpacing: number;
  paragraphSpacing: number;
  contentWidth: "fixed" | "fluid";
}

export interface FormattingState {
  languageDirection: LanguageDirection;
  palette: ColorPalette;
  elements: Record<string, FormattingElement>;
  layout: LayoutControls;
  outputFormat: OutputFormat;
  include_images: boolean;
  strictContentPreservation: boolean;
  conflictResolution: boolean;
  strictDecisionRules: boolean;
}

export const DEFAULT_STYLE: ElementStyle = {
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontWeight: "400",
  color: "#1a1a2e",
  backgroundColor: "transparent",
  textAlign: "left",
  marginTop: "0px",
  marginBottom: "16px",
  paddingTop: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  paddingRight: "0px",
  letterSpacing: "0em",
  lineHeight: "1.6",
  borderRadius: "0px",
  borderColor: "transparent",
  borderWidth: "0px",
};

export const FONT_OPTIONS = [
  { label: "Inter (Sans-serif)", value: "Inter, sans-serif" },
  { label: "Lora (Serif)", value: "Lora, Georgia, serif" },
  { label: "Source Code Pro (Mono)", value: "Source Code Pro, monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Helvetica", value: "Helvetica Neue, Helvetica, sans-serif" },
];

export const FONT_WEIGHT_OPTIONS = [
  { label: "Light (300)", value: "300" },
  { label: "Regular (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semi-Bold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra Bold (800)", value: "800" },
];

export const FONT_SIZE_OPTIONS = [
  { label: "10px", value: "10px" },
  { label: "11px", value: "11px" },
  { label: "12px", value: "12px" },
  { label: "13px", value: "13px" },
  { label: "14px", value: "14px" },
  { label: "15px", value: "15px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "22px", value: "22px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "42px", value: "42px" },
  { label: "48px", value: "48px" },
];

export const COLOR_PALETTES: Record<ColorPalette, {
  label: string;
  description: string;
  elements: Partial<Record<string, Partial<ElementStyle>>>;
}> = {
  medical: {
    label: "Medical",
    description: "Blue & Green — clinical and trustworthy",
    elements: {
      h1: { color: "#0d4f6c", fontFamily: "Inter, sans-serif", fontWeight: "700", fontSize: "32px" },
      h2: { color: "#155e75", fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "24px" },
      h3: { color: "#1e7e98", fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#0d4f6c", color: "#ffffff", fontWeight: "600" },
      callout: { backgroundColor: "#ecfdf5", borderColor: "#10b981", color: "#064e3b" },
      abstract: { backgroundColor: "#f0f9ff", borderColor: "#0ea5e9" },
      body: { color: "#1e293b", fontFamily: "Georgia, serif" },
    },
  },
  academic: {
    label: "Academic",
    description: "Black & Gray — formal and scholarly",
    elements: {
      h1: { color: "#111827", fontFamily: "Georgia, serif", fontWeight: "700", fontSize: "32px" },
      h2: { color: "#1f2937", fontFamily: "Georgia, serif", fontWeight: "600", fontSize: "24px" },
      h3: { color: "#374151", fontFamily: "Georgia, serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#1f2937", color: "#ffffff", fontWeight: "600" },
      callout: { backgroundColor: "#f9fafb", borderColor: "#6b7280", color: "#111827" },
      abstract: { backgroundColor: "#f3f4f6", borderColor: "#9ca3af" },
      body: { color: "#111827", fontFamily: "Georgia, serif" },
    },
  },
  modern: {
    label: "Modern Minimal",
    description: "Clean & crisp — contemporary design",
    elements: {
      h1: { color: "#0f172a", fontFamily: "Inter, sans-serif", fontWeight: "800", fontSize: "36px" },
      h2: { color: "#1e293b", fontFamily: "Inter, sans-serif", fontWeight: "700", fontSize: "26px" },
      h3: { color: "#334155", fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#6366f1", color: "#ffffff", fontWeight: "700" },
      callout: { backgroundColor: "#faf5ff", borderColor: "#8b5cf6", color: "#2e1065" },
      abstract: { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" },
      body: { color: "#334155", fontFamily: "Inter, sans-serif" },
    },
  },
  warm: {
    label: "Warm Tones",
    description: "Amber & terracotta — welcoming and rich",
    elements: {
      h1: { color: "#7c2d12", fontFamily: "Lora, Georgia, serif", fontWeight: "700", fontSize: "32px" },
      h2: { color: "#9a3412", fontFamily: "Lora, Georgia, serif", fontWeight: "600", fontSize: "24px" },
      h3: { color: "#b45309", fontFamily: "Lora, Georgia, serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#c2410c", color: "#ffffff", fontWeight: "600" },
      callout: { backgroundColor: "#fffbeb", borderColor: "#f59e0b", color: "#78350f" },
      abstract: { backgroundColor: "#fff7ed", borderColor: "#fb923c" },
      body: { color: "#292524", fontFamily: "Lora, Georgia, serif" },
    },
  },
  ai: {
    label: "Auto (AI Decides)",
    description: "Let AI choose the optimal palette",
    elements: {},
  },
  ocean: {
    label: "Ocean Blue",
    description: "أزرق عميق وتيل — هادئ واحترافي",
    elements: {
      h1: { color: "#0c4a6e", fontFamily: "Inter, sans-serif", fontWeight: "800", fontSize: "36px" },
      h2: { color: "#075985", fontFamily: "Inter, sans-serif", fontWeight: "700", fontSize: "26px" },
      h3: { color: "#0369a1", fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#0c4a6e", color: "#ffffff", fontWeight: "700" },
      callout: { backgroundColor: "#f0f9ff", borderColor: "#0ea5e9", color: "#0c4a6e" },
      abstract: { backgroundColor: "#e0f2fe", borderColor: "#7dd3fc", color: "#0c4a6e" },
      body: { color: "#1e3a5f", fontFamily: "Inter, sans-serif" },
      keywords: { color: "#0369a1" },
      quote: { color: "#0369a1", borderColor: "#0369a1" },
    },
  },
  royal: {
    label: "Royal Purple",
    description: "بنفسجي غامق وذهبي — فاخر ومميز",
    elements: {
      h1: { color: "#3b0764", fontFamily: "Lora, Georgia, serif", fontWeight: "700", fontSize: "34px" },
      h2: { color: "#4c1d95", fontFamily: "Lora, Georgia, serif", fontWeight: "600", fontSize: "26px" },
      h3: { color: "#6d28d9", fontFamily: "Lora, Georgia, serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#3b0764", color: "#fbbf24", fontWeight: "700" },
      callout: { backgroundColor: "#faf5ff", borderColor: "#7c3aed", color: "#3b0764" },
      abstract: { backgroundColor: "#f5f3ff", borderColor: "#a78bfa", color: "#4c1d95" },
      body: { color: "#1e1b4b", fontFamily: "Lora, Georgia, serif" },
      keywords: { color: "#6d28d9" },
      quote: { color: "#6d28d9", borderColor: "#6d28d9" },
    },
  },
  dark: {
    label: "Slate Dark",
    description: "خلفيات داكنة مع نصوص فاتحة — عصري وجريء",
    elements: {
      h1: { color: "#f1f5f9", fontFamily: "Inter, sans-serif", fontWeight: "800", fontSize: "36px" },
      h2: { color: "#e2e8f0", fontFamily: "Inter, sans-serif", fontWeight: "700", fontSize: "26px" },
      h3: { color: "#cbd5e1", fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#1e293b", color: "#94a3b8", fontWeight: "700" },
      callout: { backgroundColor: "#1e293b", borderColor: "#475569", color: "#e2e8f0" },
      abstract: { backgroundColor: "#0f172a", borderColor: "#334155", color: "#cbd5e1" },
      body: { color: "#e2e8f0", fontFamily: "Inter, sans-serif" },
      keywords: { color: "#7dd3fc" },
      quote: { color: "#7dd3fc", borderColor: "#334155" },
    },
  },
  forest: {
    label: "Forest Green",
    description: "أخضر وبني ترابي — طبيعي وهادئ",
    elements: {
      h1: { color: "#14532d", fontFamily: "Georgia, serif", fontWeight: "700", fontSize: "32px" },
      h2: { color: "#166534", fontFamily: "Georgia, serif", fontWeight: "600", fontSize: "24px" },
      h3: { color: "#15803d", fontFamily: "Georgia, serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#14532d", color: "#bbf7d0", fontWeight: "600" },
      callout: { backgroundColor: "#f0fdf4", borderColor: "#22c55e", color: "#14532d" },
      abstract: { backgroundColor: "#dcfce7", borderColor: "#86efac", color: "#166534" },
      body: { color: "#1a2e1a", fontFamily: "Georgia, serif" },
      keywords: { color: "#15803d" },
      quote: { color: "#15803d", borderColor: "#15803d" },
    },
  },
  corporate: {
    label: "Corporate Gray",
    description: "رمادي وأسود — رسمي وجاد للغاية",
    elements: {
      h1: { color: "#111111", fontFamily: "Helvetica Neue, Helvetica, sans-serif", fontWeight: "800", fontSize: "34px" },
      h2: { color: "#222222", fontFamily: "Helvetica Neue, Helvetica, sans-serif", fontWeight: "700", fontSize: "26px" },
      h3: { color: "#444444", fontFamily: "Helvetica Neue, Helvetica, sans-serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#111111", color: "#ffffff", fontWeight: "600" },
      callout: { backgroundColor: "#f5f5f5", borderColor: "#888888", color: "#111111" },
      abstract: { backgroundColor: "#eeeeee", borderColor: "#aaaaaa", color: "#333333" },
      body: { color: "#333333", fontFamily: "Helvetica Neue, Helvetica, sans-serif" },
      keywords: { color: "#555555" },
      quote: { color: "#444444", borderColor: "#888888" },
    },
  },
  sunset: {
    label: "Sunset",
    description: "برتقالي وأحمر وردي — إبداعي وحيوي",
    elements: {
      h1: { color: "#7f1d1d", fontFamily: "Inter, sans-serif", fontWeight: "800", fontSize: "36px" },
      h2: { color: "#9a3412", fontFamily: "Inter, sans-serif", fontWeight: "700", fontSize: "26px" },
      h3: { color: "#c2410c", fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#dc2626", color: "#ffffff", fontWeight: "700" },
      callout: { backgroundColor: "#fff7ed", borderColor: "#fb923c", color: "#7f1d1d" },
      abstract: { backgroundColor: "#fef9c3", borderColor: "#fde047", color: "#713f12" },
      body: { color: "#431407", fontFamily: "Inter, sans-serif" },
      keywords: { color: "#c2410c" },
      quote: { color: "#dc2626", borderColor: "#dc2626" },
    },
  },
  legal: {
    label: "Legal Gold",
    description: "كحلي وذهبي — قانوني وموثوق",
    elements: {
      h1: { color: "#1e3a5f", fontFamily: "Times New Roman, serif", fontWeight: "700", fontSize: "32px" },
      h2: { color: "#1e3a5f", fontFamily: "Times New Roman, serif", fontWeight: "600", fontSize: "24px" },
      h3: { color: "#2d5986", fontFamily: "Times New Roman, serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#1e3a5f", color: "#d4af37", fontWeight: "600" },
      callout: { backgroundColor: "#fffbeb", borderColor: "#d4af37", color: "#1e3a5f" },
      abstract: { backgroundColor: "#f0f4f8", borderColor: "#d4af37", color: "#1e3a5f" },
      body: { color: "#1e3a5f", fontFamily: "Times New Roman, serif" },
      keywords: { color: "#d4af37" },
      quote: { color: "#1e3a5f", borderColor: "#d4af37" },
    },
  },
  pastel: {
    label: "Pastel Soft",
    description: "ألوان باستيل ناعمة — طبي ورعاية صحية",
    elements: {
      h1: { color: "#4f46e5", fontFamily: "Inter, sans-serif", fontWeight: "700", fontSize: "32px" },
      h2: { color: "#7c3aed", fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "24px" },
      h3: { color: "#9333ea", fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "20px" },
      sectionHeader: { backgroundColor: "#ddd6fe", color: "#4c1d95", fontWeight: "600" },
      callout: { backgroundColor: "#fce7f3", borderColor: "#f9a8d4", color: "#831843" },
      abstract: { backgroundColor: "#e0f2fe", borderColor: "#7dd3fc", color: "#075985" },
      body: { color: "#374151", fontFamily: "Inter, sans-serif" },
      keywords: { color: "#7c3aed" },
      quote: { color: "#7c3aed", borderColor: "#c4b5fd" },
    },
  },
};

// ── Document Presets ──────────────────────────────────────────────────
export interface DocumentPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  palette: ColorPalette;
  outputFormat: OutputFormat;
  layout: Partial<LayoutControls>;
  enabledIds: string[];   // element IDs to enable (rest disabled)
}

export const DOCUMENT_PRESETS: DocumentPreset[] = [
  {
    id: "academic",
    label: "Academic Paper",
    description: "IEEE/APA style — abstract, keywords, formal headings",
    icon: "🎓",
    palette: "academic",
    outputFormat: "pdf",
    layout: { marginTop: 25, marginBottom: 25, marginLeft: 30, marginRight: 30, lineSpacing: 2.0, paragraphSpacing: 20 },
    enabledIds: ["header", "h1", "abstract", "keywords", "divider", "sectionHeader", "h2", "h3", "body", "numberedList", "quote", "pageNumber"],
  },
  {
    id: "business",
    label: "Business Report",
    description: "Clean executive report with tables and callouts",
    icon: "💼",
    palette: "modern",
    outputFormat: "docx",
    layout: { marginTop: 20, marginBottom: 20, marginLeft: 25, marginRight: 25, lineSpacing: 1.5, paragraphSpacing: 14 },
    enabledIds: ["header", "chapterHeader", "sectionHeader", "h1", "h2", "h3", "body", "callout", "table", "numberedList", "divider", "pageNumber"],
  },
  {
    id: "medical",
    label: "Medical Research",
    description: "Clinical paper with abstract and structured sections",
    icon: "🏥",
    palette: "medical",
    outputFormat: "pdf",
    layout: { marginTop: 25, marginBottom: 25, marginLeft: 28, marginRight: 28, lineSpacing: 1.8, paragraphSpacing: 16 },
    enabledIds: ["header", "h1", "abstract", "keywords", "sectionHeader", "h2", "h3", "body", "callout", "table", "numberedList", "divider", "pageNumber"],
  },
  {
    id: "newsletter",
    label: "Newsletter",
    description: "Warm and engaging — quotes, callouts, rich headings",
    icon: "📰",
    palette: "warm",
    outputFormat: "html",
    layout: { marginTop: 15, marginBottom: 15, marginLeft: 20, marginRight: 20, lineSpacing: 1.6, paragraphSpacing: 12 },
    enabledIds: ["header", "chapterHeader", "h1", "h2", "body", "quote", "callout", "numberedList", "divider"],
  },
  {
    id: "minimal",
    label: "Minimal Blog",
    description: "Clean reading experience — body and headings only",
    icon: "✍️",
    palette: "modern",
    outputFormat: "markdown",
    layout: { marginTop: 20, marginBottom: 20, marginLeft: 40, marginRight: 40, lineSpacing: 1.8, paragraphSpacing: 18, contentWidth: "fixed" },
    enabledIds: ["h1", "h2", "h3", "body", "quote", "divider"],
  },
  {
    id: "teaching",
    label: "Teaching Material",
    description: "مادة تعليمية — أهداف تعلم، أنشطة، ملاحظات، وجداول",
    icon: "📚",
    palette: "pastel",
    outputFormat: "pdf",
    layout: { marginTop: 20, marginBottom: 20, marginLeft: 25, marginRight: 25, lineSpacing: 1.7, paragraphSpacing: 14 },
    enabledIds: ["header", "chapterHeader", "sectionHeader", "h1", "h2", "h3", "body", "callout", "numberedList", "table", "keywords", "divider", "pageNumber"],
  },
];

export const INITIAL_STATE: FormattingState = {
  palette: "modern",
  outputFormat: "pdf",
  include_images: true,
  languageDirection: "auto",
  strictContentPreservation: true,
  conflictResolution: true,
  strictDecisionRules: true,
  layout: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 25,
    marginRight: 25,
    lineSpacing: 1.6,
    paragraphSpacing: 16,
    contentWidth: "fixed",
  },
  elements: {
    header: {
      id: "header",
      label: "Header / Footer",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontSize: "11px",
        color: "#6b7280",
        fontWeight: "400",
        paddingBottom: "8px",
        borderColor: "#e5e7eb",
        borderWidth: "1px",
        marginBottom: "24px",
      },
    },
    chapterHeader: {
      id: "chapterHeader",
      label: "Chapter Header",
      enabled: true,
      aiDecide: false,
      ifApplicable: true,
      style: {
        ...DEFAULT_STYLE,
        fontSize: "12px",
        fontWeight: "500",
        color: "#6366f1",
        letterSpacing: "0.1em",
        marginBottom: "4px",
      },
    },
    sectionHeader: {
      id: "sectionHeader",
      label: "Section Header Bar",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: "700",
        color: "#ffffff",
        backgroundColor: "#6366f1",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "16px",
        paddingRight: "16px",
        marginBottom: "16px",
        borderRadius: "4px",
      },
    },
    h1: {
      id: "h1",
      label: "Heading H1",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "36px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "12px",
        lineHeight: "1.2",
      },
    },
    h2: {
      id: "h2",
      label: "Heading H2",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "26px",
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: "10px",
        lineHeight: "1.3",
      },
    },
    h3: {
      id: "h3",
      label: "Heading H3",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "20px",
        fontWeight: "600",
        color: "#334155",
        marginBottom: "8px",
        lineHeight: "1.4",
      },
    },
    body: {
      id: "body",
      label: "Body Text",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "15px",
        fontWeight: "400",
        color: "#334155",
        lineHeight: "1.7",
        marginBottom: "12px",
      },
    },
    callout: {
      id: "callout",
      label: "Callout Box",
      enabled: true,
      aiDecide: false,
      ifApplicable: true,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: "400",
        color: "#2e1065",
        backgroundColor: "#faf5ff",
        borderColor: "#8b5cf6",
        borderWidth: "2px",
        paddingTop: "14px",
        paddingBottom: "14px",
        paddingLeft: "16px",
        paddingRight: "16px",
        marginBottom: "16px",
        borderRadius: "6px",
      },
    },
    abstract: {
      id: "abstract",
      label: "Abstract Block",
      enabled: true,
      aiDecide: false,
      ifApplicable: true,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: "400",
        color: "#334155",
        backgroundColor: "#f8fafc",
        borderColor: "#e2e8f0",
        borderWidth: "1px",
        paddingTop: "16px",
        paddingBottom: "16px",
        paddingLeft: "20px",
        paddingRight: "20px",
        marginBottom: "20px",
        borderRadius: "6px",
        lineHeight: "1.7",
      },
    },
    keywords: {
      id: "keywords",
      label: "Keywords Section",
      enabled: true,
      aiDecide: false,
      ifApplicable: true,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        fontWeight: "500",
        color: "#6366f1",
        backgroundColor: "transparent",
        marginBottom: "16px",
        letterSpacing: "0.03em",
      },
    },
    table: {
      id: "table",
      label: "Tables (Styled)",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: "400",
        color: "#1e293b",
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        borderWidth: "1px",
        marginBottom: "20px",
      },
    },
    numberedList: {
      id: "numberedList",
      label: "Numbered / Bullet Lists",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Inter, sans-serif",
        fontSize: "15px",
        fontWeight: "400",
        color: "#334155",
        paddingLeft: "20px",
        marginBottom: "12px",
        lineHeight: "1.7",
      },
    },
    quote: {
      id: "quote",
      label: "Highlighted Quote",
      enabled: true,
      aiDecide: false,
      ifApplicable: true,
      style: {
        ...DEFAULT_STYLE,
        fontFamily: "Lora, Georgia, serif",
        fontSize: "18px",
        fontWeight: "400",
        color: "#6366f1",
        backgroundColor: "transparent",
        borderColor: "#6366f1",
        borderWidth: "3px",
        paddingLeft: "20px",
        paddingTop: "8px",
        paddingBottom: "8px",
        marginBottom: "20px",
        lineHeight: "1.6",
      },
    },
    divider: {
      id: "divider",
      label: "Dividers / Separators",
      enabled: true,
      aiDecide: false,
      ifApplicable: true,
      style: {
        ...DEFAULT_STYLE,
        borderColor: "#e2e8f0",
        borderWidth: "1px",
        marginTop: "20px",
        marginBottom: "20px",
      },
    },
    pageNumber: {
      id: "pageNumber",
      label: "Page Numbering",
      enabled: true,
      aiDecide: false,
      style: {
        ...DEFAULT_STYLE,
        fontSize: "11px",
        fontWeight: "400",
        color: "#9ca3af",
        textAlign: "center",
        marginTop: "8px",
      },
    },
  },
};
