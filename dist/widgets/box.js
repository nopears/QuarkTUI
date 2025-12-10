/**
 * QuarkTUI - Box/Panel Widget
 *
 * A container widget that wraps content in a bordered box.
 * Supports various border styles, titles, footers, and customizable padding.
 */
import { style as applyStyle, visibleLength, repeat, } from "../core/style";
import { getCurrentTheme } from "../core/theme";
const BOX_CHARS = {
    rounded: {
        topLeft: "╭",
        topRight: "╮",
        bottomLeft: "╰",
        bottomRight: "╯",
        horizontal: "─",
        vertical: "│",
    },
    sharp: {
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        horizontal: "─",
        vertical: "│",
    },
    double: {
        topLeft: "╔",
        topRight: "╗",
        bottomLeft: "╚",
        bottomRight: "╝",
        horizontal: "═",
        vertical: "║",
    },
    thick: {
        topLeft: "┏",
        topRight: "┓",
        bottomLeft: "┗",
        bottomRight: "┛",
        horizontal: "━",
        vertical: "┃",
    },
    dashed: {
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        horizontal: "╌",
        vertical: "╎",
    },
    ascii: {
        topLeft: "+",
        topRight: "+",
        bottomLeft: "+",
        bottomRight: "+",
        horizontal: "-",
        vertical: "|",
    },
    none: {
        topLeft: " ",
        topRight: " ",
        bottomLeft: " ",
        bottomRight: " ",
        horizontal: " ",
        vertical: " ",
    },
};
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
 * Wrap text to fit within a specified width.
 */
function wrapText(text, maxWidth) {
    if (maxWidth <= 0) {
        return [text];
    }
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    for (const word of words) {
        const wordLen = visibleLength(word);
        if (currentLine === "") {
            // First word on the line
            if (wordLen > maxWidth) {
                // Word is too long, need to break it
                let remaining = word;
                while (visibleLength(remaining) > maxWidth) {
                    lines.push(remaining.slice(0, maxWidth));
                    remaining = remaining.slice(maxWidth);
                }
                if (remaining) {
                    currentLine = remaining;
                }
            }
            else {
                currentLine = word;
            }
        }
        else {
            const testLine = currentLine + " " + word;
            if (visibleLength(testLine) <= maxWidth) {
                currentLine = testLine;
            }
            else {
                lines.push(currentLine);
                if (wordLen > maxWidth) {
                    // Word is too long, need to break it
                    let remaining = word;
                    while (visibleLength(remaining) > maxWidth) {
                        lines.push(remaining.slice(0, maxWidth));
                        remaining = remaining.slice(maxWidth);
                    }
                    currentLine = remaining || "";
                }
                else {
                    currentLine = word;
                }
            }
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines.length > 0 ? lines : [""];
}
/**
 * Render content to lines.
 */
function renderContent(content, ctx) {
    const lines = [];
    const items = Array.isArray(content) ? content : [content];
    for (const item of items) {
        if (typeof item === "string") {
            // Handle multi-line strings
            const stringLines = item.split("\n");
            for (const line of stringLines) {
                lines.push(line);
            }
        }
        else if (isWidget(item)) {
            const widgetLines = item.render(ctx);
            lines.push(...widgetLines);
        }
    }
    return lines;
}
/**
 * Calculate the maximum width needed for content.
 */
function calculateContentWidth(lines) {
    return Math.max(...lines.map((line) => visibleLength(line)), 0);
}
/**
 * Align text within a given width.
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
/**
 * Build a border line with optional label.
 */
function buildBorderLine(chars, innerWidth, leftCorner, rightCorner, label, labelAlign, labelStyle, borderStyle) {
    if (!label) {
        const line = repeat(chars.horizontal, innerWidth);
        const styledLine = styleText(line, borderStyle);
        return (styleText(leftCorner, borderStyle) +
            styledLine +
            styleText(rightCorner, borderStyle));
    }
    // Build line with label
    const labelText = ` ${label} `;
    const styledLabel = styleText(labelText, labelStyle);
    const labelLen = visibleLength(labelText);
    const remainingWidth = Math.max(0, innerWidth - labelLen);
    let leftLineLen;
    let rightLineLen;
    switch (labelAlign) {
        case "left":
            leftLineLen = 1;
            rightLineLen = remainingWidth - leftLineLen;
            break;
        case "right":
            rightLineLen = 1;
            leftLineLen = remainingWidth - rightLineLen;
            break;
        case "center":
        default:
            leftLineLen = Math.floor(remainingWidth / 2);
            rightLineLen = remainingWidth - leftLineLen;
            break;
    }
    const leftLine = styleText(repeat(chars.horizontal, leftLineLen), borderStyle);
    const rightLine = styleText(repeat(chars.horizontal, rightLineLen), borderStyle);
    return (styleText(leftCorner, borderStyle) +
        leftLine +
        styledLabel +
        rightLine +
        styleText(rightCorner, borderStyle));
}
// =============================================================================
// Box Widget
// =============================================================================
/**
 * Internal Box widget class.
 */
class BoxWidget {
    options;
    type = "box";
    constructor(options) {
        this.options = options;
    }
    render(ctx) {
        const { content, style: boxStyle = "rounded", title, titleAlign = "left", titleStyle, footer, footerAlign = "left", footerStyle, paddingX = 1, paddingY = 0, borderStyle = "border", width, minWidth = 1, maxWidth, contentAlign = "left", align = "left", } = this.options;
        const chars = BOX_CHARS[boxStyle] ?? BOX_CHARS.rounded;
        const theme = getCurrentTheme();
        // Calculate effective max width
        const effectiveMaxWidth = maxWidth
            ? Math.min(maxWidth, ctx.innerWidth)
            : ctx.innerWidth;
        // Calculate inner width (excluding borders and padding)
        const contentPadding = paddingX * 2;
        const maxContentWidth = effectiveMaxWidth - 2 - contentPadding; // 2 for borders
        // Create a render context for content
        const contentCtx = {
            innerWidth: maxContentWidth,
            contentHeight: ctx.contentHeight,
        };
        // Render content
        let contentLines = renderContent(content, contentCtx);
        // Wrap long lines if needed
        const wrappedLines = [];
        for (const line of contentLines) {
            if (visibleLength(line) > maxContentWidth) {
                wrappedLines.push(...wrapText(line, maxContentWidth));
            }
            else {
                wrappedLines.push(line);
            }
        }
        contentLines = wrappedLines;
        // Calculate actual content width
        const contentWidth = calculateContentWidth(contentLines);
        // Calculate box inner width
        let innerWidth;
        if (width !== undefined) {
            innerWidth = Math.max(minWidth, width - 2); // Subtract borders
        }
        else {
            // Auto-fit: use content width + padding
            innerWidth = contentWidth + contentPadding;
            // Account for title/footer width
            if (title) {
                const titleLen = visibleLength(title) + 4; // +4 for spacing
                innerWidth = Math.max(innerWidth, titleLen);
            }
            if (footer) {
                const footerLen = visibleLength(footer) + 4;
                innerWidth = Math.max(innerWidth, footerLen);
            }
            innerWidth = Math.max(minWidth, innerWidth);
        }
        // Clamp to max width
        if (effectiveMaxWidth) {
            innerWidth = Math.min(innerWidth, effectiveMaxWidth - 2);
        }
        // Calculate content area width (inside padding)
        const contentAreaWidth = innerWidth - contentPadding;
        const lines = [];
        const paddingStr = repeat(" ", paddingX);
        // Build top border
        const topBorder = buildBorderLine(chars, innerWidth, chars.topLeft, chars.topRight, title, titleAlign, titleStyle ?? "bold", borderStyle);
        lines.push(topBorder);
        // Add top padding lines
        for (let i = 0; i < paddingY; i++) {
            const paddingLine = styleText(chars.vertical, borderStyle) +
                repeat(" ", innerWidth) +
                styleText(chars.vertical, borderStyle);
            lines.push(paddingLine);
        }
        // Add content lines
        for (const line of contentLines) {
            const alignedContent = alignText(line, contentAreaWidth, contentAlign);
            const contentLine = styleText(chars.vertical, borderStyle) +
                paddingStr +
                alignedContent +
                repeat(" ", contentAreaWidth - visibleLength(alignedContent)) +
                paddingStr +
                styleText(chars.vertical, borderStyle);
            lines.push(contentLine);
        }
        // Add bottom padding lines
        for (let i = 0; i < paddingY; i++) {
            const paddingLine = styleText(chars.vertical, borderStyle) +
                repeat(" ", innerWidth) +
                styleText(chars.vertical, borderStyle);
            lines.push(paddingLine);
        }
        // Build bottom border
        const bottomBorder = buildBorderLine(chars, innerWidth, chars.bottomLeft, chars.bottomRight, footer, footerAlign, footerStyle ?? "dim", borderStyle);
        lines.push(bottomBorder);
        // Apply overall alignment
        if (align !== "left") {
            const boxWidth = innerWidth + 2; // +2 for borders
            return lines.map((line) => alignText(line, ctx.innerWidth, align));
        }
        return lines;
    }
}
// =============================================================================
// Public Factory Functions
// =============================================================================
/**
 * Create a Box widget.
 *
 * @param optionsOrContent - Box configuration or content
 * @returns A Box widget
 *
 * @example
 * // Simple box with string content
 * Box("Hello, World!")
 *
 * @example
 * // Box with title
 * Box({
 *   content: "This is the content",
 *   title: "My Box",
 * })
 *
 * @example
 * // Box with title and footer
 * Box({
 *   content: ["Line 1", "Line 2", "Line 3"],
 *   title: "Information",
 *   footer: "Press Enter to continue",
 *   style: "double",
 * })
 *
 * @example
 * // Styled box with custom padding
 * Box({
 *   content: "Important message!",
 *   title: "Warning",
 *   titleStyle: "warning",
 *   borderStyle: "warning",
 *   paddingX: 2,
 *   paddingY: 1,
 * })
 *
 * @example
 * // Centered box with fixed width
 * Box({
 *   content: "Centered content",
 *   width: 40,
 *   align: "center",
 *   contentAlign: "center",
 * })
 *
 * @example
 * // Box with nested widgets
 * Box({
 *   content: [
 *     Text("Header", { style: "bold" }),
 *     Divider(),
 *     BulletList(["Item 1", "Item 2"]),
 *   ],
 *   title: "Widget Box",
 * })
 *
 * @example
 * // ASCII style for compatibility
 * Box({
 *   content: "Plain text",
 *   style: "ascii",
 * })
 */
export function Box(optionsOrContent) {
    if (typeof optionsOrContent === "string" ||
        Array.isArray(optionsOrContent) ||
        isWidget(optionsOrContent)) {
        return new BoxWidget({ content: optionsOrContent });
    }
    return new BoxWidget(optionsOrContent);
}
/**
 * Create a Panel widget (alias for Box with default styling).
 *
 * @param title - Panel title
 * @param content - Panel content
 * @param options - Additional options
 * @returns A Box widget styled as a panel
 *
 * @example
 * Panel("Settings", "Configure your options here")
 *
 * @example
 * Panel("User Info", [
 *   KeyValue("Name:", "John Doe"),
 *   KeyValue("Email:", "john@example.com"),
 * ])
 *
 * @example
 * Panel("Status", "All systems operational", {
 *   borderStyle: "success",
 *   titleStyle: "success",
 * })
 */
export function Panel(title, content, options) {
    return new BoxWidget({
        content,
        title,
        style: "rounded",
        paddingX: 1,
        paddingY: 0,
        ...options,
    });
}
/**
 * Create an info box with info styling.
 *
 * @param content - Box content
 * @param title - Optional title (default: "Info")
 * @returns A styled info box
 *
 * @example
 * InfoBox("This is helpful information.")
 * InfoBox("Custom titled info", "Note")
 */
export function InfoBox(content, title = "Info") {
    return new BoxWidget({
        content,
        title,
        titleStyle: "info",
        borderStyle: "info",
        style: "rounded",
        paddingX: 1,
    });
}
/**
 * Create a warning box with warning styling.
 *
 * @param content - Box content
 * @param title - Optional title (default: "Warning")
 * @returns A styled warning box
 *
 * @example
 * WarningBox("Please proceed with caution.")
 */
export function WarningBox(content, title = "Warning") {
    return new BoxWidget({
        content,
        title,
        titleStyle: "warning",
        borderStyle: "warning",
        style: "rounded",
        paddingX: 1,
    });
}
/**
 * Create an error box with error styling.
 *
 * @param content - Box content
 * @param title - Optional title (default: "Error")
 * @returns A styled error box
 *
 * @example
 * ErrorBox("Something went wrong!")
 */
export function ErrorBox(content, title = "Error") {
    return new BoxWidget({
        content,
        title,
        titleStyle: "error",
        borderStyle: "error",
        style: "rounded",
        paddingX: 1,
    });
}
/**
 * Create a success box with success styling.
 *
 * @param content - Box content
 * @param title - Optional title (default: "Success")
 * @returns A styled success box
 *
 * @example
 * SuccessBox("Operation completed successfully!")
 */
export function SuccessBox(content, title = "Success") {
    return new BoxWidget({
        content,
        title,
        titleStyle: "success",
        borderStyle: "success",
        style: "rounded",
        paddingX: 1,
    });
}
//# sourceMappingURL=box.js.map