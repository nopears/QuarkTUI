/**
 * QuarkTUI - Columns Layout Widget
 *
 * A layout widget for arranging content in multiple columns.
 * Supports fixed widths, flexible/auto widths, and various alignment options.
 */
import { style as applyStyle, visibleLength, repeat, } from "../core/style";
// =============================================================================
// Helper Functions
// =============================================================================
/**
 * Check if an object is a Widget.
 */
function isWidget(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        "render" in obj &&
        typeof obj.render === "function");
}
/**
 * Normalize a column definition.
 */
function normalizeColumn(col, defaultWidth) {
    if (typeof col === "string") {
        return { content: col, width: defaultWidth };
    }
    // Check if it's a Widget (has render method)
    if (isWidget(col)) {
        return { content: col, width: defaultWidth };
    }
    // It's a ColumnDef
    const colDef = col;
    return { ...colDef, width: colDef.width ?? defaultWidth };
}
/**
 * Get the visible content from a column.
 */
function getColumnContent(col, ctx) {
    if (typeof col.content === "string") {
        return [col.content];
    }
    // It's a Widget - render it
    return col.content.render(ctx);
}
/**
 * Apply styles to text.
 */
function styleText(text, styles) {
    if (!styles) {
        return text;
    }
    if (Array.isArray(styles)) {
        return applyStyle(text, ...styles);
    }
    return applyStyle(text, styles);
}
/**
 * Calculate column widths based on specifications.
 */
function calculateColumnWidths(columns, contents, availableWidth, gap, minWidth) {
    const totalGapWidth = gap * Math.max(0, columns.length - 1);
    let remainingWidth = availableWidth - totalGapWidth;
    const widths = new Array(columns.length).fill(null);
    let flexCount = 0;
    let percentTotal = 0;
    // First pass: calculate fixed, auto, and percentage widths
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const content = contents[i];
        const width = col?.width ?? "flex";
        if (typeof width === "number") {
            // Fixed width
            widths[i] = Math.max(minWidth, width);
            remainingWidth -= widths[i];
        }
        else if (width === "auto") {
            // Auto width - fit content
            const maxContentWidth = content
                ? Math.max(...content.map((line) => visibleLength(line)), minWidth)
                : minWidth;
            widths[i] = maxContentWidth;
            remainingWidth -= widths[i];
        }
        else if (width === "flex") {
            flexCount++;
        }
        else if (width.endsWith("%")) {
            const percent = parseFloat(width) / 100;
            percentTotal += percent;
            // Will calculate actual width in second pass
        }
    }
    // Second pass: calculate percentage widths
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const width = col?.width ?? "flex";
        if (typeof width === "string" && width.endsWith("%")) {
            const percent = parseFloat(width) / 100;
            widths[i] = Math.max(minWidth, Math.floor(availableWidth * percent));
            remainingWidth -= widths[i];
        }
    }
    // Third pass: distribute remaining width to flex columns
    if (flexCount > 0) {
        const flexWidth = Math.max(minWidth, Math.floor(remainingWidth / flexCount));
        let flexAssigned = 0;
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const width = col?.width ?? "flex";
            if (width === "flex") {
                flexAssigned++;
                // Last flex column gets any remaining pixels
                if (flexAssigned === flexCount) {
                    widths[i] = Math.max(minWidth, remainingWidth - flexWidth * (flexCount - 1));
                }
                else {
                    widths[i] = flexWidth;
                }
            }
        }
    }
    // Ensure all widths are set and non-negative
    return widths.map((w) => Math.max(minWidth, w ?? minWidth));
}
/**
 * Pad or truncate text to fit a specific width.
 */
function fitText(text, width, alignment) {
    const textLen = visibleLength(text);
    if (textLen > width) {
        // Truncate with ellipsis if too long
        if (width > 1) {
            // Simple truncation - find approximate cut point
            let result = "";
            let len = 0;
            for (const char of text) {
                if (len >= width - 1)
                    break;
                result += char;
                // This is a simplification; ANSI codes complicate this
                if (!char.startsWith("\x1b")) {
                    len++;
                }
            }
            return result + "…";
        }
        return text.slice(0, width);
    }
    if (textLen < width) {
        const padding = width - textLen;
        switch (alignment) {
            case "center": {
                const leftPad = Math.floor(padding / 2);
                const rightPad = padding - leftPad;
                return repeat(" ", leftPad) + text + repeat(" ", rightPad);
            }
            case "right": {
                return repeat(" ", padding) + text;
            }
            case "left":
            default:
                return text + repeat(" ", padding);
        }
    }
    return text;
}
/**
 * Apply alignment to content within a given width.
 */
function alignContent(content, width, alignment) {
    const contentLen = visibleLength(content);
    if (contentLen >= width) {
        return content;
    }
    const padding = width - contentLen;
    switch (alignment) {
        case "center": {
            const leftPad = Math.floor(padding / 2);
            return repeat(" ", leftPad) + content;
        }
        case "right": {
            return repeat(" ", padding) + content;
        }
        case "left":
        default:
            return content;
    }
}
// =============================================================================
// Columns Widget
// =============================================================================
/**
 * Internal Columns widget class.
 */
class ColumnsWidget {
    options;
    type = "columns";
    constructor(options) {
        this.options = options;
    }
    render(ctx) {
        const { columns, gap = 2, align = "left", defaultWidth = "flex", minWidth = 1, } = this.options;
        if (columns.length === 0) {
            return [];
        }
        // Normalize column definitions
        const normalizedColumns = columns.map((col) => normalizeColumn(col, defaultWidth));
        // Render content for each column
        const contents = normalizedColumns.map((col) => getColumnContent(col, ctx));
        // Calculate column widths
        const widths = calculateColumnWidths(normalizedColumns, contents, ctx.innerWidth, gap, minWidth);
        // Find the maximum number of lines across all columns
        const maxLines = Math.max(...contents.map((c) => c.length), 1);
        // Build output lines
        const lines = [];
        const gapStr = repeat(" ", gap);
        for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
            const parts = [];
            for (let colIdx = 0; colIdx < normalizedColumns.length; colIdx++) {
                const col = normalizedColumns[colIdx];
                const content = contents[colIdx] ?? [];
                const width = widths[colIdx] ?? minWidth;
                const lineContent = content[lineIdx] ?? "";
                // Apply column style if it's string content
                let styledContent = lineContent;
                if (typeof col.content === "string" && col.style) {
                    styledContent = styleText(lineContent, col.style);
                }
                // Fit content to column width with alignment
                const fittedContent = fitText(styledContent, width, col.align ?? "left");
                parts.push(fittedContent);
            }
            const rowContent = parts.join(gapStr);
            lines.push(alignContent(rowContent, ctx.innerWidth, align));
        }
        return lines;
    }
}
// =============================================================================
// Public Factory Functions
// =============================================================================
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
export function Columns(optionsOrColumns) {
    if (Array.isArray(optionsOrColumns)) {
        return new ColumnsWidget({ columns: optionsOrColumns });
    }
    return new ColumnsWidget(optionsOrColumns);
}
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
export function KeyValue(label, value, labelWidth = "auto") {
    return new ColumnsWidget({
        columns: [
            { content: label, width: labelWidth, align: "right", style: "dim" },
            { content: value, width: "flex" },
        ],
        gap: 2,
    });
}
//# sourceMappingURL=columns.js.map