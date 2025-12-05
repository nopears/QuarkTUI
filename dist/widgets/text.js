/**
 * QuarkTUI - Text Widget
 *
 * The fundamental text display widget.
 * Supports alignment and styling.
 */
import { style as applyStyle, visibleLength, } from "../core/style";
// =============================================================================
// Helper Functions
// =============================================================================
/**
 * Apply alignment to text within a given width.
 */
function alignText(text, width, alignment) {
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
function styleText(text, styles) {
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
class TextWidget {
    content;
    options;
    type = "text";
    constructor(content, options = {}) {
        this.content = content;
        this.options = options;
    }
    render(ctx) {
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
export function Text(content, options) {
    return new TextWidget(content, options);
}
//# sourceMappingURL=text.js.map