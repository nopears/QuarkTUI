/**
 * QuarkTUI - Renderer
 *
 * Converts an array of widgets into an array of strings for display.
 */

import type { Widget, RenderContext } from "./widgets/types";

// =============================================================================
// Renderer
// =============================================================================

/**
 * Render an array of widgets to string lines.
 *
 * @param widgets - Array of widgets to render
 * @param ctx - Render context with dimensions
 * @returns Array of strings, one per line
 *
 * @example
 * const lines = render([
 *   Text("Title", { align: "center", style: "bold" }),
 *   Spacer(),
 *   Row([Text("BPM:"), Text("120")]),
 * ], { innerWidth: 80, contentHeight: 24 });
 */
export function render(widgets: Widget[], ctx: RenderContext): string[] {
  const lines: string[] = [];

  for (const widget of widgets) {
    const widgetLines = widget.render(ctx);
    lines.push(...widgetLines);
  }

  return lines;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Render widgets and pad/truncate to fit exact content height.
 * Useful when you need to fill a fixed-size area.
 *
 * @param widgets - Array of widgets to render
 * @param ctx - Render context with dimensions
 * @param options - Padding options
 * @returns Array of strings with exact contentHeight length
 */
export function renderFitted(
  widgets: Widget[],
  ctx: RenderContext,
  options: {
    /** How to align content vertically when it's smaller than available space */
    verticalAlign?: "top" | "center" | "bottom";
    /** Character to use for padding lines (default: empty string) */
    padChar?: string;
  } = {},
): string[] {
  const { verticalAlign = "center", padChar = "" } = options;
  const { contentHeight } = ctx;

  // First render all widgets
  const renderedLines = render(widgets, ctx);

  // If content exactly fits, return as-is
  if (renderedLines.length === contentHeight) {
    return renderedLines;
  }

  // If content is larger than available space, truncate
  if (renderedLines.length > contentHeight) {
    return renderedLines.slice(0, contentHeight);
  }

  // Content is smaller - add padding
  const extraLines = contentHeight - renderedLines.length;
  const padLine = padChar;

  switch (verticalAlign) {
    case "top": {
      // Content at top, padding at bottom
      const bottomPadding = Array(extraLines).fill(padLine);
      return [...renderedLines, ...bottomPadding];
    }

    case "bottom": {
      // Padding at top, content at bottom
      const topPadding = Array(extraLines).fill(padLine);
      return [...topPadding, ...renderedLines];
    }

    case "center":
    default: {
      // Split padding between top and bottom
      const topPadCount = Math.floor(extraLines / 2);
      const bottomPadCount = extraLines - topPadCount;
      const topPadding = Array(topPadCount).fill(padLine);
      const bottomPadding = Array(bottomPadCount).fill(padLine);
      return [...topPadding, ...renderedLines, ...bottomPadding];
    }
  }
}
