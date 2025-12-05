/**
 * QuarkTUI - Renderer
 *
 * Converts an array of widgets into an array of strings for display.
 */
import type { Widget, RenderContext } from "./widgets/types";
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
export declare function render(widgets: Widget[], ctx: RenderContext): string[];
/**
 * Render widgets and pad/truncate to fit exact content height.
 * Useful when you need to fill a fixed-size area.
 *
 * @param widgets - Array of widgets to render
 * @param ctx - Render context with dimensions
 * @param options - Padding options
 * @returns Array of strings with exact contentHeight length
 */
export declare function renderFitted(widgets: Widget[], ctx: RenderContext, options?: {
    /** How to align content vertically when it's smaller than available space */
    verticalAlign?: "top" | "center" | "bottom";
    /** Character to use for padding lines (default: empty string) */
    padChar?: string;
}): string[];
//# sourceMappingURL=renderer.d.ts.map