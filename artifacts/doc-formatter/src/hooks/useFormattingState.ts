import { useState, useCallback, useRef } from "react";
import {
  FormattingState,
  INITIAL_STATE,
  ElementStyle,
  COLOR_PALETTES,
  ColorPalette,
  AiTool,
  DocumentPreset,
  DOCUMENT_PRESETS,
} from "@/types/formatting";
import { resolveFont } from "@/utils/fontMapping";

const MAX_HISTORY = 30;

export function useFormattingState() {
  const [state, setRawState] = useState<FormattingState>(INITIAL_STATE);
  const pastRef = useRef<FormattingState[]>([]);
  const futureRef = useRef<FormattingState[]>([]);
  const [historySize, setHistorySize] = useState({ past: 0, future: 0 });

  /** Wrap every mutation so history is tracked */
  const setState = useCallback((updater: (prev: FormattingState) => FormattingState) => {
    setRawState((prev) => {
      const next = updater(prev);
      pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), prev];
      futureRef.current = [];
      setHistorySize({ past: pastRef.current.length, future: 0 });
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    setRawState((curr) => {
      const prev = pastRef.current[pastRef.current.length - 1];
      futureRef.current = [curr, ...futureRef.current.slice(0, MAX_HISTORY - 1)];
      pastRef.current = pastRef.current.slice(0, -1);
      setHistorySize({ past: pastRef.current.length, future: futureRef.current.length });
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    setRawState((curr) => {
      const next = futureRef.current[0];
      pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), curr];
      futureRef.current = futureRef.current.slice(1);
      setHistorySize({ past: pastRef.current.length, future: futureRef.current.length });
      return next;
    });
  }, []);

  const canUndo = historySize.past > 0;
  const canRedo = historySize.future > 0;

  // ── Element mutations ──────────────────────────────────────────────

  const updateElementEnabled = useCallback((id: string, enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      elements: { ...prev.elements, [id]: { ...prev.elements[id], enabled } },
    }));
  }, [setState]);

  const updateElementAiDecide = useCallback((id: string, aiDecide: boolean) => {
    setState((prev) => ({
      ...prev,
      elements: { ...prev.elements, [id]: { ...prev.elements[id], aiDecide } },
    }));
  }, [setState]);

  const updateElementIfApplicable = useCallback((id: string, ifApplicable: boolean) => {
    setState((prev) => ({
      ...prev,
      elements: { ...prev.elements, [id]: { ...prev.elements[id], ifApplicable } },
    }));
  }, [setState]);

  const setAllEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      elements: Object.fromEntries(
        Object.entries(prev.elements).map(([k, v]) => [k, { ...v, enabled }])
      ) as FormattingState["elements"],
    }));
  }, [setState]);

  const updateElementStyle = useCallback(
    (id: string, key: keyof ElementStyle, value: string) => {
      setState((prev) => ({
        ...prev,
        elements: {
          ...prev.elements,
          [id]: {
            ...prev.elements[id],
            style: { ...prev.elements[id].style, [key]: value },
          },
        },
      }));
    },
    [setState]
  );

  // ── Palette ────────────────────────────────────────────────────────

  const applyPalette = useCallback((palette: ColorPalette) => {
    const paletteDef = COLOR_PALETTES[palette];
    setState((prev) => {
      const newElements = { ...prev.elements };
      Object.entries(paletteDef.elements).forEach(([id, overrides]) => {
        if (newElements[id]) {
          newElements[id] = {
            ...newElements[id],
            style: { ...newElements[id].style, ...overrides },
          };
        }
      });
      return { ...prev, palette, elements: newElements };
    });
  }, [setState]);

  // ── Presets ────────────────────────────────────────────────────────

  const applyPreset = useCallback((presetId: string) => {
    const preset: DocumentPreset | undefined = DOCUMENT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const paletteDef = COLOR_PALETTES[preset.palette];
    setState((prev) => {
      // Start from INITIAL_STATE elements, apply enabled/disabled per preset
      const newElements = { ...prev.elements };
      Object.keys(newElements).forEach((id) => {
        newElements[id] = {
          ...newElements[id],
          enabled: preset.enabledIds.includes(id),
          aiDecide: false,
        };
      });
      // Apply palette colors on top
      Object.entries(paletteDef.elements).forEach(([id, overrides]) => {
        if (newElements[id]) {
          newElements[id] = {
            ...newElements[id],
            style: { ...newElements[id].style, ...overrides },
          };
        }
      });
      return {
        ...prev,
        palette: preset.palette,
        outputFormat: preset.outputFormat,
        layout: { ...prev.layout, ...preset.layout },
        elements: newElements,
      };
    });
  }, [setState]);

  // ── Layout ─────────────────────────────────────────────────────────

  const updateLayout = useCallback(
    (key: keyof FormattingState["layout"], value: number | string) => {
      setState((prev) => ({
        ...prev,
        layout: { ...prev.layout, [key]: value },
      }));
    },
    [setState]
  );

  const setOutputFormat = useCallback(
    (outputFormat: FormattingState["outputFormat"]) => {
      setState((prev) => ({ ...prev, outputFormat }));
    },
    [setState]
  );

  const setIncludeImages = useCallback(
    (include: boolean) => {
      setState((prev) => ({ ...prev, include_images: include }));
    },
    [setState]
  );

  const setLanguageDirection = useCallback(
    (dir: LanguageDirection) => {
      setState((prev) => ({ ...prev, languageDirection: dir }));
    },
    [setState]
  );

  const setStrictContentPreservation = useCallback(
    (preserve: boolean) => {
      setState((prev) => ({ ...prev, strictContentPreservation: preserve }));
    },
    [setState]
  );

  const setConflictResolution = useCallback(
    (include: boolean) => {
      setState((prev) => ({ ...prev, conflictResolution: include }));
    },
    [setState]
  );

  const setStrictDecisionRules = useCallback(
    (include: boolean) => {
      setState((prev) => ({ ...prev, strictDecisionRules: include }));
    },
    [setState]
  );
  // ── Reset / Import / Export ────────────────────────────────────────

  const resetToDefault = useCallback(() => {
    setState(() => INITIAL_STATE);
  }, [setState]);

  const exportSettings = useCallback(() => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "doc-formatter-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importSettings = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as FormattingState;
      setState(() => parsed);
      return true;
    } catch {
      return false;
    }
  }, [setState]);

  // ── Prompt generation ──────────────────────────────────────────────

  const generatePrompt = useCallback((aiTool: AiTool = "chatgpt") => {
    const enabledElements = Object.values(state.elements).filter((el) => el.enabled);
    const { layout, outputFormat } = state;

    const CONDITIONAL_HINTS: Record<string, string> = {
      callout:       "ONLY if the content contains a key insight, warning, or important note worth highlighting — skip entirely if no suitable content exists",
      quote:         "ONLY if the content contains a notable quote or statement worth emphasizing — skip entirely if no suitable quote exists",
      abstract:      "ONLY if the document is academic or research-based and requires a summary — skip if the content does not call for an abstract",
      keywords:      "ONLY if clear topic keywords can be identified from the content — skip if no relevant keywords are apparent",
      divider:       "Use sparingly to separate major sections — only where a clear visual break improves readability",
      chapterHeader: "ONLY if the document is divided into named chapters — skip for short or single-section documents",
    };

    const DECISION_RULES: Record<string, string> = {
      chapterHeader: "Use ONLY if the document is explicitly divided into named chapters. Skip if the document has fewer than 3 major sections or no explicit chapter titles.",
      callout: "Use ONLY when the source text contains a warning, critical note, key takeaway, or strong recommendation. Do NOT use for regular body content or mild remarks.",
      abstract: "Use ONLY for academic or research documents that contain a clearly defined summary or abstract section in the source text.",
      keywords: "Use ONLY if at least 3 clear topic keywords are explicitly present in the source text or can be extracted with high confidence. Skip if guessing.",
      quote: "Use ONLY for a direct quotation or a clearly self-contained emphatic statement that exists verbatim in the source text. Do NOT paraphrase body content into a quote to fill this element.",
    };

    const styleLines = enabledElements.map((el) => {
      if (el.aiDecide) return `  - ${el.label}: [Let AI decide the optimal formatting]`;
      const s = el.style;
      const conditional = el.ifApplicable ? CONDITIONAL_HINTS[el.id] : undefined;
      let conditionalNote = conditional ? `\n      ⚠ IF APPLICABLE: ${conditional}` : "";

      // Add strict decision rule if enabled and element is conditional
      if (el.ifApplicable && state.strictDecisionRules && DECISION_RULES[el.id]) {
        conditionalNote += `\n      ⚠ STRICT RULE: ${DECISION_RULES[el.id]}`;
      }

      if (el.id === "divider") {
        return (
          `  - ${el.label}:${conditionalNote}\n` +
          `      type: horizontal rule\n` +
          `      color: ${s.borderColor}\n` +
          `      thickness: ${s.borderWidth}\n` +
          `      spacing: margin-top ${s.marginTop}, margin-bottom ${s.marginBottom}\n` +
          `      implementation: HRFlowable(width="100%", thickness=${parseInt(s.borderWidth) || 1}, color=HexColor('${s.borderColor}'))`
        );
      }

      let alignStr = s.textAlign === 'left' ? 'left (LTR) or right (RTL)' : s.textAlign;
      if (el.id === "body") alignStr += " — NEVER TA_JUSTIFY";

      return (
        `  - ${el.label}:${conditionalNote}\n` +
        `      font: ${resolveFont(s.fontFamily)}, ${s.fontSize}, weight ${s.fontWeight}\n` +
        `      color: ${s.color}${s.backgroundColor !== "transparent" ? `, background: ${s.backgroundColor}` : ""}\n` +
        `      alignment: ${alignStr}, line-height ${s.lineHeight}\n` +
        `      spacing: margin-bottom ${s.marginBottom}` +
        (s.paddingLeft !== "0px" ? `, padding-left ${s.paddingLeft}` : "") +
        (s.borderWidth !== "0px" ? `\n      border: ${s.borderWidth} solid ${s.borderColor}, radius ${s.borderRadius}` : "") +
        (el.id === "table" ? `\n      header row: DVSans-Bold, background: #6366f1, color: #ffffff\n      colWidths: ALWAYS calculated from USABLE_WIDTH (see Rule 5)\n      Cell text: ALWAYS use Paragraph() objects — never plain strings` : "") +
        (el.id === "numberedList" ? `\n      Implementation: ALWAYS use ListFlowable + ListItem (see Rule 4)` : "")
      );
    });

    const layoutBlock = `## PAGE LAYOUT
- Margins: Top ${layout.marginTop}mm, Bottom ${layout.marginBottom}mm, Left ${layout.marginLeft}mm, Right ${layout.marginRight}mm
- Line spacing: ${layout.lineSpacing}
- Paragraph spacing: ${layout.paragraphSpacing}px
- Content width: ${layout.contentWidth}`;

    const paletteBlock = `## COLOR PALETTE
${COLOR_PALETTES[state.palette].label} — ${COLOR_PALETTES[state.palette].description}`;

    const bodyFontFamily = state.elements.body?.style.fontFamily || DEFAULT_STYLE.fontFamily;
    const primaryFont = bodyFontFamily.split(',')[0].trim();
    const resolvedFont = resolveFont(bodyFontFamily);

    let reportlabRulesBlock = `## REPORTLAB PDF SPECIFIC RULES

**Rule 0: Font path validation**
Before registering fonts, verify the font directory exists:
import os
FONT_DIR = '/usr/share/fonts/truetype/dejavu/'
if not os.path.exists(FONT_DIR):
    raise FileNotFoundError(
        f"Font directory not found: {FONT_DIR}\\n"
        "Install with: sudo apt-get install fonts-dejavu"
    )

**Rule 1: Never use Unicode subscript or superscript characters**
Built-in ReportLab fonts do NOT support Unicode subscript/superscript glyphs.
They render as black squares ■.

❌ NEVER write: SpO₂, PaO₂, CO₂, H₂O, x², m³
✅ ALWAYS write using XML tags inside Paragraph() objects:
SpO<sub>2</sub>, PaO<sub>2</sub>, CO<sub>2</sub>, H<sub>2</sub>O
x<super>2</super>, m<super>3</super>

Note: <sub> and <super> tags only work inside Paragraph() objects,
NOT in canvas.drawString().

**Rule 2: Never use TA_JUSTIFY alignment**
TA_JUSTIFY causes uneven word spacing — words get randomly stretched across lines,
especially on short lines. This looks broken and unprofessional.

❌ NEVER use: alignment=TA_JUSTIFY
✅ ALWAYS use: alignment=TA_LEFT  (or TA_CENTER for titles only)
              alignment=TA_RIGHT  (for Arabic/RTL paragraphs only)

**Rule 3: Never use ReportLab built-in fonts**
Built-in fonts (Helvetica, Times-Roman, Courier) have broken kerning in ReportLab —
letters inside words get random spacing and look unprofessional.

❌ NEVER use: Helvetica, Times-Roman, Times-Bold, Times-Italic, Courier

✅ ALWAYS register and use real TTF fonts:
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONT_DIR = '/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('DVSans',             FONT_DIR + 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVSans-Bold',        FONT_DIR + 'DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DVSans-Italic',      FONT_DIR + 'DejaVuSans-Oblique.ttf'))
pdfmetrics.registerFont(TTFont('DVSans-BoldItalic',  FONT_DIR + 'DejaVuSans-BoldOblique.ttf'))
pdfmetrics.registerFont(TTFont('DVSerif',            FONT_DIR + 'DejaVuSerif.ttf'))
pdfmetrics.registerFont(TTFont('DVSerif-Bold',       FONT_DIR + 'DejaVuSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DVSerif-Italic',     FONT_DIR + 'DejaVuSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('DVSerif-BoldItalic', FONT_DIR + 'DejaVuSerif-BoldItalic.ttf'))

pdfmetrics.registerFontFamily('DVSans',
    normal='DVSans', bold='DVSans-Bold',
    italic='DVSans-Italic', boldItalic='DVSans-BoldItalic')
pdfmetrics.registerFontFamily('DVSerif',
    normal='DVSerif', bold='DVSerif-Bold',
    italic='DVSerif-Italic', boldItalic='DVSerif-BoldItalic')

Then use DVSans / DVSerif everywhere — in ALL ParagraphStyle definitions
AND in ALL canvas.setFont() calls.

**Rule 4: Never use bullet characters directly in Paragraph text**
Using • or · or – directly inside Paragraph() text causes broken rendering
with TTF fonts (shows as squares or wrong symbols).

❌ NEVER write:
Paragraph("• Some text", style)
Paragraph("– Some text", style)

✅ ALWAYS use ListFlowable + ListItem for bullet lists:
from reportlab.platypus import ListFlowable, ListItem

def make_bullet_list(items, style):
    return ListFlowable(
        [ListItem(Paragraph(item, style), leftIndent=20, bulletColor=HexColor('#6366f1'))
         for item in items],
        bulletType='bullet',
        bulletFontName='DVSans',
        bulletFontSize=10,
        leftIndent=10,
        spaceBefore=4,
        spaceAfter=4,
    )

For nested/sub-bullets, wrap inner items in a second ListFlowable:
def make_nested_bullet_list(items_with_subitems, style, sub_style):
    list_items = []
    for item, subitems in items_with_subitems:
        li_content = [Paragraph(item, style)]
        if subitems:
            li_content.append(make_bullet_list(subitems, sub_style))
        list_items.append(ListItem(li_content, leftIndent=20))
    return ListFlowable(list_items, bulletType='bullet',
                        bulletFontName='DVSans', bulletFontSize=10, leftIndent=10)

**Rule 5: Always calculate colWidths relative to usable page width**
Never hardcode colWidths with fixed mm values that might exceed the page.
Always calculate from the actual usable width.

❌ NEVER write:
col_widths=[75*mm, 95*mm]   # might exceed page width

✅ ALWAYS calculate like this:
from reportlab.lib.pagesizes import A4
PAGE_W, PAGE_H = A4
LEFT_MARGIN  = 25*mm
RIGHT_MARGIN = 25*mm
USABLE_WIDTH = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN  # exact usable width

# Then split proportionally — always sum to exactly USABLE_WIDTH:
col_widths = [USABLE_WIDTH * 0.35, USABLE_WIDTH * 0.65]  # must sum to 1.0

# For equal columns:
col_widths = [USABLE_WIDTH / n] * n   # where n = number of columns

# For wide tables: if the content would exceed USABLE_WIDTH,
# wrap cell text using Paragraph() instead of plain strings,
# and let ReportLab wrap the text inside the cell automatically.
# Never let a table exceed USABLE_WIDTH.


Apply all rules to every element in the document. No exceptions.`;

    // Add chosen font info
    reportlabRulesBlock += `

## CHOSEN FONT
The user selected: "${primaryFont}"
In ReportLab, use: "${resolvedFont}" for ALL text elements — headings, body,
tables, bullet lists, callout boxes, and canvas.setFont() calls.
Do NOT use any other font name anywhere in the code.
`;

    let languageBlock = "";
    if (state.languageDirection === "auto") {
      languageBlock = `## LANGUAGE & DIRECTION
Detect the primary language of the raw text automatically.
If primarily Arabic: use RTL layout for body text, headings, lists, and tables.
If primarily English: use LTR layout.
Preserve embedded English terms, numbers, and technical identifiers in their natural direction.`;
    } else if (state.languageDirection === "ltr") {
      languageBlock = `## LANGUAGE & DIRECTION
Use LTR layout for all content. Preserve embedded Arabic terms naturally inline.`;
    } else if (state.languageDirection === "rtl") {
      languageBlock = `## LANGUAGE & DIRECTION
Use RTL layout for all content: body text, headings, lists, and tables.
Preserve embedded English terms, numbers, and technical identifiers in their natural direction.`;
    } else if (state.languageDirection === "mixed") {
      languageBlock = `## LANGUAGE & DIRECTION
Apply RTL or LTR per paragraph based on its dominant language.
Preserve embedded terms in their natural direction in all cases.`;
    }

    let contentIntegrityBlock = "";
    if (state.strictContentPreservation) {
      contentIntegrityBlock = `## CONTENT INTEGRITY — NO FABRICATION
- Do NOT summarize, omit, rewrite, paraphrase, or expand the source text.
- Do NOT fabricate any metadata: title, author, date, chapter names, keywords,
  abstract, captions, or references.
- Do NOT invent content to fill optional elements.
- Preserve wording, sequence, and meaning exactly as in the raw text.
- Minimal cleanup is allowed only when strictly necessary for formatting integrity.`;
    }

    let conflictBlock = "";
    if (state.conflictResolution) {
      conflictBlock = `## CONFLICT RESOLUTION — PRIORITY ORDER
If any formatting rule conflicts with another, resolve it in this order:
1. Content preservation — never lose or alter original text
2. Semantic accuracy — respect the logical structure of the content
3. Readability — ensure the result is clear and easy to read
4. Visual fidelity — stay as close as possible to the style spec`;
    }

    const advancedBlocks = [languageBlock, contentIntegrityBlock, conflictBlock].filter(Boolean).join('\n\n');

    if (state.include_images) {
      reportlabRulesBlock += `

**Rule 6: Extract and embed images from the source document into the PDF**
ONLY apply this rule if the source is a PDF or DOCX file path.
If raw_text is plain text pasted directly → skip image extraction entirely.

If source is a file:
1. Extract images from the source:
import fitz  # PyMuPDF — install with: pip install pymupdf
doc = fitz.open("source.pdf")
seen_sizes = set()
for page_num, page in enumerate(doc):
    for img_index, img in enumerate(page.get_images(full=True)):
        xref = img[0]
        base_image = doc.extract_image(xref)
        img_bytes = base_image["image"]
        # Skip tiny icons or artifacts (under 50x50 pixels)
        if base_image["width"] < 50 or base_image["height"] < 50:
            continue
        # Skip duplicates by byte size
        size_key = len(img_bytes)
        if size_key in seen_sizes:
            continue
        seen_sizes.add(size_key)
        img_ext  = base_image["ext"]
        img_path = f"/tmp/extracted_img_{page_num}_{img_index}.{img_ext}"
        with open(img_path, "wb") as f:
            f.write(img_bytes)

2. Embed at the correct position in the story:
from reportlab.platypus import Image as RLImage

def embed_image(img_path, max_width=None, max_height=400):
    if max_width is None:
        max_width = USABLE_WIDTH
    img = RLImage(img_path)
    w, h = img.imageWidth, img.imageHeight
    # Scale down to fit — never upscale
    scale = min(1.0, max_width / w, max_height / h)
    img.drawWidth  = w * scale
    img.drawHeight = h * scale
    return img

story.append(embed_image("/tmp/extracted_img_0_0.png"))
story.append(Spacer(1, 8))`;
    }

    reportlabRulesBlock += `

---

**Rule 7: Arabic and RTL text rendering**
ReportLab does NOT handle RTL or Arabic shaping natively.
If the document contains Arabic text, apply these steps — otherwise skip entirely.

Install required libraries:
pip install arabic-reshaper python-bidi

Import and define a reshaper function:
import arabic_reshaper
from bidi.algorithm import get_display

def ar(text):
    """Reshape and reorder Arabic text for correct RTL rendering in ReportLab."""
    return get_display(arabic_reshaper.reshape(str(text)))

Rules:
- Wrap ALL Arabic strings with ar() before passing to Paragraph() or canvas.drawString()
- Set alignment=TA_RIGHT on ALL Arabic ParagraphStyle definitions
- For mixed Arabic/English paragraphs, wrap only the Arabic portions with ar()
  and keep English terms as-is inline
- For Arabic table cells, wrap each cell string with ar() and use TA_RIGHT alignment
- For Arabic bullet lists, wrap each item string with ar() in make_bullet_list()

Font note: DejaVu fonts have partial Arabic support.
For full Arabic glyph coverage, register a dedicated Arabic TTF font:
  Noto Naskh Arabic: /usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf
  Amiri: download from https://www.amirifont.org/
If no Arabic font is available, fall back to DVSans — it will render most Arabic glyphs
but may have minor glyph issues.`;

    const elementsBlock = `## ELEMENT FORMATTING RULES
NOTE: Elements marked with "⚠ IF APPLICABLE" should only be used when the raw text contains content that naturally suits them. Do NOT force or invent content to fill these elements — if no suitable content exists, skip them entirely.

${styleLines.join("\n\n")}`;

    const instructionsBlock = `## INSTRUCTIONS
1. Analyze the structure of the raw text and identify all logical sections, headings, and content types
2. Apply the exact formatting specifications to each corresponding element
3. For elements marked "⚠ IF APPLICABLE": only use them if the content genuinely warrants it — never invent content to fill them
4. Maintain proper hierarchy throughout the document
5. Ensure consistent spacing and visual rhythm
6. Preserve all original content — do not summarize or omit anything
7. Output the formatted document as a complete, runnable Python script using ReportLab
8. The script must run without errors and produce a valid ${outputFormat.toUpperCase()} file
9. Follow ALL rules above — no exceptions
10. Include error handling for missing fonts and resources to prevent silent crashes`;

    if (aiTool === "claude") {
      return `<system>
You are a professional document formatter. Format the raw text inside <raw_text> tags into a polished, well-structured document following the specifications below.
</system>

<formatting_spec>
<output_format>${outputFormat.toUpperCase()}</output_format>

${advancedBlocks}

${layoutBlock}

${paletteBlock}

${reportlabRulesBlock}

${elementsBlock}

${instructionsBlock}
</formatting_spec>

<raw_text>
[Paste your raw text here]
</raw_text>`;
    }

    if (aiTool === "gemini") {
      return `**Role:** Professional document formatter

**Task:** Format the raw text provided at the end into a polished document.

**Output format:** ${outputFormat.toUpperCase()}

${advancedBlocks}

${layoutBlock}

${paletteBlock}

${reportlabRulesBlock}

${elementsBlock}

${instructionsBlock}

---

**Raw text to format:**
[Paste your raw text here]`;
    }

    // Default: ChatGPT
    return `You are a professional document formatter. Format the provided raw text into a polished, well-structured document following these precise specifications:

## OUTPUT FORMAT
Target: ${outputFormat.toUpperCase()}

${advancedBlocks}

${layoutBlock}

${paletteBlock}

${reportlabRulesBlock}

${elementsBlock}

${instructionsBlock}

## RAW TEXT TO FORMAT
[Paste your raw text here]`;
  }, [state]);

  return {
    state,
    undo,
    redo,
    canUndo,
    canRedo,
    updateElementEnabled,
    updateElementAiDecide,
    updateElementIfApplicable,
    updateElementStyle,
    setAllEnabled,
    applyPalette,
    applyPreset,
    updateLayout,
    setOutputFormat,
    setIncludeImages,
    setLanguageDirection,
    setStrictContentPreservation,
    setConflictResolution,
    setStrictDecisionRules,
    resetToDefault,
    exportSettings,
    importSettings,
    generatePrompt,
  };

}
