import { FormattingElement } from "@/types/formatting";

interface Props {
  element: FormattingElement;
}

export function ElementMiniPreview({ element }: Props) {
  const { id, style } = element;

  const baseTextStyle: React.CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    textAlign: style.textAlign as React.CSSProperties["textAlign"],
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };

  const borderStyle =
    style.borderWidth !== "0px"
      ? `${style.borderWidth} solid ${style.borderColor}`
      : "none";

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor !== "transparent" ? style.backgroundColor : "#fff",
    borderRadius: style.borderRadius,
    padding: `${style.paddingTop || "8px"} ${style.paddingRight || "12px"} ${style.paddingBottom || "8px"} ${style.paddingLeft || "12px"}`,
  };

  const renderPreview = () => {
    switch (id) {
      case "header":
        return (
          <div style={{ borderBottom: borderStyle, paddingBottom: "6px", display: "flex", justifyContent: "space-between", ...baseTextStyle }}>
            <span>Document Title · Running Header</span>
            <span>Chapter 1</span>
          </div>
        );

      case "chapterHeader":
        return (
          <div style={{ ...baseTextStyle, textTransform: "uppercase" }}>
            Chapter 1 · Introduction
          </div>
        );

      case "sectionHeader":
        return (
          <div style={{ ...baseTextStyle, ...containerStyle }}>
            1. Core Concepts & Methodology
          </div>
        );

      case "h1":
        return <h1 style={{ ...baseTextStyle, margin: 0 }}>Main Document Title</h1>;

      case "h2":
        return <h2 style={{ ...baseTextStyle, margin: 0 }}>1.1 Section Heading</h2>;

      case "h3":
        return <h3 style={{ ...baseTextStyle, margin: 0 }}>1.1.1 Subsection Heading</h3>;

      case "body":
        return (
          <p style={{ ...baseTextStyle, margin: 0 }}>
            This is how your body text will appear in the document. Font, size, color and line spacing are all reflected here in real time.
          </p>
        );

      case "callout":
        return (
          <div
            style={{
              ...containerStyle,
              borderLeft: borderStyle,
              border: "none",
              borderLeftWidth: style.borderWidth,
              borderLeftStyle: "solid",
              borderLeftColor: style.borderColor,
            }}
          >
            <strong style={{ display: "block", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px", color: style.color }}>
              Key Insight
            </strong>
            <span style={baseTextStyle}>
              Important callout content highlighted for the reader's attention.
            </span>
          </div>
        );

      case "abstract":
        return (
          <div style={{ ...containerStyle, border: borderStyle }}>
            <strong style={{ display: "block", fontSize: "10px", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "4px", color: style.color }}>
              Abstract
            </strong>
            <span style={baseTextStyle}>
              A concise summary of the document's content and findings.
            </span>
          </div>
        );

      case "keywords":
        return (
          <div style={baseTextStyle}>
            <strong>Keywords: </strong>
            {["formatting", "typography", "layout"].map((kw, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "6px",
                  padding: "1px 7px",
                  backgroundColor: style.color + "18",
                  borderRadius: "4px",
                  border: `1px solid ${style.color}40`,
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        );

      case "table":
        return (
          <table style={{ width: "100%", borderCollapse: "collapse", ...baseTextStyle }}>
            <thead>
              <tr>
                {["Parameter", "Value", "Unit"].map((h) => (
                  <th
                    key={h}
                    style={{
                      background: "#1e293b",
                      color: "#fff",
                      padding: "5px 10px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[["Sample A", "42.7", "mg/dL"], ["Sample B", "18.3", "mg/dL"]].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: "5px 10px",
                        borderBottom: `1px solid ${style.borderColor}`,
                        backgroundColor: i % 2 === 1 ? "#f8fafc" : "#ffffff",
                        fontSize: style.fontSize,
                        color: style.color,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "numberedList":
        return (
          <ol style={{ ...baseTextStyle, paddingLeft: style.paddingLeft || "20px", margin: 0 }}>
            {["First item in the list", "Second item in the list", "Third item in the list"].map((item, i) => (
              <li key={i} style={{ marginBottom: "4px" }}>{item}</li>
            ))}
          </ol>
        );

      case "quote":
        return (
          <blockquote
            style={{
              ...baseTextStyle,
              borderLeft: borderStyle,
              paddingLeft: style.paddingLeft || "16px",
              paddingTop: style.paddingTop,
              paddingBottom: style.paddingBottom,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            "Great typography is invisible — it serves the reader, not the designer."
          </blockquote>
        );

      case "divider":
        return (
          <div style={{ width: "100%", borderTop: `${style.borderWidth} solid ${style.borderColor}`, marginTop: "8px", marginBottom: "8px" }} />
        );

      case "pageNumber":
        return (
          <div style={{ ...baseTextStyle, textAlign: "center", width: "100%" }}>
            Page 1 of 12
          </div>
        );

      default:
        return <div style={baseTextStyle}>Preview of {id}</div>;
    }
  };

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        padding: "10px 14px",
        minHeight: "40px",
      }}
    >
      <div
        className="text-[9px] font-semibold tracking-widest text-gray-400 uppercase mb-2"
      >
        Preview
      </div>
      <div style={{ background: "#ffffff", borderRadius: "4px", padding: "10px 12px" }}>
        {renderPreview()}
      </div>
    </div>
  );
}
