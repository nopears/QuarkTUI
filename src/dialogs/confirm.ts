/**
 * QuarkTUI - Confirm Dialog
 *
 * A simple Yes/No confirmation dialog with keyboard navigation.
 */

import { clearScreen, hideCursor, showCursor } from "../core/terminal";
import { getCurrentTheme, RESET, BOLD, DIM } from "../core/theme";
import {
  waitForKeypressCancellable,
  isLeftKey,
  isRightKey,
  isConfirmKey,
  isBackKey,
} from "../core/keyboard";
import {
  drawTopBorder,
  drawBottomBorder,
  drawDivider,
  drawEmptyLine,
  drawLine,
  drawCenteredLine,
  drawVerticalPadding,
  getFrameDimensions,
  calculateCenteringPadding,
} from "../core/drawing";
import type { ConfirmOptions, ConfirmResult } from "../types/menu";

// =============================================================================
// Types
// =============================================================================

export type { ConfirmOptions, ConfirmResult };

/**
 * Extended options for confirm dialog with additional customization.
 */
export interface ConfirmConfig extends ConfirmOptions {
  /** Custom header renderer */
  renderHeader?: (innerWidth: number) => void;
  /** Custom footer renderer */
  renderFooter?: (innerWidth: number) => void;
}

// =============================================================================
// Header & Footer
// =============================================================================

function drawDefaultHeader(innerWidth: number, title: string): void {
  const theme = getCurrentTheme();
  const styledTitle = `${BOLD}${theme.colors.warning}?${RESET} ${BOLD}${title}${RESET}`;

  drawEmptyLine(innerWidth);
  drawCenteredLine(styledTitle, innerWidth);
  drawEmptyLine(innerWidth);
}

function drawDefaultFooter(innerWidth: number): void {
  const hints = `${DIM}←→${RESET} Switch  ${DIM}⏎${RESET} Confirm  ${DIM}y${RESET} Yes  ${DIM}n${RESET} No  ${DIM}⌫${RESET} Cancel`;

  drawEmptyLine(innerWidth);
  drawLine(`  ${hints}`, innerWidth);
  drawEmptyLine(innerWidth);
}

// =============================================================================
// Rendering
// =============================================================================

function renderConfirm(config: ConfirmConfig, selectedConfirm: boolean): void {
  const { width } = getFrameDimensions();
  const innerWidth = width - 2;
  const theme = getCurrentTheme();

  // Calculate actual content height
  const headerLineCount = 4; // empty + title + empty + divider
  const footerLineCount = 4; // divider + empty + hints + empty
  const messageLineCount = config.message ? 2 : 0;
  const buttonLineCount = 3; // padding + buttons + padding

  const contentHeight =
    2 + // borders
    headerLineCount +
    footerLineCount +
    messageLineCount +
    buttonLineCount;

  // Calculate centering
  const topPadding = calculateCenteringPadding(contentHeight);

  clearScreen();
  hideCursor();

  // Dynamic vertical padding
  drawVerticalPadding(topPadding);

  // Top border
  drawTopBorder(innerWidth);

  // Header
  if (config.renderHeader) {
    config.renderHeader(innerWidth);
  } else {
    drawDefaultHeader(innerWidth, config.title);
  }

  drawDivider(innerWidth);

  // Message (if any)
  if (config.message) {
    drawEmptyLine(innerWidth);
    drawCenteredLine(`${DIM}${config.message}${RESET}`, innerWidth);
  }

  // Button row
  const confirmLabel = config.confirmLabel ?? "Yes";
  const cancelLabel = config.cancelLabel ?? "No";

  let confirmButton: string;
  let cancelButton: string;

  if (selectedConfirm) {
    confirmButton = `${theme.colors.success}${BOLD}[ ${confirmLabel} ]${RESET}`;
    cancelButton = `${DIM}  ${cancelLabel}  ${RESET}`;
  } else {
    confirmButton = `${DIM}  ${confirmLabel}  ${RESET}`;
    cancelButton = `${theme.colors.error}${BOLD}[ ${cancelLabel} ]${RESET}`;
  }

  const buttonRow = `${confirmButton}    ${cancelButton}`;
  drawCenteredLine(buttonRow, innerWidth);

  // Spacing before buttons
  drawEmptyLine(innerWidth);

  drawDivider(innerWidth);

  // Footer
  if (config.renderFooter) {
    config.renderFooter(innerWidth);
  } else {
    drawDefaultFooter(innerWidth);
  }

  drawBottomBorder(innerWidth);
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Display a confirmation dialog and wait for user response.
 *
 * @param options - Confirm dialog configuration
 * @returns Confirmed or cancelled result
 *
 * @example
 * ```ts
 * const result = await confirm({
 *   title: "Delete this file?",
 *   message: "This action cannot be undone.",
 *   confirmLabel: "Delete",
 *   cancelLabel: "Keep",
 * });
 *
 * if (result.type === "confirmed") {
 *   // User confirmed
 * }
 * ```
 */
export async function confirm(
  options: ConfirmOptions | ConfirmConfig,
): Promise<ConfirmResult> {
  const config = options as ConfirmConfig;
  let selectedConfirm = config.defaultConfirm ?? false;
  let needsRedraw = false;

  // Handle terminal resize
  const onResize = () => {
    needsRedraw = true;
  };
  process.stdout.on("resize", onResize);

  const cleanup = () => {
    process.stdout.off("resize", onResize);
    showCursor();
  };

  // Initial render
  renderConfirm(config, selectedConfirm);

  while (true) {
    // Check for resize while waiting for key
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const { promise: keyPromise, cancel: cancelKeyWait } =
      waitForKeypressCancellable();

    const key = await Promise.race([
      keyPromise,
      new Promise<null>((resolve) => {
        const check = () => {
          if (needsRedraw) {
            needsRedraw = false;
            resolve(null);
          } else {
            timeoutId = setTimeout(check, 100);
          }
        };
        timeoutId = setTimeout(check, 100);
      }),
    ]);

    // Clear any pending timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Handle resize
    if (key === null) {
      cancelKeyWait();
      renderConfirm(config, selectedConfirm);
      continue;
    }

    // Handle navigation
    if (isLeftKey(key) || isRightKey(key)) {
      selectedConfirm = !selectedConfirm;
      renderConfirm(config, selectedConfirm);
      continue;
    }

    // Handle confirm
    if (isConfirmKey(key)) {
      cleanup();
      return selectedConfirm ? { type: "confirmed" } : { type: "cancelled" };
    }

    // Handle quick keys
    if (key.str === "y" || key.str === "Y") {
      cleanup();
      return { type: "confirmed" };
    }

    if (key.str === "n" || key.str === "N") {
      cleanup();
      return { type: "cancelled" };
    }

    // Handle back/cancel
    if (isBackKey(key)) {
      cleanup();
      return { type: "cancelled" };
    }
  }
}

/**
 * Simple yes/no confirm with just a title.
 *
 * @param title - The question to ask
 * @returns True if confirmed, false otherwise
 */
export async function confirmYesNo(title: string): Promise<boolean> {
  const result = await confirm({ title });
  return result.type === "confirmed";
}
