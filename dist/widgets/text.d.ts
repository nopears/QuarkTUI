/**
 * QuarkTUI - Text Widget
 *
 * The fundamental text display widget.
 * Supports alignment and styling.
 */
import type { Widget, TextOptions } from "./types";
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
export declare function Text(content: string, options?: TextOptions): Widget;
//# sourceMappingURL=text.d.ts.map