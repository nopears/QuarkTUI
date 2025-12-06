/**
 * QuarkTUI - Divider Widget
 *
 * A horizontal divider/separator widget with various styles and optional labels.
 * Useful for visually separating sections of content.
 */

import {
  style as applyStyle,
  visibleLength,
  repeat,
  type StyleType,
} from "../core/style";
import { getCurrentTheme, RESET } from "../core/theme";
import type { Widget, RenderContext, Alignment } from "./types";

// =============================================================================
// Types
// =============================================================================

/** Divider line style */
export type DividerStyle =
  | "line"
  | "double"
  | "thick"
  | "dashed"
  | "dotted"
  | "space";

/** Options for the Divider widget */
export interface DividerOptions {
  /** Visual style of the divider line */
  style?: DividerStyle;
  /** Optional label text to display in the divider */
  label?: string;
  /** Position of the label */
  labelAlign?: Alignment;
  /** Style(s) to apply to the label */
  labelStyle?: StyleType | StyleType[];
  /** Style(s) to apply to the line */
  lineStyle?: StyleType | StyleType[];
  /** Padding around the label (default: 1) */
  labelPadding?: number;
  /** Custom character for the line */
  char?: string;
  /** Width of the divider (default: full width) */
  width?: number;
  /** Horizontal alignment of the divider */
  align?: Alignment;
  /** Left/right margin from edges (default: 0) */
  margin?: number;
}

// =============================================================================
// Character Sets
// =============================================================================

const DIVIDER_CHARS: Record<DividerStyle, string> = {
  line: "─",
  double: "═",
  thick: "━",
  dashed: "╌",
  dotted: "┄",
  space: " ",
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Apply styles to text.
 */
function styleText(text: string, styles?: StyleType | StyleType[]): string {
  if (!styles) {
    return text;
  }

  if (Array.isArray(styles)) {
    return applyStyle(text, ...styles);
  }

  return applyStyle(text, styles);
}

/**
 * Apply alignment to content within a given width.
 */
function alignContent(
  content: string,
  width: number,
  alignment: Alignment,
): string {
  const contentLen = visibleLength(content);

  if (contentLen >= width) {
    return content;
  }

  const padding = width - contentLen;

  switch (alignment) {
    case "center": {
      const leftPad = Math.floor(padding / 2);
      return " ".repeat(leftPad) + content;
    }
    case "right": {
      return " ".repeat(padding) + content;
    }
    case "left":
    default:
      return content;
  }
}

// =============================================================================
// Divider Widget
// =============================================================================

/**
 * Internal Divider widget class.
 */
class DividerWidget implements Widget {
  readonly type = "divider" as const;

  constructor(private options: DividerOptions = {}) {}

  render(ctx: RenderContext): string[] {
    const {
      style: dividerStyle = "line",
      label,
      labelAlign = "center",
      labelStyle,
      lineStyle = "dim",
      labelPadding = 1,
      char,
      width,
      align = "left",
      margin = 0,
    } = this.options;

    const theme = getCurrentTheme();

    // Determine the character to use
    const lineChar = char ?? DIVIDER_CHARS[dividerStyle] ?? DIVIDER_CHARS.line;

    // Calculate available width
    const availableWidth = width ?? ctx.innerWidth - margin * 2;
    const dividerWidth = Math.max(1, availableWidth);

    let dividerLine: string;

    if (label) {
      // Divider with label
      const paddingStr = " ".repeat(labelPadding);
      const labelWithPadding = `${paddingStr}${label}${paddingStr}`;
      const labelLen = visibleLength(labelWithPadding);

      // Calculate line lengths on each side
      const remainingWidth = Math.max(0, dividerWidth - labelLen);

      let leftLineLen: number;
      let rightLineLen: number;

      switch (labelAlign) {
        case "left":
          leftLineLen = Math.min(2, remainingWidth);
          rightLineLen = remainingWidth - leftLineLen;
          break;
        case "right":
          rightLineLen = Math.min(2, remainingWidth);
          leftLineLen = remainingWidth - rightLineLen;
          break;
        case "center":
        default:
          leftLineLen = Math.floor(remainingWidth / 2);
          rightLineLen = remainingWidth - leftLineLen;
          break;
      }

      // Build the divider with label
      const leftLine = styleText(repeat(lineChar, leftLineLen), lineStyle);
      const rightLine = styleText(repeat(lineChar, rightLineLen), lineStyle);
      const styledLabel = styleText(labelWithPadding, labelStyle);

      dividerLine = `${leftLine}${styledLabel}${rightLine}`;
    } else {
      // Simple divider without label
      dividerLine = styleText(repeat(lineChar, dividerWidth), lineStyle);
    }

    // Apply margin
    if (margin > 0) {
      dividerLine = " ".repeat(margin) + dividerLine;
    }

    // Apply alignment
    const alignedLine = alignContent(dividerLine, ctx.innerWidth, align);

    return [alignedLine];
  }
}

// =============================================================================
// Public Factory Functions
// =============================================================================

/**
 * Create a Divider widget.
 *
 * @param optionsOrLabel - Divider configuration or just a label string
 * @returns A Divider widget
 *
 * @example
 * // Simple horizontal line
 * Divider()
 *
 * @example
 * // Divider with centered label
 * Divider("Section Title")
 *
 * @example
 * // Divider with custom style
 * Divider({
 *   style: "double",
 *   label: "Important",
 *   labelStyle: "bold",
 * })
 *
 * @example
 * // Dashed divider with left-aligned label
 * Divider({
 *   style: "dashed",
 *   label: "Options",
 *   labelAlign: "left",
 *   labelStyle: ["bold", "warning"],
 * })
 *
 * @example
 * // Custom character divider
 * Divider({ char: "·", lineStyle: "dim" })
 *
 * @example
 * // Divider with margin
 * Divider({ margin: 4, style: "thick" })
 */
export function Divider(optionsOrLabel?: DividerOptions | string): Widget {
  if (typeof optionsOrLabel === "string") {
    return new DividerWidget({ label: optionsOrLabel });
  }
  return new DividerWidget(optionsOrLabel);
}

/**
 * Create a simple horizontal rule (shorthand).
 *
 * @param style - Optional divider style
 * @returns A Divider widget
 *
 * @example
 * HR()           // Simple line
 * HR("double")   // Double line
 * HR("dashed")   // Dashed line
 */
export function HR(style: DividerStyle = "line"): Widget {
  return new DividerWidget({ style });
}
