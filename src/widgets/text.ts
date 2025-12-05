/**
 * QuarkTUI - Text Widget
 *
 * The fundamental text display widget.
 * Supports alignment and styling.
 */

import {
  style as applyStyle,
  visibleLength,
  type StyleType,
} from "../core/style";
import type { Widget, RenderContext, TextOptions, Alignment } from "./types";

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Apply alignment to text within a given width.
 */
function alignText(text: string, width: number, alignment: Alignment): string {
  const textLen = visibleLength(text);

  if (textLen >= width) {
    return text;
  }

  const padding = width - textLen;

  switch (alignment) {
    case "center": {
      const leftPad = Math.floor(padding / 2);
      return " ".repeat(leftPad) + text;
    }
    case "right": {
      return " ".repeat(padding) + text;
    }
    case "left":
    default:
      return text;
  }
}

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

// =============================================================================
// Text Widget
// =============================================================================

/**
 * Internal Text widget class.
 */
class TextWidget implements Widget {
  readonly type = "text" as const;

  constructor(
    private content: string,
    private options: TextOptions = {},
  ) {}

  render(ctx: RenderContext): string[] {
    const { align = "left", style } = this.options;

    // Apply styling first
    const styledText = styleText(this.content, style);

    // Then apply alignment
    const alignedText = alignText(styledText, ctx.innerWidth, align);

    // Text always returns a single line
    return [alignedText];
  }
}

// =============================================================================
// Public Factory Function
// =============================================================================

/**
 * Create a Text widget.
 *
 * @param content - The text content to display
 * @param options - Optional alignment and styling
 * @returns A Text widget
 *
 * @example
 * // Simple text
 * Text("Hello, World!")
 *
 * @example
 * // Centered bold text
 * Text("Title", { align: "center", style: "bold" })
 *
 * @example
 * // Multiple styles
 * Text("Success!", { style: ["bold", "success"] })
 */
export function Text(content: string, options?: TextOptions): Widget {
  return new TextWidget(content, options);
}
