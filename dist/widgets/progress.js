/**
 * QuarkTUI - ProgressBar Widget
 *
 * A visual progress indicator with customizable appearance.
 * Supports different styles, labels, and color themes.
 */
import { visibleLength, repeat } from "../core/style";
import { getCurrentTheme, RESET } from "../core/theme";
// =============================================================================
// Character Sets
// =============================================================================
const CHAR_SETS = {
    block: {
        filled: "█",
        empty: "░",
        left: "",
        right: "",
    },
    line: {
        filled: "━",
        empty: "─",
        left: "╸",
        right: "╺",
    },
    ascii: {
        filled: "=",
        empty: "-",
        left: "[",
        right: "]",
    },
    dots: {
        filled: "●",
        empty: "○",
        left: "",
        right: "",
    },
    gradient: {
        filled: "█",
        empty: "▒",
        left: "▐",
        right: "▌",
    },
    audio: {
        filled: "━",
        empty: "─",
        left: "",
        right: "",
    },
};
// =============================================================================
// Helper Functions
// =============================================================================
/**
 * Clamp a value between min and max.
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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
            return " ".repeat(leftPad) + content;
        }
        case "right": {
            return " ".repeat(padding) + content;
        }
        case "left":
        default:
            return content;
    }
}
/**
 * Build the progress bar string.
 */
function buildProgressBar(percentage, barWidth, chars, filledColor, emptyColor, style) {
    const fillWidth = Math.round((percentage / 100) * barWidth);
    const emptyWidth = barWidth - fillWidth;
    // Audio style with position indicator
    if (style === "audio") {
        const hasPosition = fillWidth < barWidth;
        const positionIndicator = "●";
        const filledContent = repeat(chars.filled, fillWidth);
        const emptyContent = repeat(chars.empty, Math.max(0, emptyWidth - (hasPosition ? 1 : 0)));
        const filledPart = filledColor + filledContent + positionIndicator + RESET;
        const emptyPart = emptyColor + emptyContent + RESET;
        return chars.left + filledPart + emptyPart + chars.right;
    }
    const filledPart = filledColor + repeat(chars.filled, fillWidth) + RESET;
    const emptyPart = emptyColor + repeat(chars.empty, emptyWidth) + RESET;
    return chars.left + filledPart + emptyPart + chars.right;
}
/**
 * Format the label based on options.
 */
function formatLabel(percentage, value, max, options) {
    if (options.label !== undefined) {
        return options.label;
    }
    if (options.showValue) {
        return `${Math.round(value)}/${Math.round(max)}`;
    }
    if (options.showPercentage !== false) {
        return `${Math.round(percentage)}%`;
    }
    return "";
}
// =============================================================================
// ProgressBar Widget
// =============================================================================
/**
 * Internal ProgressBar widget class.
 */
class ProgressBarWidget {
    options;
    type = "progress";
    constructor(options) {
        this.options = options;
    }
    render(ctx) {
        const { value, max = 1, width, style = "block", showPercentage = true, labelPosition = "none", valuePosition = "right", align = "left", filledColor, emptyColor, chars: customChars, } = this.options;
        const theme = getCurrentTheme();
        // Calculate percentage
        const normalizedValue = clamp(value, 0, max);
        const percentage = max > 0 ? (normalizedValue / max) * 100 : 0;
        // Get colors
        const fillColor = filledColor ?? theme.colors.highlight;
        const bgColor = emptyColor ?? theme.colors.textMuted;
        // Get character set and apply custom overrides
        const baseChars = CHAR_SETS[style] ?? CHAR_SETS.block;
        const chars = {
            ...baseChars,
            ...customChars,
        };
        // Format label and value
        const label = this.options.label || "";
        const labelLen = visibleLength(label);
        const valueStr = this.options.showValue
            ? `${Math.round(normalizedValue)}/${Math.round(max)}`
            : this.options.showPercentage !== false
                ? `${Math.round(percentage)}%`
                : "";
        const valueLen = visibleLength(valueStr);
        // Calculate bar width
        const bracketsWidth = visibleLength(chars.left) + visibleLength(chars.right);
        let barWidth;
        if (width) {
            barWidth = width - bracketsWidth;
        }
        else {
            // Auto-fill available width, accounting for labels and values
            let totalSpace = 0;
            if (labelPosition === "left" && labelLen > 0) {
                totalSpace += labelLen + 1; // +1 for space separator
            }
            if (labelPosition === "right" && labelLen > 0) {
                totalSpace += labelLen + 1; // +1 for space separator
            }
            if (valuePosition === "left" && valueLen > 0) {
                totalSpace += valueLen + 1; // +1 for space separator
            }
            if (valuePosition === "right" && valueLen > 0) {
                totalSpace += valueLen + 1; // +1 for space separator
            }
            barWidth = Math.max(1, ctx.innerWidth - bracketsWidth - totalSpace);
        }
        barWidth = Math.max(1, barWidth);
        // Build the bar
        const bar = buildProgressBar(percentage, barWidth, chars, fillColor, bgColor, style);
        // Build the final output
        let output;
        const parts = [];
        // Add left label
        if (labelPosition === "left" && labelLen > 0) {
            parts.push(label);
        }
        // Add left value
        if (valuePosition === "left" && valueLen > 0) {
            parts.push(valueStr);
        }
        // Add bar
        parts.push(bar);
        // Add right value
        if (valuePosition === "right" && valueLen > 0) {
            parts.push(valueStr);
        }
        // Add right label
        if (labelPosition === "right" && labelLen > 0) {
            parts.push(label);
        }
        output = parts.join(" ");
        // Apply alignment
        const alignedOutput = alignContent(output, ctx.innerWidth, align);
        return [alignedOutput];
    }
}
// =============================================================================
// Public Factory Function
// =============================================================================
/**
 * Create a ProgressBar widget.
 *
 * @param options - Progress bar configuration
 * @returns A ProgressBar widget
 *
 * @example
 * // Simple progress bar (50%)
 * ProgressBar({ value: 0.5 })
 *
 * @example
 * // Progress bar with custom max and value display
 * ProgressBar({ value: 50, max: 100, showValue: true })
 *
 * @example
 * // Audio player style with position indicator
 * ProgressBar({
 *   value: 45,
 *   max: 100,
 *   style: "audio",
 *   label: "Now Playing",
 *   labelPosition: "left",
 *   valuePosition: "right",
 * })
 *
 * @example
 * // ASCII style with label on left and percentage on right
 * ProgressBar({
 *   value: 3,
 *   max: 10,
 *   style: "ascii",
 *   label: "Loading",
 *   labelPosition: "left",
 *   valuePosition: "right",
 * })
 *
 * @example
 * // Custom characters
 * ProgressBar({
 *   value: 0.6,
 *   chars: { filled: "▓", empty: "░", left: "[", right: "]" },
 * })
 *
 * @example
 * // Centered progress bar with custom label
 * ProgressBar({
 *   value: 0.33,
 *   align: "center",
 *   label: "Loading...",
 *   width: 40,
 * })
 */
export function ProgressBar(options) {
    return new ProgressBarWidget(options);
}
/**
 * Create a simple progress bar with just a value.
 * Convenience wrapper for common use case.
 *
 * @param value - Progress value from 0 to 1
 * @param style - Optional visual style
 * @returns A ProgressBar widget
 *
 * @example
 * Progress(0.5)
 * Progress(0.75, "line")
 */
export function Progress(value, style = "block") {
    return new ProgressBarWidget({ value, style });
}
//# sourceMappingURL=progress.js.map