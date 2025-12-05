/**
 * QuarkTUI - Row Widget
 *
 * Horizontal layout widget that arranges other widgets in a row.
 */
import type { Widget, RowOptions } from "./types";
/**
 * Create a Row widget for horizontal layout.
 *
 * @param items - Array of widgets to arrange horizontally
 * @param options - Optional gap and alignment settings
 * @returns A Row widget
 *
 * @example
 * // Simple row with default gap
 * Row([Text("Label:"), Text("Value")])
 *
 * @example
 * // Centered row with custom gap
 * Row([Text("A"), Text("B"), Text("C")], { gap: 3, align: "center" })
 *
 * @example
 * // Row with styled items
 * Row([
 *   Text("BPM:", { style: "dim" }),
 *   Text("120", { style: "bold" }),
 * ])
 */
export declare function Row(items: Widget[], options?: RowOptions): Widget;
//# sourceMappingURL=row.d.ts.map