/**
 * QuarkTUI - Text Input Dialog
 *
 * A text input dialog with validation support, placeholder text,
 * and customizable styling.
 */

import { clearScreen, hideCursor, showCursor } from "../core/terminal";
import { getCurrentTheme, RESET, DIM } from "../core/theme";
import { waitForKeypressCancellable, isPrintable } from "../core/keyboard";
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
import { drawSimpleHeader, drawDialogFooter } from "./shared";
import type { TextInputOptions, TextInputResult } from "../types/menu";

// =============================================================================
// Types
// =============================================================================

export type { TextInputOptions, TextInputResult };

/**
 * Extended options for text input with additional customization.
 */
export interface TextInputConfig extends TextInputOptions {
  /** Custom header renderer */
  renderHeader?: (innerWidth: number) => void;
  /** Custom footer renderer */
  renderFooter?: (innerWidth: number) => void;
  /** Whether to mask input (for passwords) */
  maskInput?: boolean;
  /** Character to use for masking (default: •) */
  maskChar?: string;
}

// =============================================================================
// Rendering
// =============================================================================

function renderTextInput(
  config: TextInputConfig,
  value: string,
  errorMessage: string | null,
): void {
  const { width, height } = getFrameDimensions();
  const innerWidth = width - 2;
  const theme = getCurrentTheme();
  const { y: paddingY } = getPadding();

  // Calculate layout
  const headerLineCount = 4; // empty + title + empty + divider
  const footerLineCount = 4; // divider + empty + hints + empty
  const infoLineCount = config.infoLines ? config.infoLines.length + 1 : 0;
  const errorLineCount = errorMessage ? 2 : 0; // empty + error
  const availableContentLines =
    height -
    headerLineCount -
    footerLineCount -
    infoLineCount -
    errorLineCount -
    2;

  clearScreen();
  hideCursor();

  // Vertical padding
  drawVerticalPadding(paddingY);

  // Top border
  drawTopBorder(innerWidth);

  // Header
  if (config.renderHeader) {
    config.renderHeader(innerWidth);
  } else {
    drawSimpleHeader(innerWidth, config.title);
  }

  drawDivider(innerWidth);

  // Internal padding (space between border and content)
  const pad = " ".repeat(DEFAULT_INTERNAL_PADDING);

  // Info lines (if any)
  if (config.infoLines && config.infoLines.length > 0) {
    for (const line of config.infoLines) {
      drawLine(`${pad}${DIM}${line}${RESET}`, innerWidth);
    }
    drawEmptyLine(innerWidth);
  }

  // Calculate content centering
  const contentLines = 1; // Just the input line
  const extraLines = Math.max(0, availableContentLines - contentLines);
  const topPadding = Math.floor(extraLines / 2);
  const bottomPadding = extraLines - topPadding;

  // Top padding for centering
  for (let i = 0; i < topPadding; i++) {
    drawEmptyLine(innerWidth);
  }

  // Input line
  const cursor = `${theme.colors.cursor}▋${RESET}`;
  const prefix = `${theme.colors.highlight}›${RESET} `;

  let displayValue: string;
  if (config.maskInput && value) {
    const maskChar = config.maskChar ?? "•";
    displayValue = maskChar.repeat(value.length);
  } else {
    displayValue = value;
  }

  if (displayValue) {
    drawLine(`${pad}${prefix}${displayValue}${cursor}`, innerWidth);
  } else {
    // Show placeholder when empty
    const placeholder = config.placeholder
      ? `${theme.colors.textMuted}${config.placeholder}${RESET}`
      : "";
    drawLine(`${pad}${prefix}${cursor}${placeholder}`, innerWidth);
  }

  // Bottom padding for centering
  for (let i = 0; i < bottomPadding; i++) {
    drawEmptyLine(innerWidth);
  }

  // Error message (if any)
  if (errorMessage) {
    drawEmptyLine(innerWidth);
    drawLine(
      `${pad}${theme.colors.error}! ${errorMessage}${RESET}`,
      innerWidth,
    );
  }

  drawDivider(innerWidth);

  // Footer
  if (config.renderFooter) {
    config.renderFooter(innerWidth);
  } else {
    drawDialogFooter(innerWidth, {
      hints: ["⏎ Submit", "⌫ Delete/Back", "Ctrl+C Cancel"],
    });
  }

  drawBottomBorder(innerWidth);
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Display a text input dialog and wait for user input.
 *
 * @param options - Input configuration
 * @returns The submitted value or cancelled result
 *
 * @example
 * ```ts
 * const result = await textInput({
 *   title: "Enter your name",
 *   placeholder: "John Doe",
 *   validate: (value) => {
 *     if (value.length < 2) return "Name must be at least 2 characters";
 *     return null;
 *   },
 * });
 *
 * if (result.type === "submitted") {
 *   console.log("Name:", result.value);
 * }
 * ```
 */
export async function textInput(
  options: TextInputOptions | TextInputConfig,
): Promise<TextInputResult> {
  const config = options as TextInputConfig;
  let value = config.initialValue ?? "";
  let errorMessage: string | null = null;
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
  renderTextInput(config, value, errorMessage);

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
      renderTextInput(config, value, errorMessage);
      continue;
    }

    // Handle submit
    if (key.name === "return") {
      // Run validation
      if (config.validate) {
        const error = config.validate(value);
        if (error) {
          errorMessage = error;
          renderTextInput(config, value, errorMessage);
          continue;
        }
      }
      cleanup();
      return { type: "submitted", value };
    }

    // Handle cancel (Ctrl+C)
    if (key.ctrl && key.name === "c") {
      cleanup();
      return { type: "cancelled" };
    }

    // Handle backspace
    if (key.name === "backspace") {
      if (value.length > 0) {
        value = value.slice(0, -1);
        errorMessage = null; // Clear error on edit
        renderTextInput(config, value, errorMessage);
      } else {
        // Go back when input is empty
        cleanup();
        return { type: "cancelled" };
      }
      continue;
    }

    // Handle delete (forward delete)
    if (key.name === "delete") {
      // For simplicity, treat same as backspace in single-cursor mode
      continue;
    }

    // Handle escape
    if (key.name === "escape") {
      cleanup();
      return { type: "cancelled" };
    }

    // Handle printable characters
    if (isPrintable(key) && key.str) {
      // Check max length
      if (config.maxLength && value.length >= config.maxLength) {
        continue;
      }

      value += key.str;
      errorMessage = null; // Clear error on edit
      renderTextInput(config, value, errorMessage);
    }
  }
}

/**
 * Display a password input dialog (masked input).
 *
 * @param options - Input configuration (maskInput is automatically set to true)
 * @returns The submitted value or cancelled result
 */
export async function passwordInput(
  options: Omit<TextInputOptions, "maskInput">,
): Promise<TextInputResult> {
  return textInput({
    ...options,
    maskInput: true,
  } as TextInputConfig);
}
