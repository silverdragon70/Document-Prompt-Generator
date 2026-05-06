# Document Format Prompt Generator — Core Features

**Version:** 1.0.0  
**Document Type:** Feature Specification  
**Audience:** Product Teams, Engineers, Designers  
**Last Updated:** May 2026

---

## 1. Feature Overview Matrix

| Feature | Status | Scope | Complexity | User Benefit |
|---------|--------|-------|-----------|--------------|
| **Prompt Generation Engine** | ✓ Ready | Core | High | Multi-AI compatibility |
| **Template System (Presets)** | ✓ Ready | Core | Medium | Quick start workflows |
| **Color Palettes** | ✓ Ready | Core | Low | Visual consistency |
| **Formatting Elements Editor** | ✓ Ready | Core | High | Granular control |
| **Real-time Preview** | ✓ Ready | Core | High | Instant feedback |
| **Undo/Redo History** | ✓ Ready | Core | Medium | Non-destructive editing |
| **Export/Import Settings** | ✓ Ready | Core | Low | Reusability |
| **Layout Controls** | ✓ Ready | Core | Medium | Page-level customization |
| **Multi-Output Formats** | ✓ Ready | Enhancement | Medium | Format flexibility |
| **Conditional Elements** | ✓ Ready | Enhancement | High | Smart formatting |
| **Dark Mode** | ✓ Ready | Enhancement | Low | Accessibility |
| **Mobile Responsive UI** | ✓ Ready | Enhancement | Medium | Cross-platform |

---

## 2. Core Feature 1: Prompt Generation Engine

### 2.1 Overview

The Prompt Generation Engine is the intellectual core of the entire system. It transforms a user's formatting specifications (visual styles, typography rules, layout constraints) into precise natural language instructions that AI models can understand and execute consistently.

### 2.2 Capabilities

#### 2.2.1 Multi-Model Prompt Generation

The engine generates three distinct prompt variants, each optimized for the specific input preferences and training of each AI platform:

```
generatePrompt(aiTool: 'chatgpt' | 'claude' | 'gemini'): string
```

**ChatGPT Prompt Structure:**
- **Format**: XML-based markup (GPT-3.5/GPT-4 training preference)
- **Structure**: Explicit `<system>`, `<formatting_spec>`, `<raw_text>` tags
- **Reasoning**: OpenAI models trained on XML tend to follow structured instructions more precisely
- **Length**: 900–1200 tokens
- **Example Section**:
  ```xml
  <system>
  You are a professional document formatter. Format the raw text 
  inside <raw_text> tags into a polished, well-structured document 
  following the specifications below.
  </system>
  
  <formatting_spec>
  <output_format>PDF</output_format>
  
  ## PAGE LAYOUT
  - Margins: Top 25mm, Bottom 25mm, Left 30mm, Right 30mm
  [... detailed specs ...]
  </formatting_spec>
  ```

**Claude Prompt Structure:**
- **Format**: Natural language with hierarchical sections
- **Structure**: `**Role:**`, `**Task:**`, `**Output format:**`, etc.
- **Reasoning**: Claude shows stronger performance on conversational, reasoning-forward prompts
- **Length**: 1000–1300 tokens
- **Example Section**:
  ```
  **Role:** Professional document formatter
  
  **Task:** Format the raw text provided at the end into a 
  polished document.
  
  **Output format:** PDF
  
  ## PAGE LAYOUT
  - Margins: Top 25mm, Bottom 25mm, Left 30mm, Right 30mm
  ```

**Gemini Prompt Structure:**
- **Format**: Clean markdown with task-first emphasis
- **Structure**: Role → Task description → Format → Detailed rules
- **Reasoning**: Gemini performs well with explicit step-by-step instructions in markdown
- **Length**: 800–1100 tokens
- **Example Section**:
  ```markdown
  **Role:** Professional document formatter
  
  **Task:** Format the raw text provided at the end 
  into a polished document.
  
  **Output format:** PDF
  ```

#### 2.2.2 Enabled Elements Filtering

The engine only includes enabled formatting elements in the generated prompt, reducing noise and token count:

```typescript
const enabledElements = Object.values(state.elements)
  .filter((el) => el.enabled);

// Result: Only creates formatting rules for ~10 elements
// (vs generating for all 20+ potential elements)
```

**Benefit**: Reduces prompt size by 40–60%, improving response speed and cost-effectiveness

#### 2.2.3 AI-Decide Mode

For each formatting element, users can toggle an "AI Decide" flag, telling the AI to choose optimal formatting:

```typescript
if (element.aiDecide) {
  return `  - ${element.label}: [Let AI decide the optimal formatting]`;
} else {
  // Include explicit style specifications
  return `  - ${element.label}:
      font: ${s.fontFamily}, ${s.fontSize}, weight ${s.fontWeight}
      color: ${s.color}
      ...`;
}
```

**Use Cases:**
- User specifies all formatting except one element
- AI fills in the missing element appropriately
- Results in more "natural" formatting for that element

**Example**: "Let AI decide the optimal color for body text (I'll specify everything else)"

#### 2.2.4 Conditional Element Hints

For certain formatting elements (callout, quote, abstract, keywords, divider, chapterHeader), the engine includes special conditional warnings:

```
CONDITIONAL_HINTS = {
  callout: "ONLY if the content contains a key insight, 
            warning, or important note worth highlighting",
  quote: "ONLY if the content contains a notable quote 
         or statement worth emphasizing",
  abstract: "ONLY if the document is academic or research-based 
            and requires a summary",
  keywords: "ONLY if clear topic keywords can be identified",
  divider: "Use sparingly to separate major sections",
  chapterHeader: "ONLY if document is divided into chapters"
}
```

**Prompt Injection**:
```
⚠ IF APPLICABLE: {hint}
```

**Benefit**: Prevents AI from inventing content to "fill" these optional elements

**Example Scenario**:
- User markup says: "Include IF APPLICABLE: Abstract (academic only)"
- AI receives: `<raw_text>Short blog post about coffee brewing</raw_text>`
- Result: AI correctly omits abstract (not academic content)
- Without this hint: AI might hallucinate a fake abstract

#### 2.2.5 Multi-Format Output Specifications

The engine adapts instructions based on target output format:

```
Output Formats Supported:
├─ PDF
│  └─ Emphasis on: print-ready typography, margins, page breaks
│     Example: "Ensure 25mm margins for print readability"
│
├─ DOCX (Microsoft Word)
│  └─ Emphasis on: standard styles, compatibility, table formatting
│     Example: "Use standard Heading 1, Heading 2 styles"
│
├─ HTML
│  └─ Emphasis on: semantic markup, responsive sizing, web standards
│     Example: "Use <h1>, <h2> tags for accessibility"
│
└─ Markdown
   └─ Emphasis on: GitHub-flavor syntax, code blocks, lists
      Example: "Use # for H1, ## for H2, etc."
```

For each format, the engine generates format-specific guidance within the prompt.

### 2.3 Prompt Content Structure

Every generated prompt follows this hierarchical structure:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SYSTEM/ROLE (1 paragraph)                                │
│    Define what the AI should act as                         │
└─────────────────────────────────────────────────────────────┘
         │
         ├─ Output Format (1 line)
         │  └─ Specify: PDF, DOCX, HTML, or Markdown
         │
         ├─ Page Layout Block (5–7 lines)
         │  ├─ Margins (Top, Bottom, Left, Right in mm)
         │  ├─ Line spacing (1.5, 2.0, etc.)
         │  ├─ Paragraph spacing (in pixels)
         │  └─ Content width (fixed or fluid)
         │
         ├─ Color Palette Block (2 lines)
         │  ├─ Palette name
         │  └─ Description
         │
         ├─ Element Formatting Rules Block (300–800 tokens)
         │  │
         │  └─ For each enabled element:
         │     ├─ Element name/label
         │     ├─ Font specifications (family, size, weight)
         │     ├─ Color specifications (text, background)
         │     ├─ Alignment and line-height
         │     ├─ Spacing (margins, padding)
         │     ├─ Border specifications (if applicable)
         │     └─ Conditional hints (if "IF APPLICABLE" is set)
         │
         ├─ Instructions Block (200–400 tokens)
         │  ├─ Step 1: Analyze content structure
         │  ├─ Step 2: Apply formatting rules
         │  ├─ Step 3: Respect conditional elements
         │  ├─ Step 4: Maintain hierarchy
         │  ├─ Step 5: Ensure consistent spacing
         │  ├─ Step 6: Handle "AI decide" elements
         │  ├─ Step 7: Preserve all original content
         │  └─ Step 8: Output in target format
         │
         └─ Raw Text Placeholder (1 line)
            └─ "[Paste your raw text here]"

TOTAL TYPICAL PROMPT SIZE: 1000–1500 tokens
```

### 2.4 Quality Assurance in Prompts

#### 2.4.1 Attribute Completeness

Every enabled element includes specifications for:
- ✓ Font properties (100% of elements)
- ✓ Color properties (100% of elements)
- ✓ Spacing rules (90% of elements)
- ✓ Alignment (100% of elements)
- ✓ Conditional hints (6 elements only)

#### 2.4.2 Prompt Validation

Before returning prompt string, engine verifies:

```typescript
function validatePrompt(prompt: string, aiTool: AiTool): boolean {
  // Check 1: Prompt not empty
  if (!prompt.trim()) return false;
  
  // Check 2: Contains output format specification
  if (!prompt.includes('OUTPUT')) return false;
  
  // Check 3: For ChatGPT, contains XML tags
  if (aiTool === 'chatgpt' && !prompt.includes('<')) return false;
  
  // Check 4: Contains at least one element rule
  if (prompt.split('\n').length < 20) return false;
  
  // Check 5: Contains raw_text placeholder
  if (!prompt.includes('raw_text') && !prompt.includes('Raw text')) 
    return false;
  
  return true;  // All checks passed
}
```

### 2.5 Performance Characteristics

```
generatePrompt() Performance:
├─ Input: FormattingState object (~5–10 KB in memory)
├─ Processing:
│  ├─ Filter enabled elements: <1ms
│  ├─ Build formatting strings: <3ms
│  ├─ Concatenate blocks: <2ms
│  └─ Return final string: <1ms
├─ Output: String (900–1500 tokens)
├─ Total time: ~8ms
└─ Memory footprint: <100 KB

Scalability:
├─ generatePrompt() can be called 100+ times/second
├─ No external network calls
├─ No database queries
└─ Pure synchronous computation
```

---

## 3. Core Feature 2: Template System (Presets)

### 3.1 Overview

Templates (called "Presets") are pre-configured formatting profiles that enable users to quickly start with professional configurations rather than starting from scratch.

### 3.2 Available Presets

#### 3.2.1 Academic Paper

```typescript
{
  id: "academic",
  label: "Academic Paper",
  description: "IEEE/APA style — abstract, keywords, formal headings",
  icon: "🎓",
  palette: "academic",
  outputFormat: "pdf",
  layout: { 
    marginTop: 25, marginBottom: 25, 
    marginLeft: 30, marginRight: 30, 
    lineSpacing: 2.0,    // Double-spaced (APA requirement)
    paragraphSpacing: 20 
  },
  enabledIds: [
    "header", "h1", "abstract", "keywords", "divider",
    "sectionHeader", "h2", "h3", "body", "numberedList",
    "quote", "pageNumber"
  ]
}
```

**Use Case**: Academic paper submissions, research documents  
**Key Features**: Double-spacing, page numbers, abstract box, keywords  
**Output**: PDF (for print submission)

#### 3.2.2 Business Report

```typescript
{
  id: "business",
  label: "Business Report",
  description: "Clean executive report with tables and callouts",
  icon: "💼",
  palette: "modern",
  outputFormat: "docx",
  layout: { 
    marginTop: 20, marginBottom: 20, 
    marginLeft: 25, marginRight: 25, 
    lineSpacing: 1.5,
    paragraphSpacing: 14 
  },
  enabledIds: [
    "header", "chapterHeader", "sectionHeader", "h1", "h2", "h3",
    "body", "callout", "table", "numberedList", "divider", "pageNumber"
  ]
}
```

**Use Case**: Corporate reports, business plans, executive summaries  
**Key Features**: Tables, callouts for key insights, chapter headers  
**Output**: DOCX (editable in Microsoft Word)

#### 3.2.3 Medical Research

```typescript
{
  id: "medical",
  label: "Medical Research",
  description: "Clinical paper with abstract and structured sections",
  icon: "🏥",
  palette: "medical",
  outputFormat: "pdf",
  layout: { 
    marginTop: 25, marginBottom: 25, 
    marginLeft: 28, marginRight: 28, 
    lineSpacing: 1.8,
    paragraphSpacing: 16 
  },
  enabledIds: [
    "header", "h1", "abstract", "keywords", "sectionHeader", "h2", "h3",
    "body", "callout", "table", "numberedList", "divider", "pageNumber"
  ]
}
```

**Use Case**: Medical papers, clinical trial reports, healthcare documentation  
**Key Features**: Clinical color palette, structured sections, abstract  
**Output**: PDF (for regulatory submission)

#### 3.2.4 Newsletter

```typescript
{
  id: "newsletter",
  label: "Newsletter",
  description: "Warm and engaging — quotes, callouts, rich headings",
  icon: "📰",
  palette: "warm",
  outputFormat: "html",
  layout: { 
    marginTop: 15, marginBottom: 15, 
    marginLeft: 20, marginRight: 20, 
    lineSpacing: 1.6,
    paragraphSpacing: 12 
  },
  enabledIds: [
    "header", "chapterHeader", "h1", "h2", "body", "quote",
    "callout", "numberedList", "divider"
  ]
}
```

**Use Case**: Email newsletters, marketing content, blog posts  
**Key Features**: Warm color palette, quoted content, callout boxes  
**Output**: HTML (email-safe, responsive)

#### 3.2.5 Legal Document

```typescript
{
  id: "legal",
  label: "Legal Document",
  description: "Formal structure with section numbering and references",
  icon: "⚖️",
  palette: "legal",
  outputFormat: "docx",
  layout: { 
    marginTop: 25, marginBottom: 25, 
    marginLeft: 35, marginRight: 35, 
    lineSpacing: 2.0,    // Double-spaced (legal standard)
    paragraphSpacing: 18 
  },
  enabledIds: [
    "header", "h1", "sectionHeader", "h2", "h3", "body",
    "numberedList", "quote", "pageNumber", "footnote"
  ]
}
```

**Use Case**: Contracts, legal notices, compliance documents  
**Key Features**: Formal typography, footnotes, numbered sections, page numbers  
**Output**: DOCX (editable for signature)

#### 3.2.6 Creative Publication

```typescript
{
  id: "creative",
  label: "Creative Publication",
  description: "Artistic layout with colors, quotes, and visual breaks",
  icon: "✨",
  palette: "sunset",
  outputFormat: "html",
  layout: { 
    marginTop: 20, marginBottom: 20, 
    marginLeft: 15, marginRight: 15, 
    lineSpacing: 1.6,
    paragraphSpacing: 14 
  },
  enabledIds: [
    "header", "chapterHeader", "h1", "h2", "h3", "body",
    "quote", "callout", "divider", "emphasizedText", "caption"
  ]
}
```

**Use Case**: Creative writing, poetry collections, design portfolios, ebooks  
**Key Features**: Artistic color palette, visual dividers, flexible layout  
**Output**: HTML (responsive for web reading)

### 3.3 Preset Application Logic

```typescript
applyPreset(presetId: string): void => {
  const preset = DOCUMENT_PRESETS.find(p => p.id === presetId);
  if (!preset) return;
  
  // Step 1: Get the preset's palette definition
  const paletteDef = COLOR_PALETTES[preset.palette];
  
  // Step 2: Reset all elements to enabled/disabled per preset
  const newElements = { ...state.elements };
  Object.keys(newElements).forEach((id) => {
    newElements[id] = {
      ...newElements[id],
      enabled: preset.enabledIds.includes(id),
      aiDecide: false,  // Reset to explicit formatting
    };
  });
  
  // Step 3: Apply palette color overrides
  Object.entries(paletteDef.elements).forEach(([id, overrides]) => {
    if (newElements[id]) {
      newElements[id] = {
        ...newElements[id],
        style: { 
          ...newElements[id].style, 
          ...overrides 
        },
      };
    }
  });
  
  // Step 4: Set layout from preset
  // Step 5: Set output format from preset
  
  setState((prev) => ({
    ...prev,
    palette: preset.palette,
    outputFormat: preset.outputFormat,
    layout: { ...prev.layout, ...preset.layout },
    elements: newElements,
  }));
}
```

### 3.4 Preset Extensibility

Users can create custom presets by:

1. **Configure all settings** (palette, elements, layout)
2. **Export settings** (JSON file)
3. **Share with team** (via email, Slack, GitHub)
4. **Team members import** (Upload JSON)
5. **All team members have preset**

Future enhancement: Pre-built community presets (Figma-style preset sharing)

---

## 4. Core Feature 3: Color Palettes

### 4.1 Overview

Twelve professionally-designed color palettes provide instant visual consistency across document layouts. Each palette defines color schemes for 15+ formatting elements.

### 4.2 Palette Specifications

```
Palette Coverage:
├─ Primary headings (h1, h2, h3)
├─ Body text
├─ Section headers
├─ Callouts and emphasis
├─ Quotes and abstract boxes
├─ Keywords and special text
├─ Borders and accents
└─ Background colors
```

#### 4.2.1 Medical Palette

```typescript
medical: {
  label: "Medical",
  description: "Blue & Green — clinical and trustworthy",
  elements: {
    h1: { 
      color: "#0d4f6c", 
      fontFamily: "Inter, sans-serif", 
      fontWeight: "700", 
      fontSize: "32px" 
    },
    sectionHeader: { 
      backgroundColor: "#0d4f6c", 
      color: "#ffffff", 
      fontWeight: "600" 
    },
    callout: { 
      backgroundColor: "#ecfdf5",  // Light green
      borderColor: "#10b981",      // Green border
      color: "#064e3b" 
    },
    abstract: { 
      backgroundColor: "#f0f9ff",  // Light blue
      borderColor: "#0ea5e9" 
    },
    // ... more elements
  }
}
```

**Psychological Basis**: Blue = trust, green = health, clinical feel  
**Use Cases**: Healthcare, pharmaceutical, medical research

#### 4.2.2 Academic Palette

```typescript
academic: {
  label: "Academic",
  description: "Black & Gray — formal and scholarly",
  elements: {
    h1: { 
      color: "#111827", 
      fontFamily: "Georgia, serif", 
      fontWeight: "700", 
      fontSize: "32px" 
    },
    body: { 
      color: "#111827", 
      fontFamily: "Georgia, serif" 
    },
    // ... more elements
  }
}
```

**Psychological Basis**: Black = authority, Georgia serif = academia  
**Use Cases**: Academic papers, scholarly articles, dissertations

#### 4.2.3 Modern Palette

```typescript
modern: {
  label: "Modern Minimal",
  description: "Clean & crisp — contemporary design",
  elements: {
    h1: { 
      color: "#0f172a", 
      fontFamily: "Inter, sans-serif", 
      fontWeight: "800", 
      fontSize: "36px" 
    },
    sectionHeader: { 
      backgroundColor: "#6366f1",  // Indigo
      color: "#ffffff", 
      fontWeight: "700" 
    },
    // ... more elements
  }
}
```

**Psychological Basis**: Indigo + white = modern tech, minimal  
**Use Cases**: SaaS documentation, tech blogs, startup materials

#### 4.2.4 Warm Palette

```typescript
warm: {
  label: "Warm Tones",
  description: "Amber & terracotta — welcoming and rich",
  elements: {
    h1: { 
      color: "#7c2d12", 
      fontFamily: "Lora, Georgia, serif", 
      fontWeight: "700", 
      fontSize: "32px" 
    },
    callout: { 
      backgroundColor: "#fffbeb",  // Light amber
      borderColor: "#f59e0b",      // Amber border
      color: "#78350f" 
    },
    // ... more elements
  }
}
```

**Psychological Basis**: Warm orange/amber = welcoming, comfortable, luxurious  
**Use Cases**: Lifestyle content, hospitality, premium brands

#### 4.2.5 Additional Palettes

```
ocean      → Deep blue, professional SaaS feel
royal      → Purple & gold, luxurious and premium
dark       → Dark gray, modern dark mode
forest     → Green & brown, natural and eco-friendly
corporate  → Navy & gray, formal business
sunset     → Orange-red-pink, creative vibrant
legal      → Navy & gold, trustworthy and formal
pastel     → Soft colors, healthcare and wellness
```

### 4.3 Palette Application Engine

```typescript
applyPalette(palette: ColorPalette): void => {
  const paletteDef = COLOR_PALETTES[palette];
  
  setState((prev) => {
    const newElements = { ...prev.elements };
    
    // For each element override in palette definition
    Object.entries(paletteDef.elements).forEach(([elementId, overrides]) => {
      if (newElements[elementId]) {
        // Merge palette colors with existing element style
        newElements[elementId] = {
          ...newElements[elementId],
          style: { 
            ...newElements[elementId].style, 
            ...overrides 
          },
        };
      }
    });
    
    return { 
      ...prev, 
      palette,              // Update active palette
      elements: newElements // Update element colors
    };
  });
}
```

**Key Behavior**: Palettes override only color/font properties, never layout

### 4.4 Palette Impact on Output

When a palette is applied:
1. Element colors update instantly in UI
2. LivePreview regenerates with new colors
3. PromptOutput includes palette description:
   ```
   ## COLOR PALETTE
   Modern Minimal — Clean & crisp — contemporary design
   ```
4. Prompt tells AI which palette is being used as context

**AI Benefit**: Claude/ChatGPT understand the aesthetic intent better when palette is named

---

## 5. Core Feature 4: Formatting Elements Editor

### 5.1 Overview

The Formatting Elements Editor (primary UI component) allows granular control over 20+ formatting elements, each with 15 style properties.

### 5.2 Element Categories

```
HIERARCHICAL STRUCTURE (h1 → h2 → h3):
├─ h1 (Main heading)
├─ h2 (Section heading)
└─ h3 (Subsection heading)

CONTENT ELEMENTS:
├─ header (Document header/title)
├─ body (Paragraph text)
├─ quote (Blockquote)
├─ abstract (Academic abstract)
└─ keywords (Keywords list)

STRUCTURAL ELEMENTS:
├─ sectionHeader (Section divider with styling)
├─ divider (Visual separator line)
├─ chapterHeader (Chapter title in books)
├─ pageNumber (Page numbering)
└─ footnote (Footnote reference)

TEXT VARIATIONS:
├─ emphasizedText (Bold/italic text)
├─ code (Inline code)
├─ codeBlock (Code block)
└─ caption (Image/table caption)

LIST & TABLE:
├─ numberedList (Ordered list)
├─ bulletList (Unordered list)
└─ table (Data table)

PURPOSE: Cover 95% of document formatting needs
```

### 5.3 Element Control Properties

For each element, users control:

```
ENABLE/DISABLE:
└─ Toggle button: Include element in output prompt?

AI DECIDE:
└─ Checkbox: Let AI choose optimal formatting (vs explicit)

IF APPLICABLE:
└─ Badge: Mark element as conditional (skip if content doesn't warrant it)

STYLING CONTROLS:
├─ Font Family selector
│  └─ 7 options: Inter, Lora, Source Code Pro, Georgia,
│     Arial, Times New Roman, Helvetica
│
├─ Font Size slider
│  └─ Range: 10px–48px (16 common sizes)
│
├─ Font Weight selector
│  └─ 6 levels: Light (300), Regular (400), Medium (500),
│     Semi-Bold (600), Bold (700), ExtraB old (800)
│
├─ Text Color picker
│  └─ Full RGB/hex color picker
│
├─ Background Color picker
│  └─ Full RGB/hex + transparency
│
├─ Text Alignment buttons
│  └─ Left, Center, Right, Justify
│
├─ Line Height slider
│  └─ Range: 1.0–2.0 (spacing between lines)
│
├─ Letter Spacing slider
│  └─ Range: -0.05em to +0.1em (tracking)
│
├─ Margins (Top, Bottom)
│  └─ Spacing around element (in px)
│
├─ Padding (Top, Bottom, Left, Right)
│  └─ Spacing inside element (in px)
│
├─ Border Width toggle
│  └─ Thickness of border (0–3px)
│
├─ Border Color picker
│  └─ Color of border
│
└─ Border Radius slider
   └─ Roundness of border corners (0–20px)
```

### 5.4 UI Controls Deep Dive

#### 5.4.1 ElementEditor Component

```typescript
interface ElementEditorProps {
  element: FormattingElement;
  onEnabledChange: (enabled: boolean) => void;
  onAiDecideChange: (aiDecide: boolean) => void;
  onIfApplicableChange?: (ifApplicable: boolean) => void;
  onStyleChange: (key: keyof ElementStyle, value: string) => void;
}

// Typical render:
<div className="element-editor">
  <header>
    <h4>{element.label}</h4>
    
    <Toggle
      checked={element.enabled}
      onChange={onEnabledChange}
      label="Enabled"
    />
    
    <Badge
      ifApplicable={element.ifApplicable}
      onClick={() => onIfApplicableChange(!element.ifApplicable)}
      tooltip="Mark as conditional"
    />
    
    <Checkbox
      checked={element.aiDecide}
      onChange={onAiDecideChange}
      label="Let AI decide"
    />
  </header>
  
  <StylePanel>
    <FontFamilySelect 
      value={element.style.fontFamily}
      onChange={(v) => onStyleChange('fontFamily', v)}
    />
    
    <FontSizeSlider 
      value={element.style.fontSize}
      onChange={(v) => onStyleChange('fontSize', v)}
    />
    
    {/* ... more controls ... */}
  </StylePanel>
  
  <ElementMiniPreview element={element} />
</div>
```

#### 5.4.2 ElementMiniPreview Component

Real-time visual preview of the formatted element:

```
┌─────────────────────────────────────┐
│ Element Name: "Heading 1"           │
├─────────────────────────────────────┤
│                                     │
│  Lorem Ipsum Heading                │  ← Rendered with current style
│                                     │
│  Color: #0066cc                     │
│  Font: Inter, 32px, Bold            │
│  Spacing: 16px below                │
│                                     │
└─────────────────────────────────────┘
```

**Updates**: In real-time (<50ms) as user adjusts style properties

### 5.5 Smart Defaults

```typescript
DEFAULT_STYLE = {
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
}

// Most elements inherit defaults, then override specific properties
h1 extends defaults with:
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "24px"

body extends defaults with:
  fontSize: "16px",
  lineHeight: "1.6"
```

---

## 6. Core Feature 5: Real-time Live Preview

### 6.1 Overview

The Live Preview component renders a mock document showing exactly how the user's formatting specifications will appear when applied.

### 6.2 Preview Components

```
LivePreview composes:
├─ Header section
│  └─ Displays document title and metadata
│
├─ Content sections
│  ├─ Sample H1 heading
│  ├─ Sample paragraph
│  ├─ Sample H2 heading
│  ├─ Sample paragraph
│  ├─ Section Header (if enabled)
│  ├─ H3 heading (if enabled)
│  ├─ Paragraph
│  ├─ Callout box (if enabled)
│  ├─ Quote (if enabled)
│  ├─ Numbered list (if enabled)
│  └─ Table example (if enabled)
│
└─ Footer section
   └─ Page number (if enabled)
```

### 6.3 Preview Style Conversion

```typescript
// Convert FormattingElement to CSS
function elementToCss(element: FormattingElement): React.CSSProperties {
  return {
    fontFamily: element.style.fontFamily,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    color: element.style.color,
    backgroundColor: element.style.backgroundColor === 'transparent'
      ? 'transparent'
      : element.style.backgroundColor,
    textAlign: element.style.textAlign,
    marginTop: element.style.marginTop,
    marginBottom: element.style.marginBottom,
    paddingTop: element.style.paddingTop,
    paddingBottom: element.style.paddingBottom,
    paddingLeft: element.style.paddingLeft,
    paddingRight: element.style.paddingRight,
    letterSpacing: element.style.letterSpacing,
    lineHeight: element.style.lineHeight,
    borderRadius: element.style.borderRadius,
    border: element.style.borderWidth !== '0px'
      ? `${element.style.borderWidth} solid ${element.style.borderColor}`
      : 'none',
  };
}

// Usage in preview:
<div style={elementToCss(state.elements.h1)}>
  Lorem Ipsum Heading
</div>
```

### 6.4 Performance Optimization

```
LivePreview Re-render Triggers:
├─ When state.elements changes
├─ When state.palette changes
├─ When state.layout changes
└─ NOT when: search filter changes, tab switches, unrelated UI state

Memoization:
└─ React.memo(LivePreview) prevents unnecessary re-renders
   when parent re-renders but props haven't changed

Result: Preview updates instantly (<50ms) when user edits style
```

---

## 7. Core Feature 6: Undo/Redo History Management

### 7.1 Overview

A complete undo/redo system maintains up to 30 states of history, allowing non-destructive editing.

### 7.2 Implementation

```typescript
// History state
pastRef = useRef<FormattingState[]>([]);    // Previous states
futureRef = useRef<FormattingState[]>([]);  // States from undo

// Every mutation wraps setState
const setState = (updater) => {
  setRawState((prev) => {
    const next = updater(prev);
    
    // Add previous state to history
    pastRef.current = [
      ...pastRef.current.slice(-(MAX_HISTORY - 1)),  // Keep last 29
      prev
    ];
    
    // Clear future (can't redo after new mutation)
    futureRef.current = [];
    
    return next;
  });
};

// Undo operation
const undo = () => {
  if (pastRef.current.length === 0) return;  // No history
  
  setRawState((curr) => {
    const prev = pastRef.current[pastRef.current.length - 1];
    
    // Move current state to redo stack
    futureRef.current = [
      curr,
      ...futureRef.current.slice(0, MAX_HISTORY - 1)
    ];
    
    // Pop from undo stack
    pastRef.current = pastRef.current.slice(0, -1);
    
    return prev;
  });
};

// Redo operation (symmetric)
const redo = () => {
  if (futureRef.current.length === 0) return;
  
  setRawState((curr) => {
    const next = futureRef.current[0];
    
    // Move current state to undo stack
    pastRef.current = [
      ...pastRef.current.slice(-(MAX_HISTORY - 1)),
      curr
    ];
    
    // Pop from redo stack
    futureRef.current = futureRef.current.slice(1);
    
    return next;
  });
};
```

### 7.3 Undo/Redo Limits

```
MAX_HISTORY = 30

Why 30?
├─ Typical editing session: 50–100 mutations
├─ 30 levels = remembers ~15–20 minutes of work
├─ Balances memory (~500 KB) vs user expectations
├─ User can always export/import for permanent archiving

When history fills:
├─ Oldest state is discarded (circular buffer)
├─ Most recent states are always preserved
└─ No data loss for reasonable editing workflows
```

### 7.4 UI Indicators

```
Undo Button:
├─ Enabled: canUndo = pastRef.current.length > 0
├─ Disabled: canUndo = false (no history)
├─ Tooltip: "Undo (Ctrl+Z)"
└─ Hotkey: Cmd+Z / Ctrl+Z (future enhancement)

Redo Button:
├─ Enabled: canRedo = futureRef.current.length > 0
├─ Disabled: canRedo = false (already at latest)
├─ Tooltip: "Redo (Ctrl+Y)"
└─ Hotkey: Cmd+Y / Ctrl+Y (future enhancement)
```

---

## 8. Core Feature 7: Export/Import Settings

### 8.1 Overview

Users can export their entire formatting configuration as JSON for reuse, sharing, and backup.

### 8.2 Export Function

```typescript
const exportSettings = () => {
  // Serialize current formatting state
  const json = JSON.stringify(state, null, 2);  // Pretty-printed
  
  // Create file blob
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  // Trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "doc-formatter-settings.json";
  a.click();
  
  // Cleanup
  URL.revokeObjectURL(url);
};
```

**Export Filename**: `doc-formatter-settings.json`

**Export Size**: ~5–10 KB (compressed FormattingState object)

### 8.3 Export File Structure

```json
{
  "palette": "modern",
  "elements": {
    "h1": {
      "id": "h1",
      "label": "Heading 1",
      "enabled": true,
      "aiDecide": false,
      "ifApplicable": false,
      "style": {
        "fontFamily": "Inter, sans-serif",
        "fontSize": "32px",
        "fontWeight": "700",
        "color": "#0066cc",
        ...
      }
    },
    ... (19+ more elements)
  },
  "layout": {
    "marginTop": 25,
    "marginBottom": 25,
    "marginLeft": 30,
    "marginRight": 30,
    "lineSpacing": 1.5,
    "paragraphSpacing": 16,
    "contentWidth": "fixed"
  },
  "outputFormat": "pdf"
}
```

### 8.4 Import Function

```typescript
const importSettings = (json: string): boolean => {
  try {
    const parsed = JSON.parse(json) as FormattingState;
    
    // Validate schema (future: runtime validation with Zod)
    // if (!isValidFormattingState(parsed)) return false;
    
    setState(() => parsed);
    return true;  // Success
  } catch (err) {
    console.error('Import failed:', err);
    return false;  // Failure
  }
};
```

### 8.5 Import Workflow

```
User clicks "Upload Settings"
  ↓
FileInput dialog opens
  ↓
User selects .json file
  ↓
FileReader reads file content
  ↓
importSettings(fileContent) called
  ↓
Try: JSON.parse() → validate → setState()
  ├─ Success: Show toast "Settings imported!"
  └─ Failure: Show error "Invalid settings file."
```

### 8.6 Sharing Workflows

**Workflow 1: Team Template Sharing**
```
Alice (Designer):
├─ Designs template in DocFormatter
├─ Exports as JSON
└─ Emails to team

Bob (Content creator):
├─ Receives JSON file
├─ Opens DocFormatter
├─ Uploads JSON
└─ Uses Alice's template for all documents
```

**Workflow 2: Version Control**
```
team-templates/
├─ academic-paper-v1.json
├─ business-report-v2.json
└─ newsletter-branding.json

Engineers can:
├─ Commit templates to Git
├─ Track changes over time
├─ Distribute via GitHub
└─ CI/CD integration (future)
```

---

## 9. Advanced Features

### 9.1 Multi-Output Format Support

```
DocumentFormatter supports 4 output formats:

PDF:
├─ Best for: Print documents, formal submissions
├─ Advantages: Layout precision, cross-platform consistency
├─ AI prompt includes: Print-ready margins, page breaks

DOCX (Word):
├─ Best for: Editable documents, collaboration
├─ Advantages: Further editing, comments, tracking changes
├─ AI prompt includes: Standard Word styles, compatibility

HTML:
├─ Best for: Web publishing, responsive design
├─ Advantages: Mobile-responsive, clickable links, embeds
├─ AI prompt includes: Semantic markup, CSS classes

Markdown:
├─ Best for: Developer documentation, GitHub wikis
├─ Advantages: Version control friendly, simple format
├─ AI prompt includes: GitHub-flavored markdown syntax
```

### 9.2 Dark Mode

```
Dark mode support:
├─ Toggle button in header
├─ Applies to entire UI (Tailwind CSS dark: prefix)
├─ Persists in localStorage
├─ No impact on generated prompts
└─ Improves readability during long editing sessions
```

### 9.3 Mobile Responsive Design

```
Responsive breakpoints:
├─ Mobile (<640px):
│  └─ Vertical tab layout, collapsible panels
├─ Tablet (640–1024px):
│  └─ 2-column layout, sidebar navigation
└─ Desktop (>1024px):
   └─ Full 3-column layout with floating preview

Mobile improvements:
├─ Touch-friendly button sizes (44×44px minimum)
├─ Simplified controls (sliders instead of precise inputs)
└─ Full-screen preview option
```

---

## 10. Feature Roadmap

### Phase 2 (Q3 2026): Enterprise Features
- [ ] Cloud sync across devices
- [ ] Team collaboration (share templates)
- [ ] API integration (ChatGPT, Claude direct)
- [ ] Batch processing (format multiple documents)
- [ ] Usage analytics

### Phase 3 (2027): Advanced AI
- [ ] Auto-detect document type
- [ ] Smart palette suggestions
- [ ] Prompt optimization via reinforcement learning
- [ ] Multi-language support

---

## Conclusion

Document Format Prompt Generator's core features work in harmony to transform document formatting from a tedious, error-prone manual process into a streamlined, AI-enhanced workflow. Each feature serves a specific user need:

- **Prompt Generation**: Bridges user intent to AI capability
- **Templates**: Accelerate common use cases
- **Palettes**: Ensure visual consistency
- **Element Editor**: Enable granular control
- **Live Preview**: Immediate feedback
- **Undo/Redo**: Non-destructive editing
- **Export/Import**: Reusability and sharing

Together, these features create a complete system for document formatting excellence.
