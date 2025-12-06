/**
 * QuarkTUI - Drawing Primitives
 *
 * Box drawing characters and layout utilities for building
 * framed UI components in the terminal.
 */

import {
  getTerminalSize,
  bufferWrite,
  bufferWriteLine,
  type TerminalSize,
} from "./terminal";
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
} as const;

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
} as const;

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
} as const;

// =============================================================================
// Layout Constants
// =============================================================================

/** Default horizontal padding (left/right margin from terminal edge) */
export const DEFAULT_PADDING_X = 4;

/** Default vertical padding (top/bottom margin from terminal edge) */
export const DEFAULT_PADDING_Y = 2;

/** Default internal padding (space between border and content) */
export const DEFAULT_INTERNAL_PADDING = 2;

/** Default maximum frame width */
export const DEFAULT_MAX_FRAME_WIDTH = 60;

/** Default frame width as percentage of terminal width */
export const DEFAULT_FRAME_WIDTH_PERCENT = 0.8;

// =============================================================================
// Layout Configuration
// =============================================================================

/**
 * Layout configuration for drawing operations.
 */
export interface LayoutConfig {
  /** Horizontal padding from terminal edges */
  paddingX: number;
  /** Vertical padding from terminal edges */
  paddingY: number;
}

/** Current layout configuration */
let layoutConfig: LayoutConfig = {
  paddingX: DEFAULT_PADDING_X,
  paddingY: DEFAULT_PADDING_Y,
};

/**
 * Set the layout configuration.
 * Invalidates the cached frame dimensions.
 */
export function setLayout(config: Partial<LayoutConfig>): void {
  layoutConfig = { ...layoutConfig, ...config };
  // Invalidate cache since layout affects dimensions
  cachedFrameDimensions = null;
}

/**
 * Get the current layout configuration.
 */
export function getLayout(): LayoutConfig {
  return { ...layoutConfig };
}

/**
 * Get the padding values.
 */
export function getPadding(): { x: number; y: number } {
  return { x: layoutConfig.paddingX, y: layoutConfig.paddingY };
}

// =============================================================================
// Frame Dimensions
// =============================================================================

/** Cached frame dimensions (invalidated on resize or layout change) */
let cachedFrameDimensions: FrameDimensions | null = null;

/** Whether the resize listener has been registered */
let resizeListenerRegistered = false;

/**
 * Invalidate the cached frame dimensions.
 * Called automatically on terminal resize or layout change.
 */
export function invalidateFrameDimensionsCache(): void {
  cachedFrameDimensions = null;
}

/**
 * Register resize listener to invalidate cache (called once lazily).
 */
function ensureResizeListenerRegistered(): void {
  if (resizeListenerRegistered) return;

  process.stdout.on("resize", () => {
    invalidateFrameDimensionsCache();
  });

  resizeListenerRegistered = true;
}

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
 * Results are cached and automatically invalidated on terminal resize or layout changes.
 *
 * @param termSize - Optional terminal size (defaults to current terminal). If provided, caching is bypassed.
 * @returns Frame dimensions
 */
export function getFrameDimensions(termSize?: TerminalSize): FrameDimensions {
  const { paddingX, paddingY } = layoutConfig;

  // If custom termSize is provided, calculate without caching
  if (termSize) {
    const width = termSize.width - paddingX * 2;
    const height = termSize.height - paddingY * 2;
    return {
      width,
      height,
      innerWidth: width - 2,
      innerHeight: height - 2,
    };
  }

  // Ensure resize listener is registered for automatic cache invalidation
  ensureResizeListenerRegistered();

  // Return cached value if available
  if (cachedFrameDimensions) {
    return cachedFrameDimensions;
  }

  // Calculate and cache
  const size = getTerminalSize();
  const width = size.width - paddingX * 2;
  const height = size.height - paddingY * 2;

  cachedFrameDimensions = {
    width,
    height,
    innerWidth: width - 2, // Subtract left and right border
    innerHeight: height - 2, // Subtract top and bottom border
  };

  return cachedFrameDimensions;
}

/**
 * Calculate vertical padding to center content of a specific height.
 *
 * @param contentHeight - Total lines the content will occupy (including borders, header, footer)
 * @returns The number of empty lines to add at the top for centering
 */
export function calculateCenteringPadding(contentHeight: number): number {
  const { height } = getTerminalSize();
  const padding = Math.max(0, Math.floor((height - contentHeight) / 2));
  return padding;
}

/**
 * Calculate horizontal padding to center a frame of a specific width.
 *
 * @param frameWidth - Total width of the frame (including borders)
 * @returns The number of spaces to add on the left for centering
 */
export function calculateHorizontalCentering(frameWidth: number): number {
  const { width } = getTerminalSize();
  return Math.max(0, Math.floor((width - frameWidth) / 2));
}

/**
 * Calculate a centered frame width based on terminal size.
 *
 * @param maxWidth - Maximum frame width (default: 60)
 * @param widthPercent - Frame width as percentage of terminal (default: 0.8)
 * @returns The frame width to use
 */
export function calculateFrameWidth(
  maxWidth: number = DEFAULT_MAX_FRAME_WIDTH,
  widthPercent: number = DEFAULT_FRAME_WIDTH_PERCENT,
): number {
  const { width } = getTerminalSize();
  return Math.min(maxWidth, Math.floor(width * widthPercent));
}

// =============================================================================
// Centered Frame State
// =============================================================================

/** Current horizontal padding for centered frame (null = use layout config) */
let currentHorizontalPadding: number | null = null;

/**
 * Begin centered frame rendering.
 * Call this before drawing a frame to enable horizontal centering.
 *
 * @param frameWidth - Width of the frame to center
 */
export function beginCenteredFrame(frameWidth: number): void {
  currentHorizontalPadding = calculateHorizontalCentering(frameWidth);
}

/**
 * End centered frame rendering.
 * Call this after drawing a frame to restore default padding.
 */
export function endCenteredFrame(): void {
  currentHorizontalPadding = null;
}

// =============================================================================
// Drawing Primitives
// =============================================================================

/**
 * Get the border color from the current theme.
 */
function getBorderColor(): string {
  return getCurrentTheme().colors.border;
}

/**
 * Draw horizontal padding (spaces before the frame).
 * Uses centered frame padding if set, otherwise uses layout config.
 */
export function drawHorizontalPadding(): void {
  const padding = currentHorizontalPadding ?? layoutConfig.paddingX;
  bufferWrite(repeat(" ", padding));
}

/**
 * Draw the top border of a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawTopBorder(innerWidth: number, box: typeof BOX = BOX): void {
  const color = getBorderColor();
  drawHorizontalPadding();
  bufferWriteLine(
    `${color}${box.topLeft}${repeat(box.horizontal, innerWidth)}${box.topRight}${RESET}`,
  );
}

/**
 * Draw the bottom border of a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawBottomBorder(
  innerWidth: number,
  box: typeof BOX = BOX,
): void {
  const color = getBorderColor();
  drawHorizontalPadding();
  bufferWriteLine(
    `${color}${box.bottomLeft}${repeat(box.horizontal, innerWidth)}${box.bottomRight}${RESET}`,
  );
}

/**
 * Draw a horizontal divider within a frame.
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawDivider(innerWidth: number, box: typeof BOX = BOX): void {
  const color = getBorderColor();
  drawHorizontalPadding();
  bufferWriteLine(
    `${color}${box.teeLeft}${repeat(box.horizontal, innerWidth)}${box.teeRight}${RESET}`,
  );
}

/**
 * Draw an empty line within a frame (just borders with spaces).
 *
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawEmptyLine(innerWidth: number, box: typeof BOX = BOX): void {
  const color = getBorderColor();
  drawHorizontalPadding();
  bufferWriteLine(
    `${color}${box.vertical}${RESET}${repeat(" ", innerWidth)}${color}${box.vertical}${RESET}`,
  );
}

/**
 * Draw a line of content within a frame.
 * Content is left-aligned and padded to fill the frame width.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawLine(
  content: string,
  innerWidth: number,
  box: typeof BOX = BOX,
): void {
  const color = getBorderColor();
  const contentLen = visibleLength(content);
  const padding = Math.max(0, innerWidth - contentLen);

  drawHorizontalPadding();
  bufferWriteLine(
    `${color}${box.vertical}${RESET}${content}${repeat(" ", padding)}${color}${box.vertical}${RESET}`,
  );
}

/**
 * Draw a centered line of content within a frame.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawCenteredLine(
  content: string,
  innerWidth: number,
  box: typeof BOX = BOX,
): void {
  const color = getBorderColor();
  const contentLen = visibleLength(content);
  const totalPadding = Math.max(0, innerWidth - contentLen);
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  drawHorizontalPadding();
  bufferWriteLine(
    `${color}${box.vertical}${RESET}${repeat(" ", leftPadding)}${content}${repeat(" ", rightPadding)}${color}${box.vertical}${RESET}`,
  );
}

/**
 * Draw a right-aligned line of content within a frame.
 *
 * @param content - The content to display
 * @param innerWidth - Width inside the frame (excluding borders)
 * @param box - Box characters to use (default: rounded)
 */
export function drawRightAlignedLine(
  content: string,
  innerWidth: number,
  box: typeof BOX = BOX,
): void {
  const color = getBorderColor();
  const contentLen = visibleLength(content);
  const padding = Math.max(0, innerWidth - contentLen);

  drawHorizontalPadding();
  bufferWriteLine(
    `${color}${box.vertical}${RESET}${repeat(" ", padding)}${content}${color}${box.vertical}${RESET}`,
  );
}

// =============================================================================
// Vertical Padding
// =============================================================================

/**
 * Draw vertical padding (empty lines above/below the frame).
 *
 * @param count - Number of empty lines to draw (default: from layout config)
 */
export function drawVerticalPadding(count?: number): void {
  const lines = count ?? layoutConfig.paddingY;
  for (let i = 0; i < lines; i++) {
    bufferWriteLine();
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
export function calculateContentHeight(
  headerLines: number,
  footerLines: number,
  dividers: number = 2,
): number {
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
export function horizontalRule(
  width: number,
  char: string = BOX.horizontal,
): string {
  return repeat(char, width);
}
