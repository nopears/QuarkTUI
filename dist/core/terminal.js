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
let renderBuffer = [];
/** Whether buffering is currently active */
let isBuffering = false;
/**
 * Check if render buffering is currently active.
 */
export function isRenderBuffering() {
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
export function beginRender() {
    isBuffering = true;
    renderBuffer = [];
}
/**
 * Flush the render buffer to the terminal.
 * Writes all buffered content in a single operation to reduce flicker.
 * Automatically ends buffering mode.
 */
export function flushRender() {
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
export function cancelRender() {
    renderBuffer = [];
    isBuffering = false;
}
/**
 * Write to the render buffer or directly to stdout.
 * Used internally by drawing functions.
 *
 * @param text - Text to write (without newline)
 */
export function bufferWrite(text) {
    if (isBuffering) {
        renderBuffer.push(text);
    }
    else {
        process.stdout.write(text);
    }
}
/**
 * Write a line to the render buffer or directly to stdout.
 * Used internally by drawing functions.
 *
 * @param text - Text to write (newline will be added)
 */
export function bufferWriteLine(text = "") {
    if (isBuffering) {
        renderBuffer.push(text + "\n");
    }
    else {
        console.log(text);
    }
}
// =============================================================================
// Screen Control
// =============================================================================
/**
 * Clear the entire screen and move cursor to home position.
 */
export function clearScreen() {
    bufferWrite("\x1b[2J\x1b[H");
}
/**
 * Clear from cursor to end of screen.
 */
export function clearToEnd() {
    bufferWrite("\x1b[J");
}
/**
 * Clear the current line.
 */
export function clearLine() {
    bufferWrite("\x1b[2K");
}
// =============================================================================
// Cursor Control
// =============================================================================
/**
 * Hide the cursor.
 */
export function hideCursor() {
    bufferWrite("\x1b[?25l");
}
/**
 * Show the cursor.
 */
export function showCursor() {
    bufferWrite("\x1b[?25h");
}
/**
 * Move cursor to a specific position.
 * @param row - 1-based row number
 * @param col - 1-based column number
 */
export function moveCursor(row, col) {
    bufferWrite(`\x1b[${row};${col}H`);
}
/**
 * Move cursor up by n rows.
 */
export function moveCursorUp(n = 1) {
    bufferWrite(`\x1b[${n}A`);
}
/**
 * Move cursor down by n rows.
 */
export function moveCursorDown(n = 1) {
    bufferWrite(`\x1b[${n}B`);
}
/**
 * Move cursor right by n columns.
 */
export function moveCursorRight(n = 1) {
    bufferWrite(`\x1b[${n}C`);
}
/**
 * Move cursor left by n columns.
 */
export function moveCursorLeft(n = 1) {
    bufferWrite(`\x1b[${n}D`);
}
/**
 * Save current cursor position.
 */
export function saveCursorPosition() {
    bufferWrite("\x1b[s");
}
/**
 * Restore previously saved cursor position.
 */
export function restoreCursorPosition() {
    bufferWrite("\x1b[u");
}
/** Default terminal width if detection fails */
export const DEFAULT_WIDTH = 80;
/** Default terminal height if detection fails */
export const DEFAULT_HEIGHT = 24;
/**
 * Get the current terminal size.
 * Falls back to defaults if size cannot be determined.
 */
export function getTerminalSize() {
    return {
        width: process.stdout.columns || DEFAULT_WIDTH,
        height: process.stdout.rows || DEFAULT_HEIGHT,
    };
}
/**
 * Check if stdout is a TTY (interactive terminal).
 */
export function isTTY() {
    return process.stdout.isTTY === true;
}
/**
 * Check if stdin is a TTY.
 */
export function isInputTTY() {
    return process.stdin.isTTY === true;
}
// =============================================================================
// Output Helpers
// =============================================================================
/**
 * Write text to stdout without a newline.
 * Respects render buffering if active.
 */
export function write(text) {
    bufferWrite(text);
}
/**
 * Write text to stdout with a newline.
 * Respects render buffering if active.
 */
export function writeLine(text = "") {
    bufferWriteLine(text);
}
/**
 * Ring the terminal bell.
 */
export function bell() {
    bufferWrite("\x07");
}
// =============================================================================
// Alternate Screen Buffer
// =============================================================================
/**
 * Enter the alternate screen buffer.
 * This preserves the main screen content.
 */
export function enterAlternateScreen() {
    bufferWrite("\x1b[?1049h");
}
/**
 * Leave the alternate screen buffer.
 * This restores the main screen content.
 */
export function leaveAlternateScreen() {
    bufferWrite("\x1b[?1049l");
}
//# sourceMappingURL=terminal.js.map