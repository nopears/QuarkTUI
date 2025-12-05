/**
 * QuarkTUI - Drawing Primitives
 *
 * Box drawing characters and layout utilities for building
 * framed UI components in the terminal.
 */
import { type TerminalSize } from "./terminal";
/**
 * Box drawing characters for creating frames and borders.
 * Uses Unicode rounded corner characters for a modern look.
 */
export declare const BOX: {
    /** Top-left corner: ╭ */
    readonly topLeft: "╭";
    /** Top-right corner: ╮ */
    readonly topRight: "╮";
    /** Bottom-left corner: ╰ */
    readonly bottomLeft: "╰";
    /** Bottom-right corner: ╯ */
    readonly bottomRight: "╯";
    /** Horizontal line: ─ */
    readonly horizontal: "─";
    /** Vertical line: │ */
    readonly vertical: "│";
    /** Left tee (for dividers): ├ */
    readonly teeLeft: "├";
    /** Right tee (for dividers): ┤ */
    readonly teeRight: "┤";
    /** Top tee: ┬ */
    readonly teeTop: "┬";
    /** Bottom tee: ┴ */
    readonly teeBottom: "┴";
    /** Cross: ┼ */
    readonly cross: "┼";
};
/**
 * Alternative box characters with sharp corners.
 */
export declare const BOX_SHARP: {
    readonly topLeft: "┌";
    readonly topRight: "┐";
    readonly bottomLeft: "└";
    readonly bottomRight: "┘";
    readonly horizontal: "─";
    readonly vertical: "│";
    readonly teeLeft: "├";
    readonly teeRight: "┤";
    readonly teeTop: "┬";
    readonly teeBottom: "┴";
    readonly cross: "┼";
};
/**
 * Double-line box characters.
 */
export declare const BOX_DOUBLE: {
    readonly topLeft: "╔";
    readonly topRight: "╗";
    readonly bottomLeft: "╚";
    readonly bottomRight: "╝";
    readonly horizontal: "═";
    readonly vertical: "║";
    readonly teeLeft: "╠";
    readonly teeRight: "╣";
    readonly teeTop: "╦";
    readonly teeBottom: "╩";
    readonly cross: "╬";
};
/** Default horizontal padding (left/right margin from terminal edge) */
export declare const DEFAULT_PADDING_X = 2;
/** Default vertical padding (top/bottom margin from terminal edge) */
export declare const DEFAULT_PADDING_Y = 1;
/**
 * Layout configuration for drawing operations.
 */
export interface LayoutConfig {
    /** Horizontal padding from terminal edges */
    paddingX: number;
    /** Vertical padding from terminal edges */
    paddingY: number;
}
/**
 * Set the layout configuration.
 */
export declare function setLayout(config: Partial<LayoutConfig>): void;
/**
 * Get the current layout configuration.
 */
export declare function getLayout(): LayoutConfig;
/**
 * Get the padding values.
 */
export declare function getPadding(): {
    x: number;
    y: number;
};
/**
 * Dimensions of the drawable frame area.
 */
export interface FrameDimensions {
    /** Total width available for the frame */
    width: number;
    /** Total height available for the frame */
    height: number;
    /** Width inside the frame borders */
    innerWidth: number;
    /** Height inside the frame borders (excluding header/footer) */
    innerHeight: number;
}
/**
 * Calculate the frame dimensions based on terminal size and padding.
 *
 * @param termSize - Optional terminal size (defaults to current terminal)
 * @returns Frame dimensions
 */
export declare function getFrameDimensions(termSize?: TerminalSize): FrameDimensions;
/**
 * Calculate vertical padding to center content of a specific height.
 *
 * @param contentHeight - Total lines the content will occupy (including borders, header, footer)
 * @returns The number of empty lines to add at the top for centering
 */
export declare function calculateCenteringPadding(contentHeight: number): number;
/**
 * Draw horizontal padding (spaces before the frame).
 */
export declare function drawHorizontalPadding(): void;
/**
 * Draw the top border of a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export declare function drawTopBorder(innerWidth: number, box?: typeof BOX): void;
/**
 * Draw the bottom border of a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export declare function drawBottomBorder(innerWidth: number, box?: typeof BOX): void;
/**
 * Draw a horizontal divider within a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export declare function drawDivider(innerWidth: number, box?: typeof BOX): void;
/**
 * Draw an empty line within a frame (just borders with spaces).
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export declare function drawEmptyLine(innerWidth: number, box?: typeof BOX): void;
/**
 * Draw a line of content within a frame.
 * Content is left-aligned and padded to fill the frame width.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export declare function drawLine(content: string, innerWidth: number, box?: typeof BOX): void;
/**
 * Draw a centered line of content within a frame.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export declare function drawCenteredLine(content: string, innerWidth: number, box?: typeof BOX): void;
/**
 * Draw a right-aligned line of content within a frame.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export declare function drawRightAlignedLine(content: string, innerWidth: number, box?: typeof BOX): void;
/**
 * Draw vertical padding (empty lines above/below the frame).
 *
 * @param count - Number of empty lines to draw (default: from layout config)
 */
export declare function drawVerticalPadding(count?: number): void;
/**
 * Calculate how many content lines fit in a frame.
 *
 * @param headerLines - Number of lines used by header
 * @param footerLines - Number of lines used by footer
 * @param dividers - Number of horizontal dividers
 * @returns Number of available content lines
 */
export declare function calculateContentHeight(headerLines: number, footerLines: number, dividers?: number): number;
/**
 * Create a horizontal line/rule of a specific character.
 *
 * @param width - Width of the line
 * @param char - Character to use (default: ─)
 * @returns The line string
 */
export declare function horizontalRule(width: number, char?: string): string;
//# sourceMappingURL=drawing.d.ts.map