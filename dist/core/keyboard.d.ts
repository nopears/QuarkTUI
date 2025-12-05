/**
 * QuarkTUI - Keyboard Input
 *
 * Handles keyboard input in raw mode with proper terminal state management.
 * Provides utilities for detecting common key combinations and navigation.
 */
import type { KeypressEvent, KeyboardHandler, KeyboardHandlerOptions } from "../types/events";
/**
 * Creates a keyboard handler that manages stdin, readline, and raw mode.
 * This eliminates the boilerplate of setting up keyboard input in interactive UIs.
 *
 * @param options - Configuration options for the handler
 * @returns A keyboard handler with methods for managing input
 *
 * @example
 * ```ts
 * const keyboard = createKeyboardHandler();
 *
 * keyboard.onKeypress(async (key) => {
 *   if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
 *     keyboard.cleanup();
 *     return;
 *   }
 *   console.log('Key pressed:', key.name);
 * });
 *
 * // Later, when done:
 * keyboard.cleanup();
 * ```
 */
export declare function createKeyboardHandler(options?: KeyboardHandlerOptions): KeyboardHandler;
/**
 * Wait for a single keypress and return it.
 * This is a convenience wrapper around createKeyboardHandler for simple use cases.
 *
 * @returns Promise resolving to the keypress event
 *
 * @example
 * ```ts
 * const key = await waitForKeypress();
 * if (key.name === 'return') {
 *   console.log('Enter pressed!');
 * }
 * ```
 */
export declare function waitForKeypress(): Promise<KeypressEvent>;
/**
 * Wait for a keypress with the ability to cancel.
 * Returns an object with the promise and a cancel function.
 * When cancelled, the keyboard handler is cleaned up properly.
 *
 * @returns Object with promise and cancel function
 *
 * @example
 * ```ts
 * const { promise, cancel } = waitForKeypressCancellable();
 * const key = await Promise.race([promise, someOtherPromise]);
 * cancel(); // Always call cancel to cleanup if the other promise won
 * ```
 */
export declare function waitForKeypressCancellable(): {
    promise: Promise<KeypressEvent>;
    cancel: () => void;
};
/**
 * Check if a key event represents a "back" or "cancel" action.
 * This includes: backspace, escape, 'q', or Ctrl+C
 */
export declare function isBackKey(key: KeypressEvent): boolean;
/**
 * Check if a key event represents a "confirm" action.
 * This includes: return/enter
 */
export declare function isConfirmKey(key: KeypressEvent): boolean;
/**
 * Check if a key event represents navigation up.
 * This includes: up arrow, 'k'
 */
export declare function isUpKey(key: KeypressEvent): boolean;
/**
 * Check if a key event represents navigation down.
 * This includes: down arrow, 'j'
 */
export declare function isDownKey(key: KeypressEvent): boolean;
/**
 * Check if a key event represents navigation left.
 * This includes: left arrow, 'h'
 */
export declare function isLeftKey(key: KeypressEvent): boolean;
/**
 * Check if a key event represents navigation right.
 * This includes: right arrow, 'l'
 */
export declare function isRightKey(key: KeypressEvent): boolean;
/**
 * Check if a key event is the help key.
 * This includes: '?'
 */
export declare function isHelpKey(key: KeypressEvent): boolean;
/**
 * Check if a key event is a number key (0-9).
 * Returns the number or null if not a number key.
 */
export declare function getNumberKey(key: KeypressEvent): number | null;
/**
 * Check if a key event is a printable character.
 */
export declare function isPrintable(key: KeypressEvent): boolean;
export type { KeypressEvent, KeyboardHandler, KeyboardHandlerOptions };
//# sourceMappingURL=keyboard.d.ts.map