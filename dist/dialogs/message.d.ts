/**
 * QuarkTUI - Message Dialog
 *
 * Display messages, alerts, and notifications to the user.
 * Supports different message types (info, success, warning, error)
 * with appropriate icons and colors.
 */
import type { MessageType, MessageOptions } from "../types/menu";
export type { MessageType, MessageOptions };
/**
 * Extended options for message dialog with additional customization.
 */
export interface MessageConfig extends MessageOptions {
    /** Custom header renderer */
    renderHeader?: (innerWidth: number) => void;
    /** Custom footer renderer */
    renderFooter?: (innerWidth: number) => void;
    /** Center the message lines (default: false) */
    centerLines?: boolean;
}
/**
 * Display a message without waiting for user input.
 * Useful for showing status before an operation.
 *
 * @param title - Message title
 * @param lines - Lines of text to display
 * @param type - Type of message (affects icon and color)
 *
 * @example
 * ```ts
 * showMessage("Processing", ["Please wait..."], "info");
 * await doSomething();
 * showMessage("Complete", ["Operation finished successfully."], "success");
 * ```
 */
export declare function showMessage(title: string, lines: string[], type?: MessageType): void;
/**
 * Display a message and wait for user to press a key.
 *
 * @param title - Message title
 * @param lines - Lines of text to display
 * @param type - Type of message (affects icon and color)
 *
 * @example
 * ```ts
 * await showMessageAndWait(
 *   "Operation Complete",
 *   ["Your file has been saved.", "Location: /path/to/file.txt"],
 *   "success"
 * );
 * ```
 */
export declare function showMessageAndWait(title: string, lines: string[], type?: MessageType): Promise<void>;
/**
 * Display a message dialog with full configuration options.
 *
 * @param options - Full message configuration
 *
 * @example
 * ```ts
 * await message({
 *   title: "Welcome",
 *   lines: ["Thanks for using our app!", "Press any key to start."],
 *   type: "info",
 *   waitForKey: true,
 *   centerLines: true,
 * });
 * ```
 */
export declare function message(options: MessageOptions | MessageConfig): Promise<void>;
/**
 * Show an info message and wait for key.
 */
export declare function info(title: string, ...lines: string[]): Promise<void>;
/**
 * Show a success message and wait for key.
 */
export declare function success(title: string, ...lines: string[]): Promise<void>;
/**
 * Show a warning message and wait for key.
 */
export declare function warning(title: string, ...lines: string[]): Promise<void>;
/**
 * Show an error message and wait for key.
 */
export declare function error(title: string, ...lines: string[]): Promise<void>;
//# sourceMappingURL=message.d.ts.map