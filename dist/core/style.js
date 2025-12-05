/**
 * QuarkTUI - Text Styling
 *
 * Utilities for styling text with colors and formatting.
 * Uses the theme system for consistent styling across the application.
 */
import { getCurrentTheme, RESET, BOLD, DIM } from "./theme";
// =============================================================================
// Styling Functions
// =============================================================================
/**
 * Apply one or more styles to text.
 *
 * @param text - The text to style
 * @param styles - One or more style types to apply
 * @returns The styled text with ANSI escape codes
 *
 * @example
 * ```ts
 * style("Hello", "bold")           // Bold text
 * style("Error!", "error")         // Red error text
 * style("Note", "bold", "success") // Bold green text
 * style("Tip", "dim", "muted")     // Dimmed muted text
 * ```
 */
export function style(text, ...styles) {
    if (styles.length === 0) {
        return text;
    }
    const theme = getCurrentTheme();
    let prefix = "";
    for (const s of styles) {
        switch (s) {
            case "dim":
                prefix += DIM;
                break;
            case "bold":
                prefix += BOLD;
                break;
            case "success":
                prefix += theme.colors.success;
                break;
            case "warning":
                prefix += theme.colors.warning;
                break;
            case "error":
                prefix += theme.colors.error;
                break;
            case "info":
                prefix += theme.colors.info;
                break;
            case "accent":
                prefix += theme.colors.accent;
                break;
            case "highlight":
                prefix += theme.colors.highlight;
                break;
            case "muted":
                prefix += theme.colors.textMuted;
                break;
            case "text":
                prefix += theme.colors.text;
                break;
            case "border":
                prefix += theme.colors.border;
                break;
        }
    }
    return `${prefix}${text}${RESET}`;
}
/**
 * Apply raw ANSI codes to text.
 * Use this when you need specific colors not covered by style types.
 *
 * @param text - The text to style
 * @param codes - ANSI escape codes to apply
 * @returns The styled text
 *
 * @example
 * ```ts
 * raw("Custom", "\x1b[35m") // Magenta text
 * ```
 */
export function raw(text, ...codes) {
    if (codes.length === 0) {
        return text;
    }
    return `${codes.join("")}${text}${RESET}`;
}
// =============================================================================
// String Utilities
// =============================================================================
/**
 * Strip ANSI escape codes from a string.
 * Useful for calculating the visible length of styled text.
 *
 * @param str - String potentially containing ANSI codes
 * @returns String with all ANSI codes removed
 */
export function stripAnsi(str) {
    let result = "";
    let i = 0;
    while (i < str.length) {
        if (str[i] === "\x1b" && str[i + 1] === "[") {
            // Skip escape sequence
            i += 2;
            while (i < str.length && str[i] !== "m") {
                i++;
            }
            i++; // Skip the 'm'
        }
        else {
            result += str[i];
            i++;
        }
    }
    return result;
}
/**
 * Get the visible length of a string (excluding ANSI codes).
 *
 * @param str - String potentially containing ANSI codes
 * @returns Number of visible characters
 */
export function visibleLength(str) {
    return stripAnsi(str).length;
}
/**
 * Repeat a string n times.
 *
 * @param char - String to repeat
 * @param count - Number of times to repeat
 * @returns The repeated string
 */
export function repeat(char, count) {
    return char.repeat(Math.max(0, count));
}
/**
 * Pad a string on the right to a specified width.
 * Accounts for ANSI codes in the input string.
 *
 * @param text - Text to pad
 * @param width - Target width
 * @param padChar - Character to use for padding (default: space)
 * @returns Padded string
 */
export function padRight(text, width, padChar = " ") {
    const len = visibleLength(text);
    if (len >= width)
        return text;
    return text + repeat(padChar, width - len);
}
/**
 * Pad a string on the left to a specified width.
 * Accounts for ANSI codes in the input string.
 *
 * @param text - Text to pad
 * @param width - Target width
 * @param padChar - Character to use for padding (default: space)
 * @returns Padded string
 */
export function padLeft(text, width, padChar = " ") {
    const len = visibleLength(text);
    if (len >= width)
        return text;
    return repeat(padChar, width - len) + text;
}
/**
 * Center a string within a specified width.
 * Accounts for ANSI codes in the input string.
 *
 * @param text - Text to center
 * @param width - Target width
 * @param padChar - Character to use for padding (default: space)
 * @returns Centered string
 */
export function padCenter(text, width, padChar = " ") {
    const len = visibleLength(text);
    if (len >= width)
        return text;
    const totalPadding = width - len;
    const left = Math.floor(totalPadding / 2);
    const right = totalPadding - left;
    return repeat(padChar, left) + text + repeat(padChar, right);
}
/**
 * Truncate a string to a maximum visible length.
 * Accounts for ANSI codes and adds ellipsis if truncated.
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum visible length
 * @param ellipsis - String to append when truncated (default: "...")
 * @returns Truncated string
 */
export function truncate(text, maxLength, ellipsis = "...") {
    const stripped = stripAnsi(text);
    if (stripped.length <= maxLength) {
        return text;
    }
    // For simplicity, if the text has ANSI codes, strip them and truncate
    // This loses styling but ensures correct length
    const truncated = stripped.slice(0, maxLength - ellipsis.length);
    return truncated + ellipsis;
}
// =============================================================================
// Deprecated Aliases (for backward compatibility)
// =============================================================================
/**
 * @deprecated Use `style(text, "dim")` instead
 */
export function formatDim(text) {
    return style(text, "dim");
}
/**
 * @deprecated Use `style(text, "bold")` instead
 */
export function formatBold(text) {
    return style(text, "bold");
}
/**
 * @deprecated Use `style(text, "success")` instead
 */
export function formatSuccess(text) {
    return style(text, "success");
}
/**
 * @deprecated Use `style(text, "error")` instead
 */
export function formatError(text) {
    return style(text, "error");
}
/**
 * @deprecated Use `style(text, "warning")` instead
 */
export function formatWarning(text) {
    return style(text, "warning");
}
/**
 * @deprecated Use `style(text, "info")` instead
 */
export function formatInfo(text) {
    return style(text, "info");
}
//# sourceMappingURL=style.js.map