/**
 * QuarkTUI - Select Menu Dialog
 *
 * A configurable list selection dialog with keyboard navigation.
 * Supports hints, info lines, and customizable styling.
 */

import { clearScreen, hideCursor, showCursor } from "../core/terminal";
import { getCurrentTheme, RESET, BOLD, DIM } from "../core/theme";
import {
  waitForKeypressCancellable,
  isUpKey,
  isDownKey,
  isConfirmKey,
  isBackKey,
  getNumberKey,
} from "../core/keyboard";
import {
  drawTopBorder,
  drawBottomBorder,
  drawDivider,
  drawEmptyLine,
  drawLine,
  drawCenteredLine,
  drawVerticalPadding,
  calculateCenteringPadding,
  calculateFrameWidth,
  beginCenteredFrame,
  endCenteredFrame,
} from "../core/drawing";
import type {
  MenuOption,
  SelectMenuOptions,
  SelectResult,
} from "../types/menu";

// =============================================================================
// Types
// =============================================================================

export type { MenuOption, SelectMenuOptions, SelectResult };

/**
 * Extended options for select menu with additional customization.
 */
export interface SelectMenuConfig<T> extends SelectMenuOptions<T> {
  /** Custom header renderer */
  renderHeader?: (innerWidth: number) => void;
  /** Custom footer renderer */
  renderFooter?: (innerWidth: number) => void;
  /** Allow number keys for quick selection (default: true if <= 9 items) */
  allowNumberKeys?: boolean;
}

// =============================================================================
// Header & Footer
// =============================================================================

function drawDefaultHeader(innerWidth: number, title: string): void {
  const theme = getCurrentTheme();
  const styledTitle = `${BOLD}${theme.colors.accent}${title}${RESET}`;

  drawEmptyLine(innerWidth);
  drawCenteredLine(styledTitle, innerWidth);
  drawEmptyLine(innerWidth);
}

function drawDefaultFooter(innerWidth: number): void {
  const hints = `${DIM}↑↓${RESET} Navigate  ${DIM}⏎${RESET} Select  ${DIM}q/⌫${RESET} Back`;

  drawEmptyLine(innerWidth);
  drawLine(`  ${hints}`, innerWidth);
  drawEmptyLine(innerWidth);
}

// =============================================================================
// Rendering
// =============================================================================

function renderSelectMenu<T>(
  config: SelectMenuConfig<T>,
  selectedIndex: number,
): void {
  const theme = getCurrentTheme();

  // Calculate frame width for horizontal centering
  const frameWidth = calculateFrameWidth();
  const innerWidth = frameWidth - 2;

  // Calculate actual content height
  const headerLineCount = 4; // empty + title + empty + divider
  const footerLineCount = 4; // divider + empty + hints + empty
  const infoLineCount = config.infoLines ? config.infoLines.length + 1 : 0;

  // Visible options (cap at reasonable max)
  const maxVisibleOptions = Math.min(config.options.length, 12);
  const scrollIndicators = config.options.length > maxVisibleOptions ? 2 : 0;

  const contentHeight =
    2 + // top and bottom borders
    headerLineCount +
    footerLineCount +
    infoLineCount +
    maxVisibleOptions +
    scrollIndicators;

  // Calculate vertical centering
  const topPadding = calculateCenteringPadding(contentHeight);

  clearScreen();
  hideCursor();

  // Set up horizontal centering
  beginCenteredFrame(frameWidth);

  // Dynamic vertical padding for centering
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

  // Info lines (if any)
  if (config.infoLines && config.infoLines.length > 0) {
    for (const line of config.infoLines) {
      drawLine(`  ${DIM}${line}${RESET}`, innerWidth);
    }
    drawEmptyLine(innerWidth);
  }

  // Calculate visible range for scrolling
  const optionCount = config.options.length;
  let startIndex = 0;
  let endIndex = Math.min(optionCount, maxVisibleOptions);

  // Adjust visible range if selected item would be out of view
  if (selectedIndex >= endIndex) {
    endIndex = selectedIndex + 1;
    startIndex = Math.max(0, endIndex - maxVisibleOptions);
  } else if (selectedIndex < startIndex) {
    startIndex = selectedIndex;
    endIndex = Math.min(optionCount, startIndex + maxVisibleOptions);
  }

  // Show scroll indicator at top if needed
  const hasMoreAbove = startIndex > 0;
  const hasMoreBelow = endIndex < optionCount;

  // Render options
  let linesDrawn = 0;

  if (hasMoreAbove) {
    drawLine(`  ${DIM}↑ more...${RESET}`, innerWidth);
    linesDrawn++;
  }

  for (
    let i = startIndex;
    i < endIndex && linesDrawn < maxVisibleOptions;
    i++
  ) {
    const opt = config.options[i];
    if (!opt) continue;

    const isSelected = i === selectedIndex;
    const isDisabled = opt.disabled === true;

    // Build the option line
    let prefix: string;
    let label: string;
    let hint = "";

    if (isSelected) {
      prefix = `${theme.colors.highlight}❯${RESET} `;
      label = `${BOLD}${theme.colors.text}${opt.label}${RESET}`;
    } else if (isDisabled) {
      prefix = "  ";
      label = `${DIM}${opt.label}${RESET}`;
    } else {
      prefix = "  ";
      label = `${DIM}${opt.label}${RESET}`;
    }

    if (opt.hint) {
      hint = ` ${theme.colors.textMuted}(${opt.hint})${RESET}`;
    }

    // Add number key hint if enabled
    const showNumbers = config.allowNumberKeys ?? config.options.length <= 9;
    let numberHint = "";
    if (showNumbers && i < 9) {
      numberHint = `${DIM}${i + 1}${RESET} `;
    }

    drawLine(`${prefix}${numberHint}${label}${hint}`, innerWidth);
    linesDrawn++;
  }

  if (hasMoreBelow) {
    drawLine(`  ${DIM}↓ more...${RESET}`, innerWidth);
    linesDrawn++;
  }

  // Fill remaining space
  while (linesDrawn < maxVisibleOptions) {
    drawEmptyLine(innerWidth);
    linesDrawn++;
  }

  drawDivider(innerWidth);

  // Footer
  if (config.renderFooter) {
    config.renderFooter(innerWidth);
  } else {
    drawDefaultFooter(innerWidth);
  }

  drawBottomBorder(innerWidth);

  // End horizontal centering
  endCenteredFrame();
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Display a select menu and wait for user selection.
 *
 * @param options - Menu configuration
 * @returns The selected value or cancelled result
 *
 * @example
 * ```ts
 * const result = await selectMenu({
 *   title: "Choose an option",
 *   options: [
 *     { label: "Option 1", value: "opt1" },
 *     { label: "Option 2", value: "opt2", hint: "recommended" },
 *     { label: "Cancel", value: "cancel" },
 *   ],
 * });
 *
 * if (result.type === "selected") {
 *   console.log("Selected:", result.value);
 * }
 * ```
 */
export async function selectMenu<T = string>(
  options: SelectMenuOptions<T> | SelectMenuConfig<T>,
): Promise<SelectResult<T>> {
  const config = options as SelectMenuConfig<T>;
  let selectedIndex = config.selectedIndex ?? 0;
  const maxIndex = config.options.length - 1;
  let needsRedraw = false;

  // Ensure selectedIndex is valid
  selectedIndex = Math.max(0, Math.min(selectedIndex, maxIndex));

  // Skip disabled options initially
  while (selectedIndex <= maxIndex && config.options[selectedIndex]?.disabled) {
    selectedIndex++;
  }
  if (selectedIndex > maxIndex) {
    // All options disabled? Reset to 0
    selectedIndex = 0;
  }

  // Handle terminal resize
  const onResize = () => {
    needsRedraw = true;
  };
  process.stdout.on("resize", onResize);

  const cleanup = () => {
    process.stdout.off("resize", onResize);
    showCursor();
  };

  // Find next non-disabled option
  const findNextEnabled = (from: number, direction: 1 | -1): number => {
    let index = from;
    const limit = direction === 1 ? maxIndex : 0;

    while (index !== limit) {
      index += direction;
      if (!config.options[index]?.disabled) {
        return index;
      }
    }

    // Wrap around
    index = direction === 1 ? 0 : maxIndex;
    while (index !== from) {
      if (!config.options[index]?.disabled) {
        return index;
      }
      index += direction;
    }

    return from; // No other enabled options
  };

  // Initial render
  renderSelectMenu(config, selectedIndex);

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
      renderSelectMenu(config, selectedIndex);
      continue;
    }

    // Handle navigation
    if (isUpKey(key)) {
      selectedIndex = findNextEnabled(
        selectedIndex > 0 ? selectedIndex : maxIndex + 1,
        -1,
      );
      renderSelectMenu(config, selectedIndex);
    } else if (isDownKey(key)) {
      selectedIndex = findNextEnabled(
        selectedIndex < maxIndex ? selectedIndex : -1,
        1,
      );
      renderSelectMenu(config, selectedIndex);
    } else if (isConfirmKey(key)) {
      const selected = config.options[selectedIndex];
      if (selected && !selected.disabled) {
        cleanup();
        return { type: "selected", value: selected.value };
      }
    } else if (isBackKey(key)) {
      cleanup();
      return { type: "cancelled" };
    } else {
      // Check for number key selection
      const showNumbers = config.allowNumberKeys ?? config.options.length <= 9;
      if (showNumbers) {
        const num = getNumberKey(key);
        if (num !== null && num >= 1 && num <= config.options.length) {
          const index = num - 1;
          const opt = config.options[index];
          if (opt && !opt.disabled) {
            cleanup();
            return { type: "selected", value: opt.value };
          }
        }
      }
    }
  }
}
