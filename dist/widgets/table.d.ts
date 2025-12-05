/**
 * QuarkTUI - Table Widget
 *
 * A table widget for displaying tabular data with columns, headers,
 * and styled cells.
 */
import { type StyleType } from "../core/style";
import type { Widget, Alignment } from "./types";
/**
 * A table cell can be a plain string or a styled cell object.
 */
export type TableCell = string | {
    text: string;
    style?: StyleType | StyleType[];
};
/**
 * Column definition for the table.
 */
export interface TableColumn {
    /** Header text for this column */
    header: string;
    /** Fixed width of the column in characters */
    width: number;
    /** Alignment of content within the column */
    align?: Alignment;
}
/**
 * Options for the Table widget.
 */
export interface TableOptions {
    /** Column definitions */
    columns: TableColumn[];
    /** Row data - each row is an array of cells matching columns */
    rows: TableCell[][];
    /** Alignment of the entire table within the container */
    align?: Alignment;
    /** Whether to show the header row (default: true) */
    showHeader?: boolean;
    /** Whether to show a separator line after the header (default: true) */
    showSeparator?: boolean;
    /** Style to apply to all header cells (default: "bold") */
    headerStyle?: StyleType | StyleType[];
}
/**
 * Create a Table widget for displaying tabular data.
 *
 * @param options - Table configuration including columns and rows
 * @returns A Table widget
 *
 * @example
 * // Simple table with strings
 * Table({
 *   columns: [
 *     { header: "Name", width: 20 },
 *     { header: "Value", width: 10, align: "right" },
 *   ],
 *   rows: [
 *     ["Item 1", "100"],
 *     ["Item 2", "200"],
 *   ],
 * })
 *
 * @example
 * // Styled table with centered alignment
 * Table({
 *   columns: [
 *     { header: "Note", width: 15, align: "left" },
 *     { header: "Sign", width: 8, align: "center" },
 *     { header: "Size", width: 10, align: "center" },
 *   ],
 *   rows: [
 *     [{ text: "Perfect Fifth", style: "info" }, { text: "P5", style: "bold" }, "7"],
 *     [{ text: "Major Third", style: "success" }, { text: "M3", style: "bold" }, "4"],
 *   ],
 *   align: "center",
 *   headerStyle: ["bold", "dim"],
 * })
 */
export declare function Table(options: TableOptions): Widget;
//# sourceMappingURL=table.d.ts.map