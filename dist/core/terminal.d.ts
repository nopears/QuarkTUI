/**
 * QuarkTUI - Terminal Core
 *
 * Low-level terminal operations including cursor control,
 * screen clearing, and terminal size detection.
 */
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
 */
export declare function write(text: string): void;
/**
 * Write text to stdout with a newline.
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