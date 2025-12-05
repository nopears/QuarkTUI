/**
 * QuarkTUI - Terminal Core
 *
 * Low-level terminal operations including cursor control,
 * screen clearing, and terminal size detection.
 */

import process from "node:process";

// =============================================================================
// Screen Control
// =============================================================================

/**
 * Clear the entire screen and move cursor to home position.
 */
export function clearScreen(): void {
  process.stdout.write("\x1b[2J\x1b[H");
}

/**
 * Clear from cursor to end of screen.
 */
export function clearToEnd(): void {
  process.stdout.write("\x1b[J");
}

/**
 * Clear the current line.
 */
export function clearLine(): void {
  process.stdout.write("\x1b[2K");
}

// =============================================================================
// Cursor Control
// =============================================================================

/**
 * Hide the cursor.
 */
export function hideCursor(): void {
  process.stdout.write("\x1b[?25l");
}

/**
 * Show the cursor.
 */
export function showCursor(): void {
  process.stdout.write("\x1b[?25h");
}

/**
 * Move cursor to a specific position.
 * @param row - 1-based row number
 * @param col - 1-based column number
 */
export function moveCursor(row: number, col: number): void {
  process.stdout.write(`\x1b[${row};${col}H`);
}

/**
 * Move cursor up by n rows.
 */
export function moveCursorUp(n: number = 1): void {
  process.stdout.write(`\x1b[${n}A`);
}

/**
 * Move cursor down by n rows.
 */
export function moveCursorDown(n: number = 1): void {
  process.stdout.write(`\x1b[${n}B`);
}

/**
 * Move cursor right by n columns.
 */
export function moveCursorRight(n: number = 1): void {
  process.stdout.write(`\x1b[${n}C`);
}

/**
 * Move cursor left by n columns.
 */
export function moveCursorLeft(n: number = 1): void {
  process.stdout.write(`\x1b[${n}D`);
}

/**
 * Save current cursor position.
 */
export function saveCursorPosition(): void {
  process.stdout.write("\x1b[s");
}

/**
 * Restore previously saved cursor position.
 */
export function restoreCursorPosition(): void {
  process.stdout.write("\x1b[u");
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
 */
export function write(text: string): void {
  process.stdout.write(text);
}

/**
 * Write text to stdout with a newline.
 */
export function writeLine(text: string = ""): void {
  console.log(text);
}

/**
 * Ring the terminal bell.
 */
export function bell(): void {
  process.stdout.write("\x07");
}

// =============================================================================
// Alternate Screen Buffer
// =============================================================================

/**
 * Enter the alternate screen buffer.
 * This preserves the main screen content.
 */
export function enterAlternateScreen(): void {
  process.stdout.write("\x1b[?1049h");
}

/**
 * Leave the alternate screen buffer.
 * This restores the main screen content.
 */
export function leaveAlternateScreen(): void {
  process.stdout.write("\x1b[?1049l");
}
