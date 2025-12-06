/**
 * QuarkTUI - Terminal Core
 *
 * Low-level terminal operations including cursor control,
 * screen clearing, terminal size detection, and render buffering.
 */
/**
 * Check if render buffering is currently active.
 */
export declare function isRenderBuffering(): boolean;
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
export declare function beginRender(): void;
/**
 * Flush the render buffer to the terminal.
 * Writes all buffered content in a single operation to reduce flicker.
 * Automatically ends buffering mode.
 */
export declare function flushRender(): void;
/**
 * Cancel buffered rendering without flushing.
 * Discards all buffered content.
 */
export declare function cancelRender(): void;
/**
 * Write to the render buffer or directly to stdout.
 * Used internally by drawing functions.
 *
 * @param text - Text to write (without newline)
 */
export declare function bufferWrite(text: string): void;
/**
 * Write a line to the render buffer or directly to stdout.
 * Used internally by drawing functions.
 *
 * @param text - Text to write (newline will be added)
 */
export declare function bufferWriteLine(text?: string): void;
/**
 * Clear the entire screen and move cursor to home position.
 */
export declare function clearScreen(): void;
/**
 * Clear from cursor to end of screen.
 */
export declare function clearToEnd(): void;
/**
 * Clear the current line.
 */
export declare function clearLine(): void;
/**
 * Hide the cursor.
 */
export declare function hideCursor(): void;
/**
 * Show the cursor.
 */
export declare function showCursor(): void;
/**
 * Move cursor to a specific position.
 * @param row - 1-based row number
 * @param col - 1-based column number
 */
export declare function moveCursor(row: number, col: number): void;
/**
 * Move cursor up by n rows.
 */
export declare function moveCursorUp(n?: number): void;
/**
 * Move cursor down by n rows.
 */
export declare function moveCursorDown(n?: number): void;
/**
 * Move cursor right by n columns.
 */
export declare function moveCursorRight(n?: number): void;
/**
 * Move cursor left by n columns.
 */
export declare function moveCursorLeft(n?: number): void;
/**
 * Save current cursor position.
 */
export declare function saveCursorPosition(): void;
/**
 * Restore previously saved cursor position.
 */
export declare function restoreCursorPosition(): void;
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
export declare const DEFAULT_WIDTH = 80;
/** Default terminal height if detection fails */
export declare const DEFAULT_HEIGHT = 24;
/**
 * Get the current terminal size.
 * Falls back to defaults if size cannot be determined.
 */
export declare function getTerminalSize(): TerminalSize;
/**
 * Check if stdout is a TTY (interactive terminal).
 */
export declare function isTTY(): boolean;
/**
 * Check if stdin is a TTY.
 */
export declare function isInputTTY(): boolean;
/**
 * Write text to stdout without a newline.
 * Respects render buffering if active.
 */
export declare function write(text: string): void;
/**
 * Write text to stdout with a newline.
 * Respects render buffering if active.
 */
export declare function writeLine(text?: string): void;
/**
 * Ring the terminal bell.
 */
export declare function bell(): void;
/**
 * Enter the alternate screen buffer.
 * This preserves the main screen content.
 */
export declare function enterAlternateScreen(): void;
/**
 * Leave the alternate screen buffer.
 * This restores the main screen content.
 */
export declare function leaveAlternateScreen(): void;
//# sourceMappingURL=terminal.d.ts.map