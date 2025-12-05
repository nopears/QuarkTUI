/**
 * QuarkTUI - Help Dialog
 *
 * A help overlay system for displaying keyboard shortcuts and contextual help.
 * Applications provide help content, and QuarkTUI handles the display.
 */
import { type KeypressEvent } from "../core/keyboard";
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
/**
 * Check if a key event is the help key.
 * @param key - The keypress event to check
 * @returns True if the key is the help key (?)
 */
export declare function isHelpKey(key: KeypressEvent): boolean;
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
export declare function showHelp(content: HelpContent): Promise<void>;
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
export declare function mergeHelpContent(...contents: HelpContent[]): HelpContent;
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
export declare function createSimpleHelp(screenName: string, bindings: KeyBinding[]): HelpContent;
//# sourceMappingURL=help.d.ts.map