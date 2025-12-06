/**
 * Unified Window Component
 *
 * Manages the full lifecycle of a UI screen: rendering, keyboard handling, and cleanup.
 * Provides a consistent pattern for all interactive screens in the application.
 */

import {
  style,
  getFrameDimensions,
  getPadding,
  clearScreen,
  hideCursor,
  showCursor,
  beginRender,
  flushRender,
  drawTopBorder,
  drawBottomBorder,
  drawDivider,
  drawEmptyLine,
  drawLine,
  drawCenteredLine,
  drawVerticalPadding,
  createKeyboardHandler,
  isBackKey,
  isHelpKey,
  showHelp,
  type KeypressEvent,
  type HelpContent,
} from "./index";

import type { RenderContext } from "./widgets/types";

// =============================================================================
// Types
// =============================================================================

export interface WindowConfig {
  /** Window title (e.g., "♪ METRONOME") */
  title: string;
  /** Optional subtitle displayed next to title (dimmed) */
  subtitle?: string;
  /** Optional description displayed below title (gray) */
  description?: string;

  /** Keyboard hints for footer (e.g., ["Space Play/Pause", "↑↓ BPM", "q/⌫ Back"]) */
  hints: string[];

  /** If provided, ? key shows this help */
  helpContent?: HelpContent;

  /** Render function called to generate content lines */
  onRender: (ctx: RenderContext) => string[] | void;

  /** If true, content lines are centered. If false (default), lines handle their own alignment */
  centerContent?: boolean;

  /**
   * Custom keypress handler called BEFORE default handlers.
   * Return true to prevent default handling (back/help).
   * Can be async - the window will await it before processing default handlers.
   */
  onKeypress?: (
    key: KeypressEvent,
    actions: WindowActions,
  ) => boolean | void | Promise<boolean | void>;

  /** Called when window is mounted (after first render), receives actions for async updates */
  onMount?: (actions: WindowActions) => void | Promise<void>;

  /** Called when window is unmounted (before cleanup) */
  onUnmount?: () => void;
}

export interface WindowActions {
  /** Trigger a re-render */
  redraw: () => void;
  /** Close the window and resolve the promise */
  close: () => void;
  /** Pause keyboard handling (call before showing a modal) */
  pauseKeyboard: () => void;
  /** Resume keyboard handling (call after modal closes) */
  resumeKeyboard: () => void;
}

export interface WindowInstance {
  /** Start the window and wait for it to close */
  run: () => Promise<void>;
}

// =============================================================================
// Layout Constants
// =============================================================================

// Match dialog overhead calculation exactly:
// Dialogs use: height - headerLineCount(4) - footerLineCount(4) - 2 = height - 10
// Header: 4 lines (empty + title + desc + empty)
// Footer: 4 lines (divider + empty + hints + empty) - includes divider before footer
// Borders: 2 lines (top + bottom)
// Note: divider after header is drawn but not counted (same as dialogs)
const HEADER_LINE_COUNT = 4;
const FOOTER_LINE_COUNT = 4;
const BORDER_OVERHEAD = 2;

// =============================================================================
// Formatting Helpers
// =============================================================================

/**
 * Format hints with dimmed keys
 * Input: ["Space Play/Pause", "↑↓ BPM"]
 * Output: "Space Play/Pause  ↑↓ BPM" with first word dimmed
 */
function formatHints(hints: string[]): string {
  return hints
    .map((hint) => {
      const spaceIndex = hint.indexOf(" ");
      if (spaceIndex === -1) {
        return style(hint, "dim");
      }
      const key = hint.slice(0, spaceIndex);
      const action = hint.slice(spaceIndex);
      return `${style(key, "dim")}${action}`;
    })
    .join("  ");
}

// =============================================================================
// Drawing Functions
// =============================================================================

function drawWindowHeader(
  innerWidth: number,
  title: string,
  subtitle?: string,
  description?: string,
): void {
  // Build title line
  let titleLine = style(title, "bold", "accent");
  if (subtitle) {
    titleLine += `  ${style(subtitle, "dim")}`;
  }

  drawEmptyLine(innerWidth);
  drawCenteredLine(titleLine, innerWidth);

  if (description) {
    drawCenteredLine(style(description, "muted"), innerWidth);
  } else {
    drawEmptyLine(innerWidth);
  }

  drawEmptyLine(innerWidth);
}

function drawWindowFooter(innerWidth: number, hints: string[]): void {
  const formattedHints = formatHints(hints);

  drawEmptyLine(innerWidth);
  drawLine(`  ${formattedHints}`, innerWidth);
  drawEmptyLine(innerWidth);
}

function calculateContentHeight(frameHeight: number): number {
  // frameHeight is already adjusted for vertical padding (from getFrameDimensions)
  // Match dialogs exactly: height - 4 - 4 - 2 = height - 10
  const totalOverhead = HEADER_LINE_COUNT + FOOTER_LINE_COUNT + BORDER_OVERHEAD;
  return Math.max(1, frameHeight - totalOverhead);
}

function renderWindow(config: WindowConfig, ctx: RenderContext): void {
  const { innerWidth, contentHeight } = ctx;

  const { y: paddingY } = getPadding();

  // Begin buffered rendering for flicker-free output
  beginRender();

  clearScreen();
  hideCursor();

  // Vertical padding
  drawVerticalPadding(paddingY);

  drawTopBorder(innerWidth);
  drawWindowHeader(
    innerWidth,
    config.title,
    config.subtitle,
    config.description,
  );
  drawDivider(innerWidth);

  // Get content from render function
  const contentResult = config.onRender(ctx);
  const contentLines: string[] = Array.isArray(contentResult)
    ? contentResult
    : [];

  // Calculate vertical centering
  const actualContentLines = contentLines.length;
  const availableExtraLines = Math.max(0, contentHeight - actualContentLines);
  const topPadding = Math.floor(availableExtraLines / 2);
  const bottomPadding = availableExtraLines - topPadding;

  // Top padding for vertical centering
  for (let i = 0; i < topPadding; i++) {
    drawEmptyLine(innerWidth);
  }

  // Draw content lines
  for (const line of contentLines) {
    if (config.centerContent) {
      drawCenteredLine(line, innerWidth);
    } else {
      drawLine(line, innerWidth);
    }
  }

  // Bottom padding for vertical centering
  for (let i = 0; i < bottomPadding; i++) {
    drawEmptyLine(innerWidth);
  }

  drawDivider(innerWidth);
  drawWindowFooter(innerWidth, config.hints);
  drawBottomBorder(innerWidth);

  // Flush all buffered output at once
  flushRender();
}

// =============================================================================
// Window Factory
// =============================================================================

/**
 * Create a unified window component with lifecycle management.
 *
 * @example
 * ```ts
 * await createWindow({
 *   title: "♪ METRONOME",
 *   subtitle: "Basic Rock",
 *   description: "Real-time drum pattern player",
 *   hints: ["Space Play/Pause", "↑↓ BPM ±5", "q/⌫ Back"],
 *   helpContent: HELP_METRONOME,
 *
 *   onRender: (ctx) => {
 *     return buildMetronomeContent(bpm, isPlaying, ctx.innerWidth);
 *   },
 *
 *   onKeypress: (key, actions) => {
 *     if (key.name === "space") { isPlaying = !isPlaying; actions.redraw(); }
 *     if (key.name === "up") { bpm += 5; actions.redraw(); }
 *     if (key.name === "down") { bpm -= 5; actions.redraw(); }
 *   },
 * }).run();
 * ```
 */
export function createWindow(config: WindowConfig): WindowInstance {
  return {
    run: () => runWindow(config),
  };
}

async function runWindow(config: WindowConfig): Promise<void> {
  let keyboard: ReturnType<typeof createKeyboardHandler> | null = null;
  let isClosing = false;
  let resolvePromise: () => void;

  // Calculate render context
  const getRenderContext = (): RenderContext => {
    const { width, height } = getFrameDimensions();
    const innerWidth = width - 2;
    const contentHeight = calculateContentHeight(height);
    return { innerWidth, contentHeight };
  };

  // Actions exposed to the config callbacks
  const actions: WindowActions = {
    redraw: () => {
      if (!isClosing) {
        renderWindow(config, getRenderContext());
      }
    },
    close: () => {
      if (!isClosing) {
        isClosing = true;
        cleanup();
        resolvePromise();
      }
    },
    pauseKeyboard: () => {
      if (keyboard) {
        keyboard.cleanup();
        keyboard = null;
      }
    },
    resumeKeyboard: () => {
      if (!keyboard && !isClosing) {
        setupKeyboard();
        renderWindow(config, getRenderContext());
      }
    },
  };

  // Handle terminal resize
  const onResize = () => {
    if (!isClosing) {
      renderWindow(config, getRenderContext());
    }
  };
  process.stdout.on("resize", onResize);

  // Cleanup function
  const cleanup = () => {
    process.stdout.off("resize", onResize);
    if (config.onUnmount) {
      config.onUnmount();
    }
    if (keyboard) {
      keyboard.cleanup();
      keyboard = null;
    }
    showCursor();
    clearScreen();
  };

  // Setup keyboard handler
  const setupKeyboard = () => {
    keyboard = createKeyboardHandler();

    keyboard.onKeypress(async (key) => {
      if (isClosing) return;

      // Call custom keypress handler first (await if async)
      if (config.onKeypress) {
        const handledResult = config.onKeypress(key, actions);
        // Await the result if it's a promise
        const handled =
          handledResult instanceof Promise
            ? await handledResult
            : handledResult;
        if (handled === true) {
          // Custom handler consumed the event, skip defaults
          return;
        }
      }

      // Help key (if help content provided)
      if (config.helpContent && isHelpKey(key)) {
        // Cleanup keyboard before showing help
        if (keyboard) {
          keyboard.cleanup();
          keyboard = null;
        }

        await showHelp(config.helpContent);

        // Re-setup keyboard and redraw after help closes
        if (!isClosing) {
          setupKeyboard();
          renderWindow(config, getRenderContext());
        }
        return;
      }

      // Back/quit keys
      if (isBackKey(key)) {
        actions.close();
        return;
      }
    });
  };

  return new Promise<void>((resolve) => {
    resolvePromise = resolve;

    // Initial render
    renderWindow(config, getRenderContext());

    // Setup keyboard
    setupKeyboard();

    // Call onMount hook with actions
    if (config.onMount) {
      const mountResult = config.onMount(actions);
      if (mountResult instanceof Promise) {
        mountResult.catch((err) => {
          console.error("onMount error:", err);
        });
      }
    }
  });
}

// =============================================================================
// Re-exports for convenience
// =============================================================================

export type { KeypressEvent } from "./core/keyboard";
export type { HelpContent } from "./dialogs/help";
