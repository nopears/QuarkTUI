/**
 * QuarkTUI - Help Dialog
 *
 * A help overlay system for displaying keyboard shortcuts and contextual help.
 * Applications provide help content, and QuarkTUI handles the display.
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
  type KeypressEvent,
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
} from "../core/drawing";
import { drawDialogHeader, drawSimpleFooter } from "./shared";

// =============================================================================
// Types
// =============================================================================

/**
 * A single keyboard binding with its description.
 */
export interface KeyBinding {
  /** Key or key combination (e.g., "Space", "Ctrl+C", "↑↓") */
  key: string;
  /** Description of what the key does */
  description: string;
}

/**
 * A section of related key bindings.
 */
export interface HelpSection {
  /** Section title */
  title: string;
  /** Key bindings in this section */
  bindings: KeyBinding[];
}

/**
 * Complete help content for a screen or context.
 */
export interface HelpContent {
  /** Screen/context name displayed in the header */
  screenName: string;
  /** Brief description of the screen */
  description: string;
  /** Sections of key bindings */
  sections: HelpSection[];
  /** Optional tips or notes displayed at the bottom */
  tips?: string[];
}

// =============================================================================
// Key Detection
// =============================================================================

/**
 * Check if a key event is the help key.
 * @param key - The keypress event to check
 * @returns True if the key is the help key (?)
 */
export function isHelpKey(key: KeypressEvent): boolean {
  return key.str === "?" || key.name === "?";
}

// =============================================================================
// Rendering
// =============================================================================

function buildHelpLines(content: HelpContent): string[] {
  const theme = getCurrentTheme();
  const lines: string[] = [];

  // Calculate the maximum key width for alignment
  let maxKeyWidth = 0;
  for (const section of content.sections) {
    for (const binding of section.bindings) {
      if (binding.key.length > maxKeyWidth) {
        maxKeyWidth = binding.key.length;
      }
    }
  }

  // Description
  lines.push(`${DIM}${content.description}${RESET}`);
  lines.push("");

  // Sections
  for (const section of content.sections) {
    lines.push(`${BOLD}${theme.colors.warning}${section.title}${RESET}`);
    for (const binding of section.bindings) {
      const keyPart = `${theme.colors.accent}${binding.key.padEnd(maxKeyWidth)}${RESET}`;
      lines.push(`  ${keyPart}  ${binding.description}`);
    }
    lines.push("");
  }

  // Tips
  if (content.tips && content.tips.length > 0) {
    lines.push(`${BOLD}${theme.colors.success}Tips${RESET}`);
    for (const tip of content.tips) {
      lines.push(`  ${DIM}• ${tip}${RESET}`);
    }
    lines.push("");
  }

  return lines;
}

function renderHelp(
  content: HelpContent,
  contentLines: string[],
  scrollOffset: number,
): void {
  const { width, height } = getFrameDimensions();
  const innerWidth = width - 2;
  const theme = getCurrentTheme();
  const { y: paddingY } = getPadding();

  // Calculate layout
  const headerLineCount = 4; // empty + title + empty + divider
  const footerLineCount = 4; // divider + empty + hint + empty
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
  const icon = `${BOLD}${theme.colors.accent}?${RESET}`;
  drawDialogHeader(innerWidth, {
    title: "HELP",
    icon,
    description: content.screenName,
  });

  drawDivider(innerWidth);

  // Content with scrolling
  const totalLines = contentLines.length;
  const maxScroll = Math.max(0, totalLines - availableContentLines);
  const actualOffset = Math.min(scrollOffset, maxScroll);

  const hasMoreAbove = actualOffset > 0;
  const hasMoreBelow = actualOffset < maxScroll;

  let linesDrawn = 0;

  // Show scroll indicator at top if needed
  if (hasMoreAbove) {
    drawLine(`  ${DIM}↑ scroll up${RESET}`, innerWidth);
    linesDrawn++;
  }

  // Draw visible content
  for (
    let i = actualOffset;
    i < totalLines &&
    linesDrawn < availableContentLines - (hasMoreBelow ? 1 : 0);
    i++
  ) {
    const line = contentLines[i] ?? "";
    drawLine(`  ${line}`, innerWidth);
    linesDrawn++;
  }

  // Show scroll indicator at bottom if needed
  if (hasMoreBelow) {
    drawLine(`  ${DIM}↓ scroll down${RESET}`, innerWidth);
    linesDrawn++;
  }

  // Fill remaining space
  while (linesDrawn < availableContentLines) {
    drawEmptyLine(innerWidth);
    linesDrawn++;
  }

  drawDivider(innerWidth);

  // Footer
  drawSimpleFooter(innerWidth, ["Press any key to close"]);

  drawBottomBorder(innerWidth);

  // Flush all buffered output at once
  flushRender();
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Display a help overlay with keyboard shortcuts and tips.
 * Waits for user to press any key to close.
 *
 * @param content - Help content to display
 *
 * @example
 * ```ts
 * const HELP_MY_SCREEN: HelpContent = {
 *   screenName: "My Screen",
 *   description: "Do something useful",
 *   sections: [
 *     {
 *       title: "Navigation",
 *       bindings: [
 *         { key: "↑↓", description: "Move selection" },
 *         { key: "⏎", description: "Confirm" },
 *       ],
 *     },
 *     {
 *       title: "Actions",
 *       bindings: [
 *         { key: "Space", description: "Toggle" },
 *         { key: "q", description: "Quit" },
 *       ],
 *     },
 *   ],
 *   tips: ["Use vim keys (hjkl) for navigation"],
 * };
 *
 * // In your keypress handler:
 * if (isHelpKey(key)) {
 *   await showHelp(HELP_MY_SCREEN);
 * }
 * ```
 */
export async function showHelp(content: HelpContent): Promise<void> {
  const contentLines = buildHelpLines(content);
  let scrollOffset = 0;
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

  // Calculate max scroll
  const getMaxScroll = () => {
    const { height } = getFrameDimensions();
    const headerLineCount = 4;
    const footerLineCount = 4;
    const availableContentLines =
      height - headerLineCount - footerLineCount - 2;
    return Math.max(0, contentLines.length - availableContentLines);
  };

  // Initial render
  renderHelp(content, contentLines, scrollOffset);

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
      renderHelp(content, contentLines, scrollOffset);
      continue;
    }

    // Handle scrolling
    if (key.name === "up" || key.str === "k") {
      if (scrollOffset > 0) {
        scrollOffset--;
        renderHelp(content, contentLines, scrollOffset);
        continue;
      }
    }

    if (key.name === "down" || key.str === "j") {
      const maxScroll = getMaxScroll();
      if (scrollOffset < maxScroll) {
        scrollOffset++;
        renderHelp(content, contentLines, scrollOffset);
        continue;
      }
    }

    // Page up
    if (key.name === "pageup") {
      scrollOffset = Math.max(0, scrollOffset - 10);
      renderHelp(content, contentLines, scrollOffset);
      continue;
    }

    // Page down
    if (key.name === "pagedown") {
      const maxScroll = getMaxScroll();
      scrollOffset = Math.min(maxScroll, scrollOffset + 10);
      renderHelp(content, contentLines, scrollOffset);
      continue;
    }

    // Any other key closes help
    cleanup();
    return;
  }
}

/**
 * Merge multiple help contents together.
 * Useful for combining context-specific help with global shortcuts.
 *
 * @param contents - Help contents to merge
 * @returns Merged help content
 *
 * @example
 * ```ts
 * const combinedHelp = mergeHelpContent(HELP_MY_SCREEN, HELP_GLOBAL);
 * await showHelp(combinedHelp);
 * ```
 */
export function mergeHelpContent(...contents: HelpContent[]): HelpContent {
  if (contents.length === 0) {
    return {
      screenName: "Help",
      description: "",
      sections: [],
    };
  }

  const first = contents[0]!;

  return {
    screenName: first.screenName,
    description: first.description,
    sections: contents.flatMap((c) => c.sections),
    tips: contents.flatMap((c) => c.tips ?? []),
  };
}

/**
 * Create a simple help content with just key bindings.
 *
 * @param screenName - Name of the screen
 * @param bindings - Key bindings to display
 * @returns Help content
 *
 * @example
 * ```ts
 * const help = createSimpleHelp("My Screen", [
 *   { key: "Space", description: "Do something" },
 *   { key: "q", description: "Quit" },
 * ]);
 * ```
 */
export function createSimpleHelp(
  screenName: string,
  bindings: KeyBinding[],
): HelpContent {
  return {
    screenName,
    description: "",
    sections: [
      {
        title: "Keyboard Shortcuts",
        bindings,
      },
    ],
  };
}
