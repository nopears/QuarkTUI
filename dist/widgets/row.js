/**
 * QuarkTUI - Row Widget
 *
 * Horizontal layout widget that arranges other widgets in a row.
 */
import { visibleLength } from "../core/style";
// =============================================================================
// Helper Functions
// =============================================================================
/**
 * Apply alignment to a row within a given width.
 */
function alignRow(row, width, alignment) {
    const rowLen = visibleLength(row);
    if (rowLen >= width) {
        return row;
    }
    const padding = width - rowLen;
    switch (alignment) {
        case "center": {
            const leftPad = Math.floor(padding / 2);
            return " ".repeat(leftPad) + row;
        }
        case "right": {
            return " ".repeat(padding) + row;
        }
        case "left":
        default:
            return row;
    }
}
// =============================================================================
// Row Widget
// =============================================================================
/**
 * Internal Row widget class.
 */
class RowWidget {
    items;
    options;
    type = "row";
    constructor(items, options = {}) {
        this.items = items;
        this.options = options;
    }
    render(ctx) {
        const { gap = 1, align = "left" } = this.options;
        // Render each child widget and take only the first line from each
        // (Row is a single-line horizontal layout)
        const renderedItems = [];
        // Pass a zero-width context to children so they don't apply their own alignment
        // (Row handles alignment of the entire row)
        const childCtx = { ...ctx, innerWidth: 0 };
        for (const item of this.items) {
            const lines = item.render(childCtx);
            // Take the first line, or empty string if widget returns nothing
            renderedItems.push(lines[0] ?? "");
        }
        // Join items with gap spacing
        const gapStr = " ".repeat(gap);
        const rowContent = renderedItems.join(gapStr);
        // Apply alignment to the entire row
        const alignedRow = alignRow(rowContent, ctx.innerWidth, align);
        // Row always returns a single line
        return [alignedRow];
    }
}
// =============================================================================
// Public Factory Function
// =============================================================================
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
export function Row(items, options) {
    return new RowWidget(items, options);
}
//# sourceMappingURL=row.js.map