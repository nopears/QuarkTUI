/**
 * QuarkTUI - Terminal Core
 *
 * Low-level terminal operations including cursor control,
 * screen clearing, terminal size detection, and render buffering.
 */

import process from "node:process";

// =============================================================================
// Render Buffer
// =============================================================================

/** Internal buffer for batched writes */
let renderBuffer: string[] = [];

/** Whether buffering is currently active */
let isBuffering = false;

/**
 * Check if render buffering is currently active.
 */
export function isRenderBuffering(): boolean {
  return isBuffering;
}

/**
 * Begin buffered rendering.
 * All subsequent write operations will be collected in a buffer
 * until `flushRender()` is called.
 *
 * @example
 * ```ts
 * beginRender();
 * drawTopBorder(width);
 * drawLine("Hello", width);
 * drawBottomBorder(width);
 * flushRender(); // Single write to terminal
 * ```
 */
export function beginRender(): void {
  isBuffering = true;
  renderBuffer = [];
}

/**
 * Flush the render buffer to the terminal.
 * Writes all buffered content in a single operation to reduce flicker.
 * Automatically ends buffering mode.
 */
export function flushRender(): void {
  if (renderBuffer.length > 0) {
    process.stdout.write(renderBuffer.join(""));
  }
  renderBuffer = [];
  isBuffering = false;
}

/**
 * Cancel buffered rendering without flushing.
 * Discards all buffered content.
 */
export function cancelRender(): void {
  renderBuffer = [];
  isBuffering = false;
}

/**
 * Write to the render buffer or directly to stdout.
 * Used internally by drawing functions.
 *
 * @param text - Text to write (without newline)
 */
export function bufferWrite(text: string): void {
  if (isBuffering) {
    renderBuffer.push(text);
  } else {
    process.stdout.write(text);
  }
}

/**
 * Write a line to the render buffer or directly to stdout.
 * Used internally by drawing functions.
 *
 * @param text - Text to write (newline will be added)
 */
export function bufferWriteLine(text: string = ""): void {
  if (isBuffering) {
    renderBuffer.push(text + "\n");
  } else {
    console.log(text);
  }
}

// =============================================================================
// Screen Control
// =============================================================================

/**
 * Clear the entire screen and move cursor to home position.
 */
export function clearScreen(): void {
  bufferWrite("\x1b[2J\x1b[H");
}

/**
 * Clear from cursor to end of screen.
 */
export function clearToEnd(): void {
  bufferWrite("\x1b[J");
}

/**
 * Clear the current line.
 */
export function clearLine(): void {
  bufferWrite("\x1b[2K");
}

// =============================================================================
// Cursor Control
// =============================================================================

/**
 * Hide the cursor.
 */
export function hideCursor(): void {
  bufferWrite("\x1b[?25l");
}

/**
 * Show the cursor.
 */
export function showCursor(): void {
  bufferWrite("\x1b[?25h");
}

/**
 * Move cursor to a specific position.
 * @param row - 1-based row number
 * @param col - 1-based column number
 */
export function moveCursor(row: number, col: number): void {
  bufferWrite(`\x1b[${row};${col}H`);
}

/**
 * Move cursor up by n rows.
 */
export function moveCursorUp(n: number = 1): void {
  bufferWrite(`\x1b[${n}A`);
}

/**
 * Move cursor down by n rows.
 */
export function moveCursorDown(n: number = 1): void {
  bufferWrite(`\x1b[${n}B`);
}

/**
 * Move cursor right by n columns.
 */
export function moveCursorRight(n: number = 1): void {
  bufferWrite(`\x1b[${n}C`);
}

/**
 * Move cursor left by n columns.
 */
export function moveCursorLeft(n: number = 1): void {
  bufferWrite(`\x1b[${n}D`);
}

/**
 * Save current cursor position.
 */
export function saveCursorPosition(): void {
  bufferWrite("\x1b[s");
}

/**
 * Restore previously saved cursor position.
 */
export function restoreCursorPosition(): void {
  bufferWrite("\x1b[u");
}

// =============================================================================
// Terminal Size
// =============================================================================

/**
 * Terminal dimensions.
 */
export interface TerminalSize {
  /** Number of columns (width in characters) */
  width: number;
  /** Number of rows (height in characters) */
  height: number;
}

/** Default terminal width if detection fails */
export const DEFAULT_WIDTH = 80;

/** Default terminal height if detection fails */
export const DEFAULT_HEIGHT = 24;

/**
 * Get the current terminal size.
 * Falls back to defaults if size cannot be determined.
 */
export function getTerminalSize(): TerminalSize {
  return {
    width: process.stdout.columns || DEFAULT_WIDTH,
    height: process.stdout.rows || DEFAULT_HEIGHT,
  };
}

/**
 * Check if stdout is a TTY (interactive terminal).
 */
export function isTTY(): boolean {
  return process.stdout.isTTY === true;
}

/**
 * Check if stdin is a TTY.
 */
export function isInputTTY(): boolean {
  return process.stdin.isTTY === true;
}

// =============================================================================
// Output Helpers
// =============================================================================

/**
 * Write text to stdout without a newline.
 * Respects render buffering if active.
 */
export function write(text: string): void {
  bufferWrite(text);
}

/**
 * Write text to stdout with a newline.
 * Respects render buffering if active.
 */
export function writeLine(text: string = ""): void {
  bufferWriteLine(text);
}

/**
 * Ring the terminal bell.
 */
export function bell(): void {
  bufferWrite("\x07");
}

// =============================================================================
// Alternate Screen Buffer
// =============================================================================

/**
 * Enter the alternate screen buffer.
 * This preserves the main screen content.
 */
export function enterAlternateScreen(): void {
  bufferWrite("\x1b[?1049h");
}

/**
 * Leave the alternate screen buffer.
 * This restores the main screen content.
 */
export function leaveAlternateScreen(): void {
  bufferWrite("\x1b[?1049l");
}
