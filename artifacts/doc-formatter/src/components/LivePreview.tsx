import { FormattingState } from "@/types/formatting";

interface LivePreviewProps {
  state: FormattingState;
}

export function LivePreview({ state }: LivePreviewProps) {
  const { elements, layout } = state;
  const el = elements;

  const pageStyle: React.CSSProperties = {
    fontFamily: el.body?.style.fontFamily || "Inter, sans-serif",
    fontSize: el.body?.style.fontSize || "15px",
    lineHeight: String(layout.lineSpacing),
    padding: `${layout.marginTop}px ${layout.marginRight}px ${layout.marginBottom}px ${layout.marginLeft}px`,
    maxWidth: layout.contentWidth === "fixed" ? "720px" : "100%",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    color: el.body?.style.color || "#334155",
    minHeight: "100%",
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: el.sectionHeader?.style.backgroundColor || "#6366f1",
    color: el.sectionHeader?.style.color || "#ffffff",
    padding: "8px 12px",
    fontWeight: "600",
    fontSize: "12px",
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Preview area — A4-like paper */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div
          className="shadow-lg mx-auto transition-all duration-200"
          style={{
            backgroundColor: "#ffffff",
            minHeight: "900px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          }}
        >
          <div style={pageStyle}>

            {/* Header */}
            {el.header?.enabled && (
              <div
                style={{
                  fontFamily: el.header.style.fontFamily,
                  fontSize: el.header.style.fontSize,
                  fontWeight: el.header.style.fontWeight,
                  color: el.header.style.color,
                  paddingBottom: el.header.style.paddingBottom,
                  borderBottom: el.header.style.borderWidth !== "0px"
                    ? `${el.header.style.borderWidth} solid ${el.header.style.borderColor}`
                    : "none",
                  marginBottom: el.header.style.marginBottom,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Document Title · Running Header</span>
                <span>Chapter 1</span>
              </div>
            )}

            {/* Chapter Header */}
            {el.chapterHeader?.enabled && (
              <div
                style={{
                  fontFamily: el.chapterHeader.style.fontFamily,
                  fontSize: el.chapterHeader.style.fontSize,
                  fontWeight: el.chapterHeader.style.fontWeight,
                  color: el.chapterHeader.style.color,
                  letterSpacing: el.chapterHeader.style.letterSpacing,
                  marginBottom: el.chapterHeader.style.marginBottom,
                  textTransform: "uppercase",
                }}
              >
                Chapter 1 · Introduction
              </div>
            )}

            {/* H1 */}
            {el.h1?.enabled && (
              <h1
                style={{
                  fontFamily: el.h1.style.fontFamily,
                  fontSize: el.h1.style.fontSize,
                  fontWeight: el.h1.style.fontWeight,
                  color: el.h1.style.color,
                  lineHeight: el.h1.style.lineHeight,
                  marginBottom: el.h1.style.marginBottom,
                  letterSpacing: el.h1.style.letterSpacing,
                }}
              >
                Advanced Formatting Systems for Modern Documents
              </h1>
            )}

            {/* Abstract */}
            {el.abstract?.enabled && (
              <div
                style={{
                  fontFamily: el.abstract.style.fontFamily,
                  fontSize: el.abstract.style.fontSize,
                  fontWeight: el.abstract.style.fontWeight,
                  color: el.abstract.style.color,
                  backgroundColor: el.abstract.style.backgroundColor,
                  border: el.abstract.style.borderWidth !== "0px"
                    ? `${el.abstract.style.borderWidth} solid ${el.abstract.style.borderColor}`
                    : "none",
                  borderRadius: el.abstract.style.borderRadius,
                  padding: `${el.abstract.style.paddingTop} ${el.abstract.style.paddingRight} ${el.abstract.style.paddingBottom} ${el.abstract.style.paddingLeft}`,
                  marginBottom: el.abstract.style.marginBottom,
                  lineHeight: el.abstract.style.lineHeight,
                }}
              >
                <strong style={{ display: "block", marginBottom: "6px", fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Abstract</strong>
                This document demonstrates a fully configurable formatting system. Each element can be styled independently with custom fonts, colors, spacing, and borders. The live preview updates instantly as you modify any setting in the control panel.
              </div>
            )}

            {/* Keywords */}
            {el.keywords?.enabled && (
              <div
                style={{
                  fontFamily: el.keywords.style.fontFamily,
                  fontSize: el.keywords.style.fontSize,
                  fontWeight: el.keywords.style.fontWeight,
                  color: el.keywords.style.color,
                  marginBottom: el.keywords.style.marginBottom,
                  letterSpacing: el.keywords.style.letterSpacing,
                }}
              >
                <strong>Keywords:</strong>{" "}
                {["document formatting", "typography", "layout design", "AI prompts", "styling systems"].map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      marginRight: "8px",
                      marginBottom: "4px",
                      padding: "2px 8px",
                      backgroundColor: el.keywords?.style.color + "18",
                      borderRadius: "4px",
                      border: `1px solid ${el.keywords?.style.color}40`,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            {el.divider?.enabled && (
              <hr
                style={{
                  borderTop: `${el.divider.style.borderWidth} solid ${el.divider.style.borderColor}`,
                  marginTop: el.divider.style.marginTop,
                  marginBottom: el.divider.style.marginBottom,
                  border: "none",
                  borderTopWidth: el.divider.style.borderWidth,
                  borderTopStyle: "solid",
                  borderTopColor: el.divider.style.borderColor,
                }}
              />
            )}

            {/* Section Header Bar */}
            {el.sectionHeader?.enabled && (
              <div
                style={{
                  fontFamily: el.sectionHeader.style.fontFamily,
                  fontSize: el.sectionHeader.style.fontSize,
                  fontWeight: el.sectionHeader.style.fontWeight,
                  color: el.sectionHeader.style.color,
                  backgroundColor: el.sectionHeader.style.backgroundColor,
                  padding: `${el.sectionHeader.style.paddingTop} ${el.sectionHeader.style.paddingRight} ${el.sectionHeader.style.paddingBottom} ${el.sectionHeader.style.paddingLeft}`,
                  marginBottom: el.sectionHeader.style.marginBottom,
                  borderRadius: el.sectionHeader.style.borderRadius,
                }}
              >
                1. Core Concepts & Methodology
              </div>
            )}

            {/* H2 */}
            {el.h2?.enabled && (
              <h2
                style={{
                  fontFamily: el.h2.style.fontFamily,
                  fontSize: el.h2.style.fontSize,
                  fontWeight: el.h2.style.fontWeight,
                  color: el.h2.style.color,
                  lineHeight: el.h2.style.lineHeight,
                  marginBottom: el.h2.style.marginBottom,
                }}
              >
                1.1 Typographic Foundations
              </h2>
            )}

            {/* Body text */}
            {el.body?.enabled && (
              <>
                <p
                  style={{
                    fontFamily: el.body.style.fontFamily,
                    fontSize: el.body.style.fontSize,
                    fontWeight: el.body.style.fontWeight,
                    color: el.body.style.color,
                    lineHeight: el.body.style.lineHeight,
                    marginBottom: el.body.style.marginBottom,
                  }}
                >
                  Good typography is the foundation of readable, professional documents. Font selection, size hierarchy, and spacing work together to create visual rhythm that guides the reader through the content naturally and efficiently.
                </p>
                <p
                  style={{
                    fontFamily: el.body.style.fontFamily,
                    fontSize: el.body.style.fontSize,
                    fontWeight: el.body.style.fontWeight,
                    color: el.body.style.color,
                    lineHeight: el.body.style.lineHeight,
                    marginBottom: el.body.style.marginBottom,
                  }}
                >
                  The formatting system allows precise control over every visual element while maintaining consistency across the entire document through systematic style definitions.
                </p>
              </>
            )}

            {/* H3 */}
            {el.h3?.enabled && (
              <h3
                style={{
                  fontFamily: el.h3.style.fontFamily,
                  fontSize: el.h3.style.fontSize,
                  fontWeight: el.h3.style.fontWeight,
                  color: el.h3.style.color,
                  lineHeight: el.h3.style.lineHeight,
                  marginBottom: el.h3.style.marginBottom,
                }}
              >
                1.1.1 Font Hierarchy
              </h3>
            )}

            {/* Callout */}
            {el.callout?.enabled && (
              <div
                style={{
                  fontFamily: el.callout.style.fontFamily,
                  fontSize: el.callout.style.fontSize,
                  fontWeight: el.callout.style.fontWeight,
                  color: el.callout.style.color,
                  backgroundColor: el.callout.style.backgroundColor,
                  borderLeft: el.callout.style.borderWidth !== "0px"
                    ? `${el.callout.style.borderWidth} solid ${el.callout.style.borderColor}`
                    : "none",
                  borderRadius: el.callout.style.borderRadius,
                  padding: `${el.callout.style.paddingTop} ${el.callout.style.paddingRight} ${el.callout.style.paddingBottom} ${el.callout.style.paddingLeft}`,
                  marginBottom: el.callout.style.marginBottom,
                }}
              >
                <strong style={{ display: "block", marginBottom: "6px", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Key Insight
                </strong>
                Consistent typographic hierarchies help readers navigate complex documents by establishing clear visual relationships between headings, subheadings, and body content.
              </div>
            )}

            {/* Quote */}
            {el.quote?.enabled && (
              <blockquote
                style={{
                  fontFamily: el.quote.style.fontFamily,
                  fontSize: el.quote.style.fontSize,
                  fontWeight: el.quote.style.fontWeight,
                  color: el.quote.style.color,
                  borderLeft: el.quote.style.borderWidth !== "0px"
                    ? `${el.quote.style.borderWidth} solid ${el.quote.style.borderColor}`
                    : "none",
                  paddingLeft: el.quote.style.paddingLeft,
                  paddingTop: el.quote.style.paddingTop,
                  paddingBottom: el.quote.style.paddingBottom,
                  marginBottom: el.quote.style.marginBottom,
                  fontStyle: "italic",
                }}
              >
                "The difference between a document and a piece of communication is intentional design — every visual choice should serve the reader."
              </blockquote>
            )}

            {/* Numbered list */}
            {el.numberedList?.enabled && (
              <ol
                style={{
                  fontFamily: el.numberedList.style.fontFamily,
                  fontSize: el.numberedList.style.fontSize,
                  color: el.numberedList.style.color,
                  lineHeight: el.numberedList.style.lineHeight,
                  paddingLeft: el.numberedList.style.paddingLeft,
                  marginBottom: el.numberedList.style.marginBottom,
                }}
              >
                {["Select document elements to include", "Configure fonts, colors, and spacing for each", "Choose a color palette or customize individually", "Generate the AI formatting prompt", "Paste into any AI tool with your raw text"].map((item, i) => (
                  <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
                ))}
              </ol>
            )}

            {/* Table */}
            {el.table?.enabled && (
              <div style={{ marginBottom: el.table.style.marginBottom, overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: el.table.style.fontFamily,
                    fontSize: el.table.style.fontSize,
                    color: el.table.style.color,
                    border: `${el.table.style.borderWidth} solid ${el.table.style.borderColor}`,
                  }}
                >
                  <thead>
                    <tr>
                      {["Element", "Font", "Size", "Weight", "Color"].map((h) => (
                        <th key={h} style={{ ...tableHeaderStyle, textAlign: "left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["H1 Heading", el.h1?.style.fontFamily.split(",")[0], el.h1?.style.fontSize, el.h1?.style.fontWeight, el.h1?.style.color],
                      ["H2 Heading", el.h2?.style.fontFamily.split(",")[0], el.h2?.style.fontSize, el.h2?.style.fontWeight, el.h2?.style.color],
                      ["Body Text", el.body?.style.fontFamily.split(",")[0], el.body?.style.fontSize, el.body?.style.fontWeight, el.body?.style.color],
                    ].map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            style={{
                              padding: "8px 12px",
                              borderBottom: `1px solid ${el.table?.style.borderColor}`,
                              borderRight: ci < row.length - 1 ? `1px solid ${el.table?.style.borderColor}` : "none",
                              backgroundColor: ri % 2 === 1 ? "#f8fafc" : "#ffffff",
                            }}
                          >
                            {ci === 4 ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "2px",
                                    backgroundColor: cell,
                                    border: "1px solid #e2e8f0",
                                  }}
                                />
                                {cell}
                              </span>
                            ) : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Divider before footer */}
            {el.divider?.enabled && (
              <hr
                style={{
                  border: "none",
                  borderTopWidth: el.divider.style.borderWidth,
                  borderTopStyle: "solid",
                  borderTopColor: el.divider.style.borderColor,
                  marginTop: el.divider.style.marginTop,
                  marginBottom: "8px",
                }}
              />
            )}

            {/* Footer / Page number */}
            {el.header?.enabled && (
              <div
                style={{
                  fontFamily: el.header.style.fontFamily,
                  fontSize: el.header.style.fontSize,
                  color: el.header.style.color,
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "8px",
                }}
              >
                <span>Document Footer · Confidential</span>
                {el.pageNumber?.enabled && (
                  <span
                    style={{
                      fontSize: el.pageNumber.style.fontSize,
                      color: el.pageNumber.style.color,
                      fontWeight: el.pageNumber.style.fontWeight,
                    }}
                  >
                    Page 1 of 12
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
