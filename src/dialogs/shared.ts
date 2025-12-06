/**
 * QuarkTUI - Shared Dialog Utilities
 *
 * Common UI patterns used across all dialog components.
 * Provides consistent header and footer rendering.
 */

import { getCurrentTheme, RESET, BOLD, DIM } from "../core/theme";
import {
  drawEmptyLine,
  drawLine,
  drawCenteredLine,
  DEFAULT_INTERNAL_PADDING,
} from "../core/drawing";

// =============================================================================
// Types
// =============================================================================

/**
 * Options for rendering a standard dialog header.
 */
export interface DialogHeaderOptions {
  /** Main title text */
  title: string;
  /** Optional app name (displayed before title) */
  appName?: string;
  /** Optional subtitle (displayed after app name, dimmed) */
  subtitle?: string;
  /** Optional description (displayed on line 3) */
  description?: string;
  /** Optional icon to display before title */
  icon?: string;
  /** Color for the title (default: accent) */
  titleColor?: string;
}

/**
 * Options for rendering a standard dialog footer.
 */
export interface DialogFooterOptions {
  /** Hint strings to display (e.g., ["↑↓ Navigate", "⏎ Select", "q Back"]) */
  hints: string[];
  /** Whether to center the hints (default: true) */
  centered?: boolean;
}

// =============================================================================
// Header Rendering
// =============================================================================

/**
 * Format hint strings with dimmed keys.
 * Input: ["Space Action", "↑↓ Navigate"]
 * Output: "Space Action  ↑↓ Navigate" with first word/symbol dimmed
 *
 * @param hints - Array of hint strings
 * @returns Formatted hint string
 */
export function formatHints(hints: string[]): string {
  return hints
    .map((hint) => {
      const spaceIndex = hint.indexOf(" ");
      if (spaceIndex === -1) {
        return `${DIM}${hint}${RESET}`;
      }
      const key = hint.slice(0, spaceIndex);
      const action = hint.slice(spaceIndex);
      return `${DIM}${key}${RESET}${action}`;
    })
    .join("  ");
}

/**
 * Draw a standard 4-line dialog header.
 *
 * Structure:
 * - Line 1: Empty line
 * - Line 2: Title (with optional app name, icon)
 * - Line 3: Description OR empty line
 * - Line 4: Empty line
 *
 * @param innerWidth - Width inside the frame borders
 * @param options - Header configuration options
 */
export function drawDialogHeader(
  innerWidth: number,
  options: DialogHeaderOptions,
): void {
  const theme = getCurrentTheme();
  const { title, appName, subtitle, description, icon, titleColor } = options;
  const color = titleColor ?? theme.colors.accent;

  // Line 1: Empty line
  drawEmptyLine(innerWidth);

  // Line 2: Title line
  let titleLine: string;

  if (icon) {
    // Icon + Title format (used by message, confirm dialogs)
    titleLine = `${icon} ${BOLD}${title}${RESET}`;
  } else if (appName) {
    // AppName + Subtitle format (used by select menu)
    const styledAppName = `${BOLD}${color}${appName}${RESET}`;
    const displaySubtitle = subtitle || title;
    const styledSubtitle = `${DIM}${displaySubtitle}${RESET}`;
    titleLine = `${styledAppName}  ${styledSubtitle}`;
  } else {
    // Simple title format
    titleLine = `${BOLD}${color}${title}${RESET}`;
  }

  drawCenteredLine(titleLine, innerWidth);

  // Line 3: Description OR empty line
  if (description) {
    const styledDescription = `${theme.colors.textMuted}${description}${RESET}`;
    drawCenteredLine(styledDescription, innerWidth);
  } else {
    drawEmptyLine(innerWidth);
  }

  // Line 4: Empty line
  drawEmptyLine(innerWidth);
}

// =============================================================================
// Footer Rendering
// =============================================================================

/**
 * Draw a standard 3-line dialog footer (inside the divider).
 *
 * Structure:
 * - Line 1: Empty line
 * - Line 2: Hints
 * - Line 3: Empty line
 *
 * Note: The divider before the footer should be drawn separately.
 *
 * @param innerWidth - Width inside the frame borders
 * @param options - Footer configuration options
 */
export function drawDialogFooter(
  innerWidth: number,
  options: DialogFooterOptions,
): void {
  const { hints, centered = true } = options;
  const formattedHints = formatHints(hints);

  drawEmptyLine(innerWidth);

  if (centered) {
    drawCenteredLine(formattedHints, innerWidth);
  } else {
    const pad = " ".repeat(DEFAULT_INTERNAL_PADDING);
    drawLine(`${pad}${formattedHints}`, innerWidth);
  }

  drawEmptyLine(innerWidth);
}

// =============================================================================
// Convenience Functions
// =============================================================================

/**
 * Draw a simple header with just a title.
 *
 * @param innerWidth - Width inside the frame borders
 * @param title - Title text
 */
export function drawSimpleHeader(innerWidth: number, title: string): void {
  drawDialogHeader(innerWidth, { title });
}

/**
 * Draw a header with an icon prefix.
 *
 * @param innerWidth - Width inside the frame borders
 * @param title - Title text
 * @param icon - Icon string (already styled)
 */
export function drawIconHeader(
  innerWidth: number,
  title: string,
  icon: string,
): void {
  drawDialogHeader(innerWidth, { title, icon });
}

/**
 * Draw a simple footer with hint strings.
 *
 * @param innerWidth - Width inside the frame borders
 * @param hints - Array of hint strings
 */
export function drawSimpleFooter(innerWidth: number, hints: string[]): void {
  drawDialogFooter(innerWidth, { hints });
}
