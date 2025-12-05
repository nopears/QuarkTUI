/**
 * QuarkTUI - Drawing Primitives
 *
 * Box drawing characters and layout utilities for building
 * framed UI components in the terminal.
 */
import process from "node:process";
import { getTerminalSize } from "./terminal";
import { getCurrentTheme, RESET } from "./theme";
import { visibleLength, repeat } from "./style";
// =============================================================================
// Box Drawing Characters
// =============================================================================
/**
 * Box drawing characters for creating frames and borders.
 * Uses Unicode rounded corner characters for a modern look.
 */
export const BOX = {
    /** Top-left corner: ╭ */
    topLeft: "╭",
    /** Top-right corner: ╮ */
    topRight: "╮",
    /** Bottom-left corner: ╰ */
    bottomLeft: "╰",
    /** Bottom-right corner: ╯ */
    bottomRight: "╯",
    /** Horizontal line: ─ */
    horizontal: "─",
    /** Vertical line: │ */
    vertical: "│",
    /** Left tee (for dividers): ├ */
    teeLeft: "├",
    /** Right tee (for dividers): ┤ */
    teeRight: "┤",
    /** Top tee: ┬ */
    teeTop: "┬",
    /** Bottom tee: ┴ */
    teeBottom: "┴",
    /** Cross: ┼ */
    cross: "┼",
};
/**
 * Alternative box characters with sharp corners.
 */
export const BOX_SHARP = {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    horizontal: "─",
    vertical: "│",
    teeLeft: "├",
    teeRight: "┤",
    teeTop: "┬",
    teeBottom: "┴",
    cross: "┼",
};
/**
 * Double-line box characters.
 */
export const BOX_DOUBLE = {
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    horizontal: "═",
    vertical: "║",
    teeLeft: "╠",
    teeRight: "╣",
    teeTop: "╦",
    teeBottom: "╩",
    cross: "╬",
};
// =============================================================================
// Layout Constants
// =============================================================================
/** Default horizontal padding (left/right margin from terminal edge) */
export const DEFAULT_PADDING_X = 2;
/** Default vertical padding (top/bottom margin from terminal edge) */
export const DEFAULT_PADDING_Y = 1;
/** Current layout configuration */
let layoutConfig = {
    paddingX: DEFAULT_PADDING_X,
    paddingY: DEFAULT_PADDING_Y,
};
/**
 * Set the layout configuration.
 */
export function setLayout(config) {
    layoutConfig = { ...layoutConfig, ...config };
}
/**
 * Get the current layout configuration.
 */
export function getLayout() {
    return { ...layoutConfig };
}
/**
 * Get the padding values.
 */
export function getPadding() {
    return { x: layoutConfig.paddingX, y: layoutConfig.paddingY };
}
/**
 * Calculate the frame dimensions based on terminal size and padding.
 *
 * @param termSize - Optional terminal size (defaults to current terminal)
 * @returns Frame dimensions
 */
export function getFrameDimensions(termSize) {
    const size = termSize ?? getTerminalSize();
    const { paddingX, paddingY } = layoutConfig;
    const width = size.width - paddingX * 2;
    const height = size.height - paddingY * 2;
    return {
        width,
        height,
        innerWidth: width - 2, // Subtract left and right border
        innerHeight: height - 2, // Subtract top and bottom border
    };
}
/**
 * Calculate vertical padding to center content of a specific height.
 *
 * @param contentHeight - Total lines the content will occupy (including borders, header, footer)
 * @returns The number of empty lines to add at the top for centering
 */
export function calculateCenteringPadding(contentHeight) {
    const { height } = getTerminalSize();
    const padding = Math.max(0, Math.floor((height - contentHeight) / 2));
    return padding;
}
// =============================================================================
// Drawing Primitives
// =============================================================================
/**
 * Get the border color from the current theme.
 */
function getBorderColor() {
    return getCurrentTheme().colors.border;
}
/**
 * Draw horizontal padding (spaces before the frame).
 */
export function drawHorizontalPadding() {
    process.stdout.write(repeat(" ", layoutConfig.paddingX));
}
/**
 * Draw the top border of a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawTopBorder(innerWidth, box = BOX) {
    const color = getBorderColor();
    drawHorizontalPadding();
    console.log(`${color}${box.topLeft}${repeat(box.horizontal, innerWidth)}${box.topRight}${RESET}`);
}
/**
 * Draw the bottom border of a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawBottomBorder(innerWidth, box = BOX) {
    const color = getBorderColor();
    drawHorizontalPadding();
    console.log(`${color}${box.bottomLeft}${repeat(box.horizontal, innerWidth)}${box.bottomRight}${RESET}`);
}
/**
 * Draw a horizontal divider within a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawDivider(innerWidth, box = BOX) {
    const color = getBorderColor();
    drawHorizontalPadding();
    console.log(`${color}${box.teeLeft}${repeat(box.horizontal, innerWidth)}${box.teeRight}${RESET}`);
}
/**
 * Draw an empty line within a frame (just borders with spaces).
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawEmptyLine(innerWidth, box = BOX) {
    const color = getBorderColor();
    drawHorizontalPadding();
    console.log(`${color}${box.vertical}${RESET}${repeat(" ", innerWidth)}${color}${box.vertical}${RESET}`);
}
/**
 * Draw a line of content within a frame.
 * Content is left-aligned and padded to fill the frame width.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawLine(content, innerWidth, box = BOX) {
    const color = getBorderColor();
    const contentLen = visibleLength(content);
    const padding = Math.max(0, innerWidth - contentLen);
    drawHorizontalPadding();
    console.log(`${color}${box.vertical}${RESET}${content}${repeat(" ", padding)}${color}${box.vertical}${RESET}`);
}
/**
 * Draw a centered line of content within a frame.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawCenteredLine(content, innerWidth, box = BOX) {
    const color = getBorderColor();
    const contentLen = visibleLength(content);
    const totalPadding = Math.max(0, innerWidth - contentLen);
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    drawHorizontalPadding();
    console.log(`${color}${box.vertical}${RESET}${repeat(" ", leftPadding)}${content}${repeat(" ", rightPadding)}${color}${box.vertical}${RESET}`);
}
/**
 * Draw a right-aligned line of content within a frame.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawRightAlignedLine(content, innerWidth, box = BOX) {
    const color = getBorderColor();
    const contentLen = visibleLength(content);
    const padding = Math.max(0, innerWidth - contentLen);
    drawHorizontalPadding();
    console.log(`${color}${box.vertical}${RESET}${repeat(" ", padding)}${content}${color}${box.vertical}${RESET}`);
}
// =============================================================================
// Vertical Padding
// =============================================================================
/**
 * Draw vertical padding (empty lines above/below the frame).
 *
 * @param count - Number of empty lines to draw (default: from layout config)
 */
export function drawVerticalPadding(count) {
    const lines = count ?? layoutConfig.paddingY;
    for (let i = 0; i < lines; i++) {
        console.log();
    }
}
// =============================================================================
// Utility Functions
// =============================================================================
/**
 * Calculate how many content lines fit in a frame.
 *
 * @param headerLines - Number of lines used by header
 * @param footerLines - Number of lines used by footer
 * @param dividers - Number of horizontal dividers
 * @returns Number of available content lines
 */
export function calculateContentHeight(headerLines, footerLines, dividers = 2) {
    const { height } = getFrameDimensions();
    // Subtract: top border, bottom border, header, footer, dividers
    const overhead = 2 + headerLines + footerLines + dividers;
    return Math.max(1, height - overhead);
}
/**
 * Create a horizontal line/rule of a specific character.
 *
 * @param width - Width of the line
 * @param char - Character to use (default: ─)
 * @returns The line string
 */
export function horizontalRule(width, char = BOX.horizontal) {
    return repeat(char, width);
}
//# sourceMappingURL=drawing.js.map