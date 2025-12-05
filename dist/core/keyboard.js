/**
 * QuarkTUI - Keyboard Input
 *
 * Handles keyboard input in raw mode with proper terminal state management.
 * Provides utilities for detecting common key combinations and navigation.
 */
import process from "node:process";
import readline from "node:readline";
// =============================================================================
// Global Safety Handlers
// =============================================================================
// Track active handlers and original terminal state for emergency restoration
let activeHandlerCount = 0;
let originalRawMode;
let globalHandlersRegistered = false;
/**
 * Register global safety handlers to restore terminal state on crash/exit.
 * This ensures the terminal is restored even if the application crashes.
 */
function registerGlobalHandlers() {
    if (globalHandlersRegistered)
        return;
    globalHandlersRegistered = true;
    const restoreTerminal = () => {
        if (process.stdin.isTTY && originalRawMode !== undefined) {
            try {
                process.stdin.setRawMode(originalRawMode);
            }
            catch {
                // Ignore errors during emergency restoration
            }
        }
    };
    // Restore on uncaught exception
    process.on("uncaughtException", (err) => {
        restoreTerminal();
        console.error("Uncaught exception:", err);
        process.exit(1);
    });
    // Restore on unhandled rejection
    process.on("unhandledRejection", (reason) => {
        restoreTerminal();
        console.error("Unhandled rejection:", reason);
        process.exit(1);
    });
    // Handle SIGINT (Ctrl+C) as a safety fallback
    process.on("SIGINT", () => {
        restoreTerminal();
        process.exit(0);
    });
    // Handle SIGTERM for graceful shutdown
    process.on("SIGTERM", () => {
        restoreTerminal();
        process.exit(0);
    });
    // Restore on exit
    process.on("exit", restoreTerminal);
}
// =============================================================================
// Keyboard Handler
// =============================================================================
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
export function createKeyboardHandler(options = {}) {
    const { handleSignals = false, onSignalCleanup, onExit } = options;
    // Register global safety handlers
    registerGlobalHandlers();
    const wasRaw = process.stdin.isRaw;
    let cleanedUp = false;
    const handlers = new Set();
    // Track original raw mode for global safety handler
    if (activeHandlerCount === 0) {
        originalRawMode = wasRaw ?? false;
    }
    activeHandlerCount++;
    // Set up raw mode
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    // Create readline interface
    const rl = readline.createInterface({
        input: process.stdin,
        escapeCodeTimeout: 50,
    });
    readline.emitKeypressEvents(process.stdin, rl);
    // Internal keypress handler
    const internalHandler = (str, key) => {
        const event = {
            name: key?.name,
            ctrl: key?.ctrl,
            meta: key?.meta,
            shift: key?.shift,
            str,
        };
        for (const handler of handlers) {
            handler(event);
        }
    };
    process.stdin.on("keypress", internalHandler);
    // Cleanup function
    const cleanup = () => {
        if (cleanedUp)
            return;
        cleanedUp = true;
        // Decrement active handler count
        activeHandlerCount--;
        // Remove signal handlers if they were set up
        if (handleSignals) {
            process.removeListener("SIGINT", signalHandler);
            process.removeListener("SIGTERM", signalHandler);
        }
        if (onExit) {
            process.removeListener("exit", exitHandler);
        }
        // Remove keypress listener
        process.stdin.removeListener("keypress", internalHandler);
        // Close readline
        rl.close();
        // Restore raw mode immediately
        if (process.stdin.isTTY) {
            try {
                process.stdin.setRawMode(wasRaw ?? false);
            }
            catch {
                // Ignore errors during cleanup
            }
        }
        // Clear global tracking if no more handlers
        if (activeHandlerCount === 0) {
            originalRawMode = undefined;
        }
        // Clear handlers
        handlers.clear();
    };
    // Signal handlers
    const signalHandler = () => {
        // FIRST: restore terminal state synchronously
        if (process.stdin.isTTY) {
            try {
                process.stdin.setRawMode(wasRaw ?? false);
            }
            catch {
                // Ignore errors
            }
        }
        // Run cleanup
        cleanup();
        // Then run async cleanup if provided
        if (onSignalCleanup) {
            const result = onSignalCleanup();
            if (result instanceof Promise) {
                result.finally(() => process.exit(0));
                return;
            }
        }
        process.exit(0);
    };
    const exitHandler = () => {
        if (onExit) {
            onExit();
        }
    };
    // Set up signal handlers if requested
    if (handleSignals) {
        process.on("SIGINT", signalHandler);
        process.on("SIGTERM", signalHandler);
    }
    if (onExit) {
        process.on("exit", exitHandler);
    }
    return {
        onKeypress: (handler) => {
            handlers.add(handler);
        },
        offKeypress: (handler) => {
            handlers.delete(handler);
        },
        cleanup,
        isCleanedUp: () => cleanedUp,
    };
}
// =============================================================================
// Single Keypress Utilities
// =============================================================================
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
export function waitForKeypress() {
    return new Promise((resolve) => {
        const keyboard = createKeyboardHandler();
        keyboard.onKeypress((key) => {
            keyboard.cleanup();
            resolve(key);
        });
    });
}
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
export function waitForKeypressCancellable() {
    let keyboard = null;
    const promise = new Promise((resolve) => {
        keyboard = createKeyboardHandler();
        keyboard.onKeypress((key) => {
            if (keyboard) {
                keyboard.cleanup();
                keyboard = null;
            }
            resolve(key);
        });
    });
    const cancel = () => {
        if (keyboard) {
            keyboard.cleanup();
            keyboard = null;
        }
    };
    return { promise, cancel };
}
// =============================================================================
// Key Detection Utilities
// =============================================================================
/**
 * Check if a key event represents a "back" or "cancel" action.
 * This includes: backspace, escape, 'q', or Ctrl+C
 */
export function isBackKey(key) {
    return (key.name === "backspace" ||
        key.name === "escape" ||
        key.str === "q" ||
        (key.ctrl === true && key.name === "c"));
}
/**
 * Check if a key event represents a "confirm" action.
 * This includes: return/enter
 */
export function isConfirmKey(key) {
    return key.name === "return";
}
/**
 * Check if a key event represents navigation up.
 * This includes: up arrow, 'k'
 */
export function isUpKey(key) {
    return key.name === "up" || key.str === "k";
}
/**
 * Check if a key event represents navigation down.
 * This includes: down arrow, 'j'
 */
export function isDownKey(key) {
    return key.name === "down" || key.str === "j";
}
/**
 * Check if a key event represents navigation left.
 * This includes: left arrow, 'h'
 */
export function isLeftKey(key) {
    return key.name === "left" || key.str === "h";
}
/**
 * Check if a key event represents navigation right.
 * This includes: right arrow, 'l'
 */
export function isRightKey(key) {
    return key.name === "right" || key.str === "l";
}
/**
 * Check if a key event is the help key.
 * This includes: '?'
 */
export function isHelpKey(key) {
    return key.str === "?" || key.name === "?";
}
/**
 * Check if a key event is a number key (0-9).
 * Returns the number or null if not a number key.
 */
export function getNumberKey(key) {
    if (key.str && key.str.length === 1) {
        const num = parseInt(key.str, 10);
        if (!isNaN(num) && num >= 0 && num <= 9) {
            return num;
        }
    }
    return null;
}
/**
 * Check if a key event is a printable character.
 */
export function isPrintable(key) {
    return !!(key.str && key.str.length === 1 && !key.ctrl && !key.meta);
}
//# sourceMappingURL=keyboard.js.map