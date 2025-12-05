/**
 * QuarkTUI - Spinner/Loading Indicator
 *
 * A customizable loading spinner with message support.
 * Can be updated while running and stopped with a final message.
 */

import { clearScreen, hideCursor, showCursor } from "../core/terminal";
import { getCurrentTheme, RESET, BOLD } from "../core/theme";
import {
  drawTopBorder,
  drawBottomBorder,
  drawDivider,
  drawEmptyLine,
  drawCenteredLine,
  drawVerticalPadding,
  calculateCenteringPadding,
  calculateFrameWidth,
  beginCenteredFrame,
  endCenteredFrame,
} from "../core/drawing";

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
  const frameWidth = calculateFrameWidth(50, 0.6);
  const innerWidth = frameWidth - 2;
  const theme = getCurrentTheme();

  // Calculate content height
  const hasTitle = !!config.title;
  const headerLineCount = hasTitle ? 4 : 2; // empty + [title + empty + divider] OR just empty
  const footerLineCount = 2; // empty + border
  const spinnerLineCount = 1;
  const contentHeight =
    headerLineCount + footerLineCount + spinnerLineCount + 2; // +2 for top/bottom borders

  const topPadding = calculateCenteringPadding(contentHeight);

  clearScreen();
  hideCursor();

  // Vertical centering padding
  drawVerticalPadding(topPadding);

  // Begin horizontal centering
  beginCenteredFrame(frameWidth);

  // Top border
  drawTopBorder(innerWidth);

  // Header
  drawEmptyLine(innerWidth);
  if (hasTitle) {
    const styledTitle = `${BOLD}${theme.colors.accent}${config.title}${RESET}`;
    drawCenteredLine(styledTitle, innerWidth);
    drawEmptyLine(innerWidth);
    drawDivider(innerWidth);
  }

  // Spinner line (centered)
  const spinnerLine = `${theme.colors.highlight}${frame}${RESET} ${message}`;
  drawCenteredLine(spinnerLine, innerWidth);

  if (hasTitle) {
    drawDivider(innerWidth);
  }

  // Footer
  drawEmptyLine(innerWidth);
  drawBottomBorder(innerWidth);

  // End horizontal centering
  endCenteredFrame();
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
        const theme = getCurrentTheme();
        const frameWidth = calculateFrameWidth(50, 0.6);
        const innerWidth = frameWidth - 2;

        const hasTitle = !!config.title;
        const headerLineCount = hasTitle ? 4 : 2;
        const footerLineCount = 2;
        const messageLineCount = 1;
        const contentHeight =
          headerLineCount + footerLineCount + messageLineCount + 2;

        const topPadding = calculateCenteringPadding(contentHeight);

        clearScreen();
        hideCursor();

        drawVerticalPadding(topPadding);

        beginCenteredFrame(frameWidth);

        drawTopBorder(innerWidth);
        drawEmptyLine(innerWidth);

        if (hasTitle) {
          const styledTitle = `${BOLD}${theme.colors.accent}${config.title}${RESET}`;
          drawCenteredLine(styledTitle, innerWidth);
          drawEmptyLine(innerWidth);
          drawDivider(innerWidth);
        }

        const successLine = `${theme.colors.success}✓${RESET} ${finalMessage}`;
        drawCenteredLine(successLine, innerWidth);

        if (hasTitle) {
          drawDivider(innerWidth);
        }

        drawEmptyLine(innerWidth);
        drawBottomBorder(innerWidth);

        endCenteredFrame();
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
