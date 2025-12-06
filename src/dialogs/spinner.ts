/**
 * QuarkTUI - Spinner/Loading Indicator
 *
 * A customizable loading spinner with message support.
 * Can be updated while running and stopped with a final message.
 */

import {
  clearScreen,
  hideCursor,
  showCursor,
  beginRender,
  flushRender,
} from "../core/terminal";
import { getCurrentTheme, RESET, DIM } from "../core/theme";
import {
  drawTopBorder,
  drawBottomBorder,
  drawDivider,
  drawEmptyLine,
  drawCenteredLine,
  drawVerticalPadding,
  getFrameDimensions,
  getPadding,
} from "../core/drawing";
import { drawSimpleHeader, drawSimpleFooter } from "./shared";

import type { SpinnerOptions, SpinnerController } from "../types/menu";

// =============================================================================
// Types
// =============================================================================

export type { SpinnerOptions, SpinnerController };

/**
 * Extended options for spinner with additional customization.
 */
export interface SpinnerConfig extends SpinnerOptions {
  /** Title displayed above the spinner (optional) */
  title?: string;
  /** Whether to center the spinner message */
  centerMessage?: boolean;
}

// =============================================================================
// Default Spinner Frames
// =============================================================================

/**
 * Braille dot spinner frames (default).
 */
export const SPINNER_DOTS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/**
 * Line spinner frames.
 */
export const SPINNER_LINE = ["-", "\\", "|", "/"];

/**
 * Arc spinner frames.
 */
export const SPINNER_ARC = ["◜", "◠", "◝", "◞", "◡", "◟"];

/**
 * Circle spinner frames.
 */
export const SPINNER_CIRCLE = ["◐", "◓", "◑", "◒"];

/**
 * Box spinner frames.
 */
export const SPINNER_BOX = ["▖", "▘", "▝", "▗"];

/**
 * Bounce spinner frames.
 */
export const SPINNER_BOUNCE = ["⠁", "⠂", "⠄", "⠂"];

/**
 * Growing bar spinner frames.
 */
export const SPINNER_BAR = [
  "▏",
  "▎",
  "▍",
  "▌",
  "▋",
  "▊",
  "▉",
  "█",
  "▉",
  "▊",
  "▋",
  "▌",
  "▍",
  "▎",
  "▏",
];

// =============================================================================
// Rendering
// =============================================================================

function renderSpinner(
  config: SpinnerConfig,
  frame: string,
  message: string,
): void {
  const { width, height } = getFrameDimensions();
  const innerWidth = width - 2;
  const theme = getCurrentTheme();
  const { y: paddingY } = getPadding();

  // Calculate layout (consistent with other dialogs)
  const headerLineCount = 4; // empty + title + empty + divider
  const footerLineCount = 4; // divider + empty + hint + empty
  const spinnerLineCount = 1;
  const availableContentLines = height - headerLineCount - footerLineCount - 2; // -2 for top/bottom borders

  // Begin buffered rendering for flicker-free output
  beginRender();

  clearScreen();
  hideCursor();

  // Vertical padding
  drawVerticalPadding(paddingY);

  // Top border
  drawTopBorder(innerWidth);

  // Header
  drawSimpleHeader(innerWidth, config.title || "Loading");

  drawDivider(innerWidth);

  // Calculate centering for spinner within available space
  const contentLines = 1; // Just the spinner line
  const extraLines = Math.max(0, availableContentLines - contentLines);
  const topPadding = Math.floor(extraLines / 2);
  const bottomPadding = extraLines - topPadding;

  // Top padding for centering
  for (let i = 0; i < topPadding; i++) {
    drawEmptyLine(innerWidth);
  }

  // Spinner line (centered)
  const spinnerLine = `${theme.colors.highlight}${frame}${RESET} ${message}`;
  drawCenteredLine(spinnerLine, innerWidth);

  // Bottom padding for centering
  for (let i = 0; i < bottomPadding; i++) {
    drawEmptyLine(innerWidth);
  }

  // Footer
  drawDivider(innerWidth);
  drawSimpleFooter(innerWidth, ["Please wait..."]);
  drawBottomBorder(innerWidth);

  // Flush all buffered output at once
  flushRender();
}

function renderFinalMessage(config: SpinnerConfig, finalMessage: string): void {
  const { width, height } = getFrameDimensions();
  const innerWidth = width - 2;
  const theme = getCurrentTheme();
  const { y: paddingY } = getPadding();

  // Calculate layout (consistent with other dialogs)
  const headerLineCount = 4; // empty + title + empty + divider
  const footerLineCount = 4; // divider + empty + hint + empty
  const messageLineCount = 1;
  const availableContentLines = height - headerLineCount - footerLineCount - 2;

  // Begin buffered rendering for flicker-free output
  beginRender();

  clearScreen();
  hideCursor();

  // Vertical padding
  drawVerticalPadding(paddingY);

  // Top border
  drawTopBorder(innerWidth);

  // Header
  drawSimpleHeader(innerWidth, config.title || "Complete");

  drawDivider(innerWidth);

  // Calculate centering for message within available space
  const contentLines = messageLineCount;
  const extraLines = Math.max(0, availableContentLines - contentLines);
  const topPadding = Math.floor(extraLines / 2);
  const bottomPadding = extraLines - topPadding;

  // Top padding for centering
  for (let i = 0; i < topPadding; i++) {
    drawEmptyLine(innerWidth);
  }

  // Success message line (centered)
  const successLine = `${theme.colors.success}✓${RESET} ${finalMessage}`;
  drawCenteredLine(successLine, innerWidth);

  // Bottom padding for centering
  for (let i = 0; i < bottomPadding; i++) {
    drawEmptyLine(innerWidth);
  }

  // Footer
  drawDivider(innerWidth);
  drawEmptyLine(innerWidth);
  drawEmptyLine(innerWidth);
  drawEmptyLine(innerWidth);
  drawBottomBorder(innerWidth);

  // Flush all buffered output at once
  flushRender();
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Show a loading spinner with a message.
 * Returns a controller to update the message or stop the spinner.
 *
 * @param options - Spinner configuration (can be just a message string)
 * @returns Controller to update or stop the spinner
 *
 * @example
 * ```ts
 * const spinner = showSpinner("Loading data...");
 *
 * await fetchData();
 * spinner.update("Processing...");
 *
 * await processData();
 * spinner.stop("Done!");
 * ```
 *
 * @example
 * ```ts
 * const spinner = showSpinner({
 *   message: "Downloading...",
 *   title: "Please Wait",
 *   frames: SPINNER_CIRCLE,
 *   interval: 100,
 * });
 *
 * // Later...
 * spinner.stop();
 * ```
 */
export function showSpinner(
  options: string | SpinnerOptions | SpinnerConfig,
): SpinnerController {
  // Normalize options
  const config: SpinnerConfig =
    typeof options === "string" ? { message: options } : options;

  const frames = config.frames ?? SPINNER_DOTS;
  const interval = config.interval ?? 80;

  let frameIndex = 0;
  let currentMessage = config.message;
  let stopped = false;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  // Render function
  const render = () => {
    if (stopped) return;
    const frame = frames[frameIndex] ?? frames[0] ?? "●";
    renderSpinner(config, frame, currentMessage);
  };

  // Initial render
  render();

  // Start animation
  intervalId = setInterval(() => {
    if (stopped) return;
    frameIndex = (frameIndex + 1) % frames.length;
    render();
  }, interval);

  // Handle terminal resize
  const onResize = () => {
    if (!stopped) {
      render();
    }
  };
  process.stdout.on("resize", onResize);

  // Return controller
  return {
    update: (message: string) => {
      if (!stopped) {
        currentMessage = message;
        render();
      }
    },

    stop: (finalMessage?: string) => {
      if (stopped) return;
      stopped = true;

      // Clean up
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      process.stdout.off("resize", onResize);

      // Show final message if provided
      if (finalMessage) {
        renderFinalMessage(config, finalMessage);
      }

      showCursor();
    },
  };
}

/**
 * Run an async operation with a spinner.
 * Automatically stops the spinner when the operation completes.
 *
 * @param message - Message to display while loading
 * @param operation - Async operation to run
 * @param successMessage - Optional message to show on success
 * @returns The result of the operation
 *
 * @example
 * ```ts
 * const data = await withSpinner(
 *   "Fetching data...",
 *   () => fetchData(),
 *   "Data loaded!"
 * );
 * ```
 */
export async function withSpinner<T>(
  message: string,
  operation: () => Promise<T>,
  successMessage?: string,
): Promise<T> {
  const spinner = showSpinner(message);

  try {
    const result = await operation();
    spinner.stop(successMessage);
    return result;
  } catch (error) {
    spinner.stop();
    throw error;
  }
}
