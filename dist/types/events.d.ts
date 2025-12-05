/**
 * QuarkTUI - Event Types
 *
 * Type definitions for keyboard and input events.
 */
/**
 * Keyboard event data from a keypress.
 */
export interface KeypressEvent {
    /** The name of the key (e.g., "return", "backspace", "up", "down") */
    name?: string;
    /** Whether Ctrl was held during the keypress */
    ctrl?: boolean;
    /** Whether Meta/Command was held during the keypress */
    meta?: boolean;
    /** Whether Shift was held during the keypress */
    shift?: boolean;
    /** The string representation of the key (single character for printable keys) */
    str?: string;
}
/**
 * Keyboard handler interface for managing keyboard input.
 */
export interface KeyboardHandler {
    /** Add a keypress listener */
    onKeypress: (handler: (key: KeypressEvent) => void | Promise<void>) => void;
    /** Remove a keypress listener */
    offKeypress: (handler: (key: KeypressEvent) => void | Promise<void>) => void;
    /** Cleanup and restore terminal state */
    cleanup: () => void;
    /** Check if already cleaned up */
    isCleanedUp: () => boolean;
}
/**
 * Options for creating a keyboard handler.
 */
export interface KeyboardHandlerOptions {
    /** Whether to set up signal handlers for SIGINT/SIGTERM (default: false) */
    handleSignals?: boolean;
    /** Callback to run before cleanup on signal (for async cleanup) */
    onSignalCleanup?: () => void | Promise<void>;
    /** Callback to run on process exit (synchronous only) */
    onExit?: () => void;
}
//# sourceMappingURL=events.d.ts.map