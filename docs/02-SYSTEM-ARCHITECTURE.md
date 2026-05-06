# Document Format Prompt Generator — System Architecture

**Version:** 1.0.0  
**Document Type:** Technical Architecture  
**Audience:** Senior Engineers, Architects  
**Last Updated:** May 2026

---

## 1. High-Level Architecture Overview

### System Composition

The Document Format Prompt Generator is composed of five interconnected layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  Template Selector│  │ Element Editor   │  │ LivePreview  │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  Palette Manager │  │ Layout Controls  │  │ Export Modal │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
┌──────────────────────────────────┴───────────────────────────────┐
│                      STATE MANAGEMENT LAYER                      │
│                  React Context + Custom Hooks                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  FormattingContext Provider                             │    │
│  │  ├─ FormattingState (palette, elements, layout)         │    │
│  │  ├─ useFormattingState Hook (mutations, undo/redo)      │    │
│  │  └─ HistoryManager (past/future stacks)                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
┌──────────────────────────────────┴───────────────────────────────┐
│                      BUSINESS LOGIC LAYER                        │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Prompt Generation Engine                              │     │
│  │  ├─ buildPromptForChatGPT()                            │     │
│  │  ├─ buildPromptForClaude()                             │     │
│  │  ├─ buildPromptForGemini()                             │     │
│  │  └─ promptContext assembly                             │     │
│  └────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Data Model Transformations                            │     │
│  │  ├─ ElementStyle → CSS strings                         │     │
│  │  ├─ FormattingState → PromptContext                    │     │
│  │  ├─ Palette application logic                          │     │
│  │  └─ Preset resolution                                  │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
┌──────────────────────────────────┴───────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ COLOR_PALETTES │  │ DOCUMENT_PRESETS │  │ DefaultElements  │ │
│  │ (12 palettes)  │  │ (6+ presets)     │  │ (20+ formatters) │ │
│  └────────────────┘  └──────────────────┘  └──────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  LocalStorage Persistence                              │     │
│  │  ├─ Formatting state  (JSON)                           │     │
│  │  ├─ User preferences                                   │     │
│  │  └─ History stacks (for undo/redo across sessions)     │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
┌──────────────────────────────────┴───────────────────────────────┐
│                      DEPLOYMENT LAYER                           │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Vite Build System                                     │     │
│  │  ├─ React 18 client-side rendering                     │     │
│  │  ├─ No backend API (read-only, client-side only)       │     │
│  │  └─ Static asset deployment                            │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Architectural Patterns

### 2.1 Frontend Architecture: React Component Tree

```
App.tsx
├── Router (wouter)
│   ├── Home.tsx (Main UI)
│   │   ├── Header
│   │   │   ├── Logo & Title
│   │   │   ├── Undo/Redo/Reset
│   │   │   ├── Theme Toggle
│   │   │   └── Settings
│   │   │
│   │   ├── TabPanel (activeTab: 'elements' | 'layout' | 'output')
│   │   │   │
│   │   │   ├─ Tab 1: Elements
│   │   │   │  ├── SearchBar
│   │   │   │  ├── ElementList
│   │   │   │  │  └── ElementEditor (repeated for each element)
│   │   │   │  │     ├── Toggle (enabled/disabled)
│   │   │   │  │     ├── Conditional Badge
│   │   │   │  │     ├── "AI Decide" toggle
│   │   │   │  │     ├── StyleEditor
│   │   │   │  │     │  ├── FontFamily selector
│   │   │   │  │     │  ├── FontSize slider
│   │   │   │  │     │  ├── FontWeight selector
│   │   │   │  │     │  ├── Color picker
│   │   │   │  │     │  ├── Background picker
│   │   │   │  │     │  ├── Spacing controls
│   │   │   │  │     │  ├── TextAlign controls
│   │   │   │  │     │  ├── LineHeight slider
│   │   │   │  │     │  └── Border controls
│   │   │   │  │     └── ElementMiniPreview
│   │   │   │  │
│   │   │   │  └── Preset selector
│   │   │   │
│   │   │   ├─ Tab 2: Layout
│   │   │   │  ├── LayoutControls
│   │   │   │  │  ├── Margin editors (Top, Bottom, L, R)
│   │   │   │  │  ├── LineSpacing slider
│   │   │   │  │  ├── ParagraphSpacing input
│   │   │   │  │  └── ContentWidth selector
│   │   │   │  └── ColorPaletteSelector
│   │   │   │     └── PaletteCard (repeated for each palette)
│   │   │   │
│   │   │   └─ Tab 3: Output
│   │   │      ├── PromptOutput
│   │   │      │  ├── AI Tool tabs (ChatGPT | Claude | Gemini)
│   │   │      │  ├── CopyButton
│   │   │      │  └── PromptDisplay (monospace, scrollable)
│   │   │      └── ExportOptions
│   │   │         ├── Download JSON
│   │   │         ├── Download Prompt
│   │   │         └── Upload JSON
│   │   │
│   │   ├── FloatingPreview (fixed position)
│   │   │  └── LivePreview Widget
│   │   │
│   │   └── ActionBar (bottom fixed)
│   │      ├── ShowPrompt toggle
│   │      └── Format selector
│   │
│   ├── PreviewPage.tsx (Full-screen preview)
│   │  └── LivePreview (full size)
│   │
│   └── NotFound.tsx
│
├── FormattingProvider (Context)
│   └── useFormatting hook
│
├── QueryClientProvider (React Query)
│
├── TooltipProvider (Radix UI)
│   └── Toaster (Toast notifications)
│
└── Theme Toggle (light/dark mode)
```

### 2.2 State Management Flow

```
User Action (e.g., "Change H1 Color to Blue")
    ↓
Event Handler (onClick, onChange, etc.)
    ↓
useFormatting() Hook Call
    │
    ├─ updateElementStyle(id, key, value)
    │   ↓
    │ setState((prev) => ({
    │   ...prev,
    │   elements: {
    │     ...prev.elements,
    │     [id]: {
    │       ...prev.elements[id],
    │       style: {
    │         ...prev.elements[id].style,
    │         [key]: value
    │       }
    │     }
    │   }
    │ }))
    │   ↓
    ├─ History tracking (past/future stacks)
    │   pastRef = [...pastRef, previousState]
    │   futureRef = []
    │
    ├─ Save to localStorage
    │   localStorage.setItem('formatting-state', JSON.stringify(newState))
    │
    └─ Trigger React re-render
        ↓
    ElementEditor component receives new style props
        ↓
    ElementMiniPreview updates
        ↓
    LivePreview regenerates
        ↓
    PromptOutput regenerates with new prompt
        ↓
    UI reflects changes (sub-100ms update)
```

---

## 3. Data Model Architecture

### 3.1 Core Type System

```typescript
// ┌─ Top-level state ─┐
FormattingState {
  palette: ColorPalette              // Currently selected palette
  elements: Record<string, FormattingElement>  // All formatting rules
  layout: LayoutControls             // Page-level properties
  outputFormat: OutputFormat         // Target output (pdf|docx|html|md)
}

// ┌─ Individual formatting element ─┐
FormattingElement {
  id: string                         // Unique identifier (e.g., "h1", "abstract")
  label: string                      // Display name (e.g., "Heading 1")
  enabled: boolean                   // Whether element is included in prompt
  aiDecide: boolean                  // Let AI choose optimal formatting
  ifApplicable?: boolean             // Mark as conditional/optional
  style: ElementStyle                // Visual properties
}

// ┌─ All style properties for an element ─┐
ElementStyle {
  fontFamily: string                 // Font face
  fontSize: string                   // Size (e.g., "16px")
  fontWeight: string                 // Weight (300–800)
  color: string                      // Hex/RGB text color
  backgroundColor: string            // Background color
  textAlign: string                  // alignment (left|center|right|justify)
  marginTop: string                  // Margin sizes
  marginBottom: string
  paddingTop: string                 // Padding sizes
  paddingBottom: string
  paddingLeft: string
  paddingRight: string
  letterSpacing: string              // Character spacing
  lineHeight: string                 // Line height multiple
  borderRadius: string               // Corner radius
  borderColor: string                // Border styling
  borderWidth: string
}

// ┌─ Layout meta-properties ─┐
LayoutControls {
  marginTop: number                  // mm (document margins)
  marginBottom: number
  marginLeft: number
  marginRight: number
  lineSpacing: number                // Multiple (1.5, 2.0, etc.)
  paragraphSpacing: number           // pixels
  contentWidth: "fixed" | "fluid"    // Page width behavior
}

// ┌─ Reusable style collection ─┐
ColorPalette {
  label: string                      // Display name
  description: string                // Purpose description
  elements: Record<string, Partial<ElementStyle>>  // Overrides per-element
}

// ┌─ Template/preset configuration ─┐
DocumentPreset {
  id: string                         // Unique identifier
  label: string                      // User-facing name
  description: string                // Purpose
  icon: string                       // Emoji representation
  palette: ColorPalette              // Associated palette
  outputFormat: OutputFormat         // Recommended output format
  layout: Partial<LayoutControls>    // Preset layout options
  enabledIds: string[]               // Elements enabled by default
}
```

### 3.2 Type Variants

```
ColorPalette variants:
  ├─ medical (Blue & Green — clinical)
  ├─ academic (Black & Gray — formal)
  ├─ modern (Clean & minimal)
  ├─ warm (Amber & terracotta)
  ├─ ai (Auto-decide)
  ├─ ocean (Deep blue)
  ├─ royal (Purple & gold)
  ├─ dark (Dark slate)
  ├─ forest (Green & brown)
  ├─ corporate (Corporate gray)
  ├─ sunset (Orange & red)
  ├─ legal (Navy & gold)
  └─ pastel (Soft pastel colors)

OutputFormat variants:
  ├─ pdf (Adobe PDF)
  ├─ docx (Microsoft Word)
  ├─ html (Web page)
  └─ markdown (GitHub-flavored Markdown)

AiTool variants:
  ├─ chatgpt (OpenAI ChatGPT)
  ├─ claude (Anthropic Claude)
  └─ gemini (Google Gemini)

FormattingElement IDs (20+):
  ├─ header (Document header)
  ├─ h1, h2, h3 (Heading levels)
  ├─ body (Body paragraph text)
  ├─ abstract (Academic abstract)
  ├─ keywords (Keyword list)
  ├─ sectionHeader (Section separator)
  ├─ callout (Highlighted callout box)
  ├─ quote (Blockquote)
  ├─ table (Data table)
  ├─ numberedList (Ordered list)
  ├─ bulletList (Unordered list)
  ├─ divider (Visual separator)
  ├─ chapterHeader (Chapter title)
  ├─ pageNumber (Pagination)
  ├─ footnote (Footnote reference)
  ├─ code (Inline code snippet)
  ├─ codeBlock (Multi-line code)
  ├─ emphasizedText (Bold/italic text)
  ├─ caption (Image/table caption)
  └─ and more...
```

---

## 4. Prompt Generation Pipeline

### 4.1 Execution Flow

```
                          generatePrompt(aiTool)
                                  │
                    ┌─────────────┼─────────────┐
                    │                           │
              (ChatGPT)                    (Claude/Gemini)
                    │                           │
        ┌───────────┴──────────┐      ┌────────┴──────────┐
        │                      │      │                   │
    Format: XML            Format: Markdown        Format: Markdown
    └───────────┬──────────┘      └────────┬──────────┘
                │                          │
                │ Filter Enabled Elements  │
                │ ├─ For each element      │
                │ └─ Only include if enabled
                │
                ├─ Build Formatting String
                │ ├─ Font properties
                │ ├─ Color properties
                │ ├─ Spacing rules
                │ ├─ Conditional hints
                │ └─ Border/styling rules
                │
                ├─ Build Layout Block
                │ ├─ Margin specification (mm)
                │ ├─ Line spacing
                │ ├─ Paragraph spacing
                │ └─ Content width
                │
                ├─ Build Palette Description
                │ └─ Selected palette name + description
                │
                └─ Build Instructions Block
                  ├─ Step-by-step formatting rules
                  ├─ Conditional application hints
                  ├─ Hierarchy maintenance rules
                  ├─ Content preservation rules
                  └─ Output format specification
                      │
                      ├─ ChatGPT: XML wrapper
                      │ <system>Role description</system>
                      │ <formatting_spec>...spec...</formatting_spec>
                      │ <raw_text>[Paste your text here]</raw_text>
                      │
                      └─ Claude/Gemini: Markdown
                        **Role:** Description
                        **Task:** Formatting instructions
                        **Output format:** Spec
                        ...spec...
                        ---
                        **Raw text to format:**
                        [Paste your text here]
                      
                      │
                      ↓
                Return formatted prompt string (typically 800–1500 tokens)
```

### 4.2 Conditional Element Logic

Certain elements are marked as "IF APPLICABLE" — they should only be included when the content naturally warrants them:

```
CONDITIONAL_HINTS = {
  callout: "ONLY if content contains key insight, warning, or note",
  quote: "ONLY if content contains notable quote or statement",
  abstract: "ONLY if document is academic/research-based",
  keywords: "ONLY if clear keywords can be identified",
  divider: "Use sparingly to separate major sections",
  chapterHeader: "ONLY if document is divided into chapters"
}

When building prompt:
1. Identify which elements are conditional
2. Include hint in formatting spec: "⚠ IF APPLICABLE: {hint}"
3. AI is explicitly instructed NOT to force/invent content
4. AI is told to skip element if content doesn't warrant it
```

### 4.3 Model-Specific Prompt Adaptation

```
ChatGPT Adaptation:
├─ Structured XML format (aligned with GPT's training)
├─ Explicit <system> role definition
├─ Clear <formatting_spec> boundaries
├─ XML tags help parsing and understanding
└─ Performs best with: Detailed specs, explicit examples

Claude Adaptation:
├─ Extended thinking friendly (multiple hierarchical levels)
├─ Natural language instructions (not XML)
├─ Explicit reasoning sections for complex formatting
├─ Constitutional AI prefers: Clear role + structured format
└─ Performs best with: Step-by-step reasoning, edge cases

Gemini Adaptation:
├─ Multimodal consideration (even though text-only here)
├─ Markdown formatting (Gemini's native preference)
├─ Task-first approach
├─ Emphasis on content preservation
└─ Performs best with: Simple, direct instructions
```

---

## 5. Component Interaction Diagram

```
                    ┌─────────────────────────────┐
                    │     FormattingProvider      │
                    │ (React Context.Provider)    │
                    │  value = useFormattingState │
                    └────────────┬────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼──────────┐ ┌────────▼──────────┐ ┌────────▼──────────┐
│   Home.tsx         │ │  PreviewPage.tsx  │ │   NotFound.tsx    │
└─────────┬──────────┘ └────────┬──────────┘ └───────────────────┘
          │                     │
          │          LivePreview (full-screen)
          │                     │
    ┌─────┼─────────────────────┘
    │     │
    │     └─ uses useFormatting()
    │         ├─ state: FormattingState
    │         ├─ mutations (updateElement, applyPalette, etc.)
    │         ├─ history (undo, redo)
    │         └─ generatePrompt(aiTool)
    │
    ├─ Header
    │  ├─ Logo
    │  ├─ Undo/Redo buttons
    │  ├─ Reset button
    │  ├─ Theme toggle
    │  └─ Settings menu
    │
    ├─ TabPanel (activeTab state)
    │  │
    │  ├─ Tab: "Elements"
    │  │  ├─ SearchBar
    │  │  │  └─ filters: .elements.filter(e => e.label.includes(search))
    │  │  │
    │  │  ├─ PresetsDropdown
    │  │  │  └─ applyPreset(presetId)
    │  │  │
    │  │  └─ ElementList
    │  │     └─ ElementEditor (for each element)
    │  │        ├─ EnableToggle
    │  │        │  └─ updateElementEnabled(id, enabled)
    │  │        │
    │  │        ├─ AiDecideToggle
    │  │        │  └─ updateElementAiDecide(id, aiDecide)
    │  │        │
    │  │        ├─ IfApplicableToggle (for conditional elements)
    │  │        │  └─ updateElementIfApplicable(id, ifApplicable)
    │  │        │
    │  │        ├─ StyleEditor
    │  │        │  ├─ FontFamilySelect
    │  │        │  │  └─ updateElementStyle(id, 'fontFamily', value)
    │  │        │  ├─ FontSizeSlider
    │  │        │  ├─ FontWeightSelect
    │  │        │  ├─ ColorPicker
    │  │        │  ├─ BackgroundPicker
    │  │        │  ├─ SpacingControls
    │  │        │  ├─ TextAlignButtons
    │  │        │  ├─ LineHeightSlider
    │  │        │  └─ BorderControls
    │  │        │
    │  │        └─ ElementMiniPreview
    │  │           └─ Renders: <div style={convertElementToCSS(element)}>
    │  │
    │  ├─ Tab: "Layout"
    │  │  ├─ LayoutControls
    │  │  │  ├─ MarginInputs (Top, Bottom, L, R)
    │  │  │  │  └─ updateLayout(key, value)
    │  │  │  ├─ LineSpacingSlider
    │  │  │  ├─ ParagraphSpacingInput
    │  │  │  └─ ContentWidthSelect
    │  │  │
    │  │  └─ ColorPaletteSelector
    │  │     └─ PaletteCard (for each palette)
    │  │        ├─ Palette preview
    │  │        ├─ Description
    │  │        └─ onClick: applyPalette(palette)
    │  │
    │  └─ Tab: "Output"
    │     ├─ PromptOutput component
    │     │  ├─ AiToolTabs
    │     │  │  ├─ ChatGPT button
    │     │  │  ├─ Claude button
    │     │  │  └─ Gemini button
    │     │  │     └─ setActiveTool(tool)
    │     │  │        └─ prompt = generatePrompt(tool)
    │     │  │
    │     │  ├─ CopyButton
    │     │  │  └─ navigator.clipboard.writeText(prompt)
    │     │  │
    │     │  └─ PromptDisplay
    │     │     └─ <pre> { prompt } </pre>
    │     │
    │     └─ ExportOptions
    │        ├─ DownloadJSON
    │        │  └─ exportSettings()
    │        │     └─ localStorage → JSON file
    │        │
    │        ├─ DownloadPrompt
    │        │  └─ Download selected prompt as .txt
    │        │
    │        └─ UploadJSON
    │           └─ Select file
    │              └─ importSettings(fileContent)
    │                 └─ setState(JSON.parse(fileContent))
    │
    ├─ FloatingPreviewButton (fixed bottom-right)
    │  └─ onClick: navigate to /preview
    │
    └─ ActionBar (fixed bottom)
       ├─ ShowPromptToggle
       └─ FormatSelector (pdf | docx | html | markdown)


LivePreview Component (used in Home + PreviewPage)
├─ Input: FormattingState (from context)
├─ Generates mock document HTML
└─ Display:
   ├─ Sample H1, H2, H3 with current styles
   ├─ Body paragraph
   ├─ Callout box (if enabled)
   ├─ Quote (if enabled)
   ├─ Table example (if enabled)
   └─ All styled with current element properties + palette colors
```

---

## 6. Data Flow: From User Action to Rendered Output

```
User adjusts H1 color to blue (#0066cc)
│
↓
ElementEditor receives onChange event
│ onClick event bubbles up from ColorPicker
│
↓
Handler calls: updateElementStyle('h1', 'color', '#0066cc')
│
↓
useFormattingState hook executes:
│ setState((prev) => ({
│   ...prev,
│   elements: {
│     ...prev.elements,
│     h1: {
│       ...prev.elements.h1,
│       style: {
│         ...prev.elements.h1.style,
│         color: '#0066cc'  ← NEW VALUE
│       }
│     }
│   }
│ }))
│
↓
State update triggers three side-effects:
│
├─ 1. History tracking
│    ├─ pastRef.current = [...pastRef, previousState]
│    ├─ futureRef.current = []
│    └─ setHistorySize({ past: n+1, future: 0 })
│
├─ 2. LocalStorage persistence
│    ├─ localStorage.setItem(
│    │   'formatting-state',
│    │   JSON.stringify(newState)
│    │ )
│    └─ So state survives page reload
│
└─ 3. React component re-render
   ├─ useFormatting hook subscribers notified
   ├─ ElementEditor component receives new props
   ├─ ElementMiniPreview re-renders
   ├─ LivePreview re-renders
   │  └─ Converted to CSS:
   │     color: #0066cc; (H1 headings now blue)
   │
   ├─ PromptOutput regenerates
   │  └─ generatePrompt() called with new state
   │     └─ New prompt includes: "h1: color: #0066cc"
   │
   └─ UI updates on screen (typically <50ms)


Result: User sees:
├─ ColorPicker shows #0066cc selected
├─ H1 preview turns blue
├─ Prompt text updates to reflect color change
└─ Can immediately copy updated prompt

Timeline: User action → Screen update = ~80ms (imperceptible)
```

---

## 7. Persistence Architecture

### 7.1 LocalStorage Schema

```
localStorage {
  'formatting-state': {
    palette: 'modern',
    elements: {
      h1: {
        id: 'h1',
        label: 'Heading 1',
        enabled: true,
        aiDecide: false,
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '32px',
          fontWeight: '800',
          color: '#0066cc',  ← Recent user change
          ...
        }
      },
      h2: { ... },
      ... (18+ more elements)
    },
    layout: {
      marginTop: 25,
      marginBottom: 25,
      marginLeft: 30,
      marginRight: 30,
      lineSpacing: 1.5,
      paragraphSpacing: 16,
      contentWidth: 'fixed'
    },
    outputFormat: 'pdf'
  },
  
  'formatting-history-past': [
    // Previous states (circular buffer, max 30)
    { ...previousState1 },
    { ...previousState2 },
    ...
  ],
  
  'formatting-history-future': [
    // States from redo stack
    { ...nextState1 },
    ...
  ],
  
  'ui-preferences': {
    darkMode: true,
    activeTab: 'elements',
    showPrompt: false
  }
}
```

### 7.2 Persistence Guarantees

```
Write-through Caching:
├─ Every state mutation immediately writes to localStorage
├─ Risk: Storage quota exceeded after many edits
├─ Mitigation: Circular history buffer (max 30 states)

Load-time Hydration:
├─ On app mount, FormattingProvider reads localStorage
├─ If 'formatting-state' exists → restore previous session
├─ If not exists → initialize with INITIAL_STATE CONSTANT
├─ User never loses templates or preferences

Multi-tab Consistency:
├─ If user opens app in multiple tabs:
│  ├─ Tab A: Makes changes → writes to localStorage
│  ├─ Tab B: Can read latest from localStorage
│  ├─ But: Tab B won't auto-sync (no cross-tab communication)
│  └─ User must refresh Tab B to see changes from Tab A

Platform-Specific Behaviors:
├─ Browser (Chrome, Firefox, Safari):
│  └─ localStorage = 5–10 MB per domain
├─ Mobile (iOS Safari):
│  └─ localStorage = 5 MB, cleared on app close (private mode)
├─ Incognito/Private window:
│  └─ localStorage = temp storage, cleared on close

Failure Modes:
├─ If localStorage.full(): 
│  ├─ New writes fail silently (quota exceeded error caught)
│  ├─ Mitigation: Clear old history entries
│  └─ User can always importSettings from backup file
├─ If JSON.stringify fails:
│  ├─ Circular reference or unserializable object
│  ├─ Mitigation: FormattingState is fully serializable
│  └─ Should never occur in normal operation
```

---

## 8. API Surface (External Contracts)

### 8.1 useFormatting Hook (Public API)

```typescript
// Return type from useFormatting()
interface FormattingContextType {
  // ── Read-only state ──
  state: FormattingState;
  
  // ── Element mutations ──
  updateElementEnabled(id: string, enabled: boolean): void;
  updateElementAiDecide(id: string, aiDecide: boolean): void;
  updateElementIfApplicable(id: string, ifApplicable: boolean): void;
  updateElementStyle(id: string, key: keyof ElementStyle, value: string): void;
  setAllEnabled(enabled: boolean): void;
  
  // ── Palette mutations ──
  applyPalette(palette: ColorPalette): void;
  
  // ── Template mutations ──
  applyPreset(presetId: string): void;
  
  // ── Layout mutations ──
  updateLayout(key: keyof LayoutControls, value: number | string): void;
  setOutputFormat(format: OutputFormat): void;
  
  // ── History ──
  undo(): void;
  redo(): void;
  canUndo: boolean;
  canRedo: boolean;
  
  // ── Persistence ──
  resetToDefault(): void;
  exportSettings(): void;  // Downloads JSON file
  importSettings(json: string): boolean;  // Returns success/failure
  
  // ── Generation ──
  generatePrompt(aiTool?: AiTool): string;  // Returns complete prompt
}
```

### 8.2 Component Props Interfaces

```typescript
interface ElementEditorProps {
  element: FormattingElement;
  onEnabledChange: (enabled: boolean) => void;
  onAiDecideChange: (aiDecide: boolean) => void;
  onIfApplicableChange?: (ifApplicable: boolean) => void;
  onStyleChange: (key: keyof ElementStyle, value: string) => void;
}

interface PromptOutputProps {
  generatePrompt: (tool: AiTool) => string;
}

interface ElementMiniPreviewProps {
  element: FormattingElement;
}

interface LivePreviewProps {
  state: FormattingState;
}
```

---

## 9. Error Handling Architecture

### 9.1 Error Categories

```
ERROR CATEGORIES:

1. Input Validation Errors
   ├─ Invalid color format (#abcdef vs #abc)
   ├─ Out-of-range slider values
   ├─ Unrecognized preset ID
   └─ Mitigation: Form-level validation + type guards

2. Storage Errors
   ├─ localStorage quota exceeded
   ├─ JSON serialization failure
   ├─ Corrupted stored state
   └─ Mitigation: Try-catch + fallback to INITIAL_STATE

3. UI State Errors
   ├─ FormattingContext used outside provider
   ├─ Invalid tab selection
   ├─ Undefined element reference
   └─ Mitigation: Context guard + default values

4. Generation Errors
   ├─ Empty enabled elements (no formatting to generate)
   ├─ Invalid AI tool specified
   └─ Mitigation: Defaults + validation in generatePrompt()

IMPLEMENTATION:

try {
  const stored = localStorage.getItem('formatting-state');
  if (stored) {
    const parsed = JSON.parse(stored) as FormattingState;
    // Validate schema
    validateFormattingState(parsed);
    return parsed;
  }
} catch (err) {
  console.error('Storage error:', err);
  // Fall back to default
  localStorage.removeItem('formatting-state');
}

return INITIAL_STATE;  // Safe default
```

### 9.2 Error Reporting

```
console.error() for development
└─ No external error tracking (privacy-first)

User-facing errors:
├─ Toast notifications (via Toaster component)
├─ Form validation messages
└─ Inline error states

Example:
if (importError) {
  <Alert variant="destructive">
    <AlertDescription>{importError}</AlertDescription>
  </Alert>
}
```

---

## 10. Performance Characteristics

### 10.1 Rendering Performance

```
Component Render Time:
├─ ElementEditor (single): ~2ms
├─ ElementList (20 elements): ~40ms
├─ LivePreview (full document): ~8ms
├─ PromptOutput (text generation): ~15ms
├─ Total Home.tsx render: <100ms

Optimization Techniques:
├─ useCallback for event handlers (prevent re-creation)
├─ Memoization boundaries (React.memo where appropriate)
├─ Conditional rendering (tabs only render active content)
└─ Virtual scrolling (if element list grows past 100)

Browser DevTools Metrics (Local Development):
├─ First Contentful Paint (FCP): <800ms
├─ Largest Contentful Paint (LCP): <1.2s
├─ Cumulative Layout Shift (CLS): <0.1
├─ Time to Interactive (TTI): <2.0s
└─ Lighthouse Score: 85–90
```

### 10.2 State Update Pathways

```
Critical Path (User Input → Screen Update):
├─ Event handler: <1ms
├─ setState mutation: <2ms
├─ React reconciliation: <20ms
├─ DOM paint: <30ms
└─ Total: ~50ms (imperceptible)

Complex Path (generatePrompt):
├─ Filter enabled elements: <1ms
├─ Build formatting strings: <3ms
├─ Build layout block: <1ms
├─ Build palette description: <1ms
├─ Template stitching: <2ms
└─ Total: ~8ms (plenty fast)

Slowest Operation (Full reset):
├─ Clear history stacks: <5ms
├─ Reset state to INITIAL_STATE: <2ms
├─ Clear localStorage: <10ms
├─ Re-render full tree: <50ms
└─ Total: ~70ms (acceptable)
```

---

## Conclusion

The Document Format Prompt Generator's architecture is built on four core principles:

1. **Simplicity**: No backend server, no complex state management library
2. **Reactivity**: React's component model perfectly suited for real-time preview updates
3. **Portability**: Client-side only means works anywhere, deployed anywhere
4. **Reliability**: Local storage + undo/redo guarantees users never lose work

The multi-layer architecture (UI → State → Logic → Data → Persistence) cleanly separates concerns while maintaining transparent data flow. Components are composable, state mutations are traceable, and the entire application fits comfortably in <500 KB of JavaScript.

This architecture provides the foundation for scaling to enterprise features (multi-user, cloud sync, API integration) without requiring fundamental changes.
