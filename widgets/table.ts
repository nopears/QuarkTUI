/**
 * QuarkTUI - Table Widget
 *
 * A table widget for displaying tabular data with columns, headers,
 * and styled cells.
 */

import {
  style as applyStyle,
  visibleLength,
  type StyleType,
} from "../core/style";
import type { Widget, RenderContext, Alignment } from "./types";

// =============================================================================
// Types
// =============================================================================

/**
 * A table cell can be a plain string or a styled cell object.
 */
export type TableCell =
  | string
  | {
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

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Pad and align text within a given width.
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
      const rightPad = padding - leftPad;
      return " ".repeat(leftPad) + text + " ".repeat(rightPad);
    }
    case "right": {
      return " ".repeat(padding) + text;
    }
    case "left":
    default:
      return text + " ".repeat(padding);
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

/**
 * Get the text content from a cell.
 */
function getCellText(cell: TableCell): string {
  if (typeof cell === "string") {
    return cell;
  }
  return cell.text;
}

/**
 * Get the style from a cell.
 */
function getCellStyle(cell: TableCell): StyleType | StyleType[] | undefined {
  if (typeof cell === "string") {
    return undefined;
  }
  return cell.style;
}

/**
 * Calculate total table width from columns.
 */
function calculateTableWidth(columns: TableColumn[]): number {
  return columns.reduce((sum, col) => sum + col.width, 0);
}

/**
 * Calculate left padding to align the table within the container.
 */
function calculateLeftPadding(
  tableWidth: number,
  containerWidth: number,
  alignment: Alignment,
): number {
  if (tableWidth >= containerWidth) {
    return 0;
  }

  const padding = containerWidth - tableWidth;

  switch (alignment) {
    case "center":
      return Math.floor(padding / 2);
    case "right":
      return padding;
    case "left":
    default:
      return 0;
  }
}

// =============================================================================
// Table Widget
// =============================================================================

/**
 * Internal Table widget class.
 */
class TableWidget implements Widget {
  readonly type = "table" as const;

  constructor(private options: TableOptions) {}

  render(ctx: RenderContext): string[] {
    const {
      columns,
      rows,
      align = "left",
      showHeader = true,
      showSeparator = true,
      headerStyle = "bold",
    } = this.options;

    const lines: string[] = [];
    const tableWidth = calculateTableWidth(columns);
    const leftPadding = calculateLeftPadding(tableWidth, ctx.innerWidth, align);
    const paddingStr = " ".repeat(leftPadding);

    // Render header row
    if (showHeader) {
      let headerLine = paddingStr;

      for (const column of columns) {
        const alignedText = alignText(
          column.header,
          column.width,
          column.align ?? "left",
        );
        headerLine += styleText(alignedText, headerStyle);
      }

      lines.push(headerLine);

      // Render separator
      if (showSeparator) {
        let separatorLine = paddingStr;

        for (const column of columns) {
          separatorLine += styleText("─".repeat(column.width), "dim");
        }

        lines.push(separatorLine);
      }
    }

    // Render data rows
    for (const row of rows) {
      let rowLine = paddingStr;

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const cell = row[i];

        if (!column) continue;

        const cellText = cell ? getCellText(cell) : "";
        const cellStyle = cell ? getCellStyle(cell) : undefined;
        const alignedText = alignText(
          cellText,
          column.width,
          column.align ?? "left",
        );

        rowLine += styleText(alignedText, cellStyle);
      }

      lines.push(rowLine);
    }

    return lines;
  }
}

// =============================================================================
// Public Factory Function
// =============================================================================

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
export function Table(options: TableOptions): Widget {
  return new TableWidget(options);
}
