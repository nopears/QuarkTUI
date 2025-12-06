/**
 * QuarkTUI - Columns Layout Widget
 *
 * A layout widget for arranging content in multiple columns.
 * Supports fixed widths, flexible/auto widths, and various alignment options.
 */
import { type StyleType } from "../core/style";
import type { Widget, Alignment } from "./types";
/** Column width specification */
export type ColumnWidth = number | "auto" | "flex" | `${number}%`;
/** A single column definition */
export interface ColumnDef {
    /** Content for this column (string or Widget) */
    content: string | Widget;
    /** Width of the column */
    width?: ColumnWidth;
    /** Horizontal alignment of content within the column */
    align?: Alignment;
    /** Style(s) to apply to the content (only for string content) */
    style?: StyleType | StyleType[];
}
/** Options for the Columns widget */
export interface ColumnsOptions {
    /** Array of column definitions or simple strings */
    columns: (ColumnDef | string | Widget)[];
    /** Gap between columns in characters (default: 2) */
    gap?: number;
    /** Horizontal alignment of the entire row */
    align?: Alignment;
    /** Default width for columns without explicit width (default: "flex") */
    defaultWidth?: ColumnWidth;
    /** Minimum column width (default: 1) */
    minWidth?: number;
}
/**
 * Create a Columns layout widget.
 *
 * @param optionsOrColumns - Columns configuration or array of column contents
 * @returns A Columns widget
 *
 * @example
 * // Simple two-column layout
 * Columns(["Left content", "Right content"])
 *
 * @example
 * // Three columns with equal width
 * Columns({
 *   columns: ["Column 1", "Column 2", "Column 3"],
 *   gap: 4,
 * })
 *
 * @example
 * // Fixed and flexible widths
 * Columns({
 *   columns: [
 *     { content: "Label:", width: 10, align: "right" },
 *     { content: "Value here", width: "flex" },
 *   ],
 *   gap: 2,
 * })
 *
 * @example
 * // Percentage widths
 * Columns({
 *   columns: [
 *     { content: "30%", width: "30%" },
 *     { content: "70%", width: "70%" },
 *   ],
 * })
 *
 * @example
 * // Auto-width columns
 * Columns({
 *   columns: [
 *     { content: "ID", width: "auto" },
 *     { content: "A very long description", width: "flex" },
 *     { content: "Status", width: "auto" },
 *   ],
 * })
 *
 * @example
 * // Styled columns
 * Columns({
 *   columns: [
 *     { content: "Name", style: "bold" },
 *     { content: "Active", style: "success", align: "center" },
 *   ],
 * })
 *
 * @example
 * // Centered column layout
 * Columns({
 *   columns: ["A", "B", "C"],
 *   align: "center",
 *   defaultWidth: 10,
 * })
 */
export declare function Columns(optionsOrColumns: ColumnsOptions | (ColumnDef | string | Widget)[]): Widget;
/**
 * Create a two-column key-value layout (shorthand).
 *
 * @param label - Label/key text
 * @param value - Value text
 * @param labelWidth - Width of the label column (default: "auto")
 * @returns A Columns widget
 *
 * @example
 * KeyValue("Name:", "John Doe")
 * KeyValue("Status:", "Active", 15)
 */
export declare function KeyValue(label: string, value: string, labelWidth?: ColumnWidth): Widget;
//# sourceMappingURL=columns.d.ts.map