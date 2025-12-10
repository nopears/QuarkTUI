/**
 * QuarkTUI - Multi-Select Dialog
 *
 * A dialog for selecting multiple items from a list with checkbox-style selection.
 * Supports keyboard navigation, search filtering, and batch selection.
 */

import {
  clearScreen,
  hideCursor,
  showCursor,
  beginRender,
  flushRender,
} from "../core/terminal";
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
  drawVerticalPadding,
  getFrameDimensions,
  getPadding,
  DEFAULT_INTERNAL_PADDING,
} from "../core/drawing";
import { drawDialogHeader, drawDialogFooter } from "./shared";

// =============================================================================
// Types
// =============================================================================

/**
 * A single option in the multi-select menu.
 */
export interface MultiSelectOption<T = string> {
  /** Display label */
  label: string;
  /** Value returned when selected */
  value: T;
  /** Optional hint text shown next to the label */
  hint?: string;
  /** Whether this option is disabled/not selectable */
  disabled?: boolean;
  /** Initial checked state */
  checked?: boolean;
}

/**
 * Options for the multi-select dialog.
 */
export interface MultiSelectOptions<T = string> {
  /** Title displayed at the top */
  title: string;
  /** Array of selectable options */
  options: MultiSelectOption<T>[];
  /** Index of initially focused option */
  focusedIndex?: number;
  /** Informational lines displayed above options */
  infoLines?: string[];
  /** Minimum number of selections required (default: 0) */
  minSelections?: number;
  /** Maximum number of selections allowed (default: unlimited) */
  maxSelections?: number;
  /** Show "Select All" / "Deselect All" options (default: true) */
  showBulkActions?: boolean;
}

/**
 * Extended configuration for multi-select dialog.
 */
export interface MultiSelectConfig<T> extends MultiSelectOptions<T> {
  /** Custom header renderer */
  renderHeader?: (innerWidth: number) => void;
  /** Custom footer renderer */
  renderFooter?: (innerWidth: number) => void;
  /** Allow number keys for quick toggle (default: true if <= 9 items) */
  allowNumberKeys?: boolean;
  /** App name displayed first (e.g., "♪ LAZYGIG") */
  appName?: string;
  /** Page name displayed after app name on same line */
  subtitle?: string;
  /** Description displayed below on its own line */
  description?: string;
}

/**
 * Result from the multi-select dialog.
 */
export type MultiSelectResult<T> =
  | { type: "selected"; values: T[] }
  | { type: "cancelled" };

// =============================================================================
// Constants
// =============================================================================

const CHECKBOX_CHECKED = "☑";
const CHECKBOX_UNCHECKED = "☐";
const CHECKBOX_DISABLED = "☒";

// =============================================================================
// Rendering
// =============================================================================

function renderMultiSelectMenu<T>(
  config: MultiSelectConfig<T>,
  focusedIndex: number,
  checkedIndices: Set<number>,
): void {
  const { width, height } = getFrameDimensions();
  const innerWidth = width - 2;
  const theme = getCurrentTheme();
  const { y: paddingY } = getPadding();

  // Calculate layout
  const headerLineCount = 4;
  const footerLineCount = 4;
  const infoLineCount = config.infoLines ? config.infoLines.length + 1 : 0;
  const bulkActionsLineCount = config.showBulkActions !== false ? 1 : 0;
  const availableContentLines =
    height -
    headerLineCount -
    footerLineCount -
    infoLineCount -
    bulkActionsLineCount -
    2;
  const optionCount = config.options.length;

  beginRender();

  clearScreen();
  hideCursor();

  drawVerticalPadding(paddingY);

  drawTopBorder(innerWidth);

  // Header
  if (config.renderHeader) {
    config.renderHeader(innerWidth);
  } else {
    drawDialogHeader(innerWidth, {
      title: config.title,
      appName: config.appName,
      subtitle: config.subtitle,
      description: config.description,
    });
  }

  drawDivider(innerWidth);

  const pad = " ".repeat(DEFAULT_INTERNAL_PADDING);

  // Info lines
  if (config.infoLines && config.infoLines.length > 0) {
    for (const line of config.infoLines) {
      drawLine(`${pad}${DIM}${line}${RESET}`, innerWidth);
    }
    drawEmptyLine(innerWidth);
  }

  // Selection count indicator
  const selectedCount = checkedIndices.size;
  const minSel = config.minSelections ?? 0;
  const maxSel = config.maxSelections;

  let selectionHint = `${selectedCount} selected`;
  if (minSel > 0) {
    selectionHint += ` (min: ${minSel})`;
  }
  if (maxSel !== undefined) {
    selectionHint += maxSel !== undefined ? ` (max: ${maxSel})` : "";
  }
  drawLine(
    `${pad}${theme.colors.textMuted}${selectionHint}${RESET}`,
    innerWidth,
  );

  // Calculate visible range for scrolling
  let startIndex = 0;
  let endIndex = Math.min(optionCount, availableContentLines);

  if (focusedIndex >= endIndex) {
    endIndex = focusedIndex + 1;
    startIndex = Math.max(0, endIndex - availableContentLines);
  } else if (focusedIndex < startIndex) {
    startIndex = focusedIndex;
    endIndex = Math.min(optionCount, startIndex + availableContentLines);
  }

  const hasMoreAbove = startIndex > 0;
  const hasMoreBelow = endIndex < optionCount;

  let linesDrawn = 0;

  if (hasMoreAbove) {
    drawLine(`${pad}${DIM}↑ more...${RESET}`, innerWidth);
    linesDrawn++;
  }

  for (
    let i = startIndex;
    i < endIndex && linesDrawn < availableContentLines;
    i++
  ) {
    const opt = config.options[i];
    if (!opt) continue;

    const isFocused = i === focusedIndex;
    const isChecked = checkedIndices.has(i);
    const isDisabled = opt.disabled === true;

    // Checkbox
    let checkbox: string;
    if (isDisabled) {
      checkbox = `${theme.colors.textMuted}${CHECKBOX_DISABLED}${RESET}`;
    } else if (isChecked) {
      checkbox = `${theme.colors.success}${CHECKBOX_CHECKED}${RESET}`;
    } else {
      checkbox = `${theme.colors.textMuted}${CHECKBOX_UNCHECKED}${RESET}`;
    }

    // Build the option line
    let prefix: string;
    let label: string;
    let hint = "";

    if (isFocused) {
      prefix = `${pad.slice(0, -1)}${theme.colors.highlight}❯${RESET} `;
      label = `${BOLD}${theme.colors.text}${opt.label}${RESET}`;
    } else if (isDisabled) {
      prefix = `${pad} `;
      label = `${DIM}${opt.label}${RESET}`;
    } else {
      prefix = `${pad} `;
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

    drawLine(`${prefix}${checkbox} ${numberHint}${label}${hint}`, innerWidth);
    linesDrawn++;
  }

  if (hasMoreBelow) {
    drawLine(`${pad}${DIM}↓ more...${RESET}`, innerWidth);
    linesDrawn++;
  }

  // Fill remaining space
  while (linesDrawn < availableContentLines) {
    drawEmptyLine(innerWidth);
    linesDrawn++;
  }

  drawDivider(innerWidth);

  // Footer
  if (config.renderFooter) {
    config.renderFooter(innerWidth);
  } else {
    const hints = [
      "↑↓ Navigate",
      "Space Toggle",
      "⏎ Confirm",
      "a All",
      "n None",
      "q Back",
    ];
    drawDialogFooter(innerWidth, { hints });
  }

  drawBottomBorder(innerWidth);

  flushRender();
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Display a multi-select dialog and wait for user selection.
 *
 * @param options - Multi-select configuration
 * @returns The selected values or cancelled result
 *
 * @example
 * ```ts
 * const result = await multiSelect({
 *   title: "Select your preferences",
 *   options: [
 *     { label: "Option A", value: "a" },
 *     { label: "Option B", value: "b", checked: true },
 *     { label: "Option C", value: "c" },
 *   ],
 * });
 *
 * if (result.type === "selected") {
 *   console.log("Selected:", result.values);
 * }
 * ```
 *
 * @example
 * ```ts
 * // With min/max constraints
 * const result = await multiSelect({
 *   title: "Choose 2-4 items",
 *   options: items,
 *   minSelections: 2,
 *   maxSelections: 4,
 * });
 * ```
 *
 * @example
 * ```ts
 * // With app branding
 * const result = await multiSelect({
 *   title: "Features",
 *   appName: "♪ LAZYGIG",
 *   subtitle: "Settings",
 *   description: "Enable or disable features",
 *   options: features,
 * });
 * ```
 */
export async function multiSelect<T = string>(
  options: MultiSelectOptions<T> | MultiSelectConfig<T>,
): Promise<MultiSelectResult<T>> {
  const config = options as MultiSelectConfig<T>;
  let focusedIndex = config.focusedIndex ?? 0;
  const maxIndex = config.options.length - 1;
  let needsRedraw = false;

  // Initialize checked indices from option defaults
  const checkedIndices = new Set<number>();
  config.options.forEach((opt, i) => {
    if (opt.checked && !opt.disabled) {
      checkedIndices.add(i);
    }
  });

  // Ensure focusedIndex is valid
  focusedIndex = Math.max(0, Math.min(focusedIndex, maxIndex));

  // Skip disabled options initially
  while (focusedIndex <= maxIndex && config.options[focusedIndex]?.disabled) {
    focusedIndex++;
  }
  if (focusedIndex > maxIndex) {
    focusedIndex = 0;
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

    return from;
  };

  // Toggle selection
  const toggleSelection = (index: number): boolean => {
    const opt = config.options[index];
    if (!opt || opt.disabled) return false;

    if (checkedIndices.has(index)) {
      checkedIndices.delete(index);
      return true;
    } else {
      // Check max constraint
      if (
        config.maxSelections !== undefined &&
        checkedIndices.size >= config.maxSelections
      ) {
        return false;
      }
      checkedIndices.add(index);
      return true;
    }
  };

  // Select all non-disabled options
  const selectAll = () => {
    config.options.forEach((opt, i) => {
      if (!opt.disabled) {
        if (
          config.maxSelections === undefined ||
          checkedIndices.size < config.maxSelections
        ) {
          checkedIndices.add(i);
        }
      }
    });
  };

  // Deselect all
  const deselectAll = () => {
    checkedIndices.clear();
  };

  // Check if can confirm (meets min selection requirement)
  const canConfirm = (): boolean => {
    const minSel = config.minSelections ?? 0;
    return checkedIndices.size >= minSel;
  };

  // Initial render
  renderMultiSelectMenu(config, focusedIndex, checkedIndices);

  while (true) {
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

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Handle resize
    if (key === null) {
      cancelKeyWait();
      renderMultiSelectMenu(config, focusedIndex, checkedIndices);
      continue;
    }

    // Navigation
    if (isUpKey(key)) {
      focusedIndex = findNextEnabled(
        focusedIndex > 0 ? focusedIndex : maxIndex + 1,
        -1,
      );
      renderMultiSelectMenu(config, focusedIndex, checkedIndices);
    } else if (isDownKey(key)) {
      focusedIndex = findNextEnabled(
        focusedIndex < maxIndex ? focusedIndex : -1,
        1,
      );
      renderMultiSelectMenu(config, focusedIndex, checkedIndices);
    } else if (key.name === "space") {
      // Toggle current selection
      toggleSelection(focusedIndex);
      renderMultiSelectMenu(config, focusedIndex, checkedIndices);
    } else if (isConfirmKey(key)) {
      // Confirm selection
      if (canConfirm()) {
        const selectedValues = Array.from(checkedIndices)
          .sort((a, b) => a - b)
          .map((i) => config.options[i]!.value);
        cleanup();
        return { type: "selected", values: selectedValues };
      }
      // Can't confirm - flash or show feedback (just re-render for now)
      renderMultiSelectMenu(config, focusedIndex, checkedIndices);
    } else if (isBackKey(key)) {
      cleanup();
      return { type: "cancelled" };
    } else if (key.name === "a" || key.str === "a") {
      // Select all
      selectAll();
      renderMultiSelectMenu(config, focusedIndex, checkedIndices);
    } else if (key.name === "n" || key.str === "n") {
      // Deselect all (none)
      deselectAll();
      renderMultiSelectMenu(config, focusedIndex, checkedIndices);
    } else {
      // Check for number key toggle
      const showNumbers = config.allowNumberKeys ?? config.options.length <= 9;
      if (showNumbers) {
        const num = getNumberKey(key);
        if (num !== null && num >= 1 && num <= config.options.length) {
          const index = num - 1;
          toggleSelection(index);
          renderMultiSelectMenu(config, focusedIndex, checkedIndices);
        }
      }
    }
  }
}

/**
 * Quick multi-select from an array of strings.
 *
 * @param title - Dialog title
 * @param items - Array of string options
 * @param initiallyChecked - Array of initially checked indices
 * @returns Selected strings or empty array if cancelled
 *
 * @example
 * ```ts
 * const selected = await quickMultiSelect(
 *   "Choose toppings",
 *   ["Cheese", "Pepperoni", "Mushrooms", "Olives"],
 *   [0, 1], // Cheese and Pepperoni pre-selected
 * );
 * ```
 */
export async function quickMultiSelect(
  title: string,
  items: string[],
  initiallyChecked: number[] = [],
): Promise<string[]> {
  const checkedSet = new Set(initiallyChecked);
  const options: MultiSelectOption<string>[] = items.map((item, i) => ({
    label: item,
    value: item,
    checked: checkedSet.has(i),
  }));

  const result = await multiSelect({ title, options });

  if (result.type === "selected") {
    return result.values;
  }

  return [];
}
