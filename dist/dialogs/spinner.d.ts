/**
 * QuarkTUI - Spinner/Loading Indicator
 *
 * A customizable loading spinner with message support.
 * Can be updated while running and stopped with a final message.
 */
import type { SpinnerOptions, SpinnerController } from "../types/menu";
export type { SpinnerOptions, SpinnerController };
/**
 * Extended options for spinner with additional customization.
 */
export interface SpinnerConfig extends SpinnerOptions {
    /** Title displayed above the spinner (optional) */
    title?: string;
    /** Whether to center the spinner message */
    centerMessage?: boolean;
}
/**
 * Braille dot spinner frames (default).
 */
export declare const SPINNER_DOTS: string[];
/**
 * Line spinner frames.
 */
export declare const SPINNER_LINE: string[];
/**
 * Arc spinner frames.
 */
export declare const SPINNER_ARC: string[];
/**
 * Circle spinner frames.
 */
export declare const SPINNER_CIRCLE: string[];
/**
 * Box spinner frames.
 */
export declare const SPINNER_BOX: string[];
/**
 * Bounce spinner frames.
 */
export declare const SPINNER_BOUNCE: string[];
/**
 * Growing bar spinner frames.
 */
export declare const SPINNER_BAR: string[];
/**
 * Show a loading spinner with a message.
 * Returns a controller to update the message or stop the spinner.
 *
 * @param options - Spinner configuration (can be just a message string)
 * @returns Controller to update or stop the spinner
 *
 * @example
 * ```ts
 * const spinner = showSpinner("Loading data...");
 *
 * await fetchData();
 * spinner.update("Processing...");
 *
 * await processData();
 * spinner.stop("Done!");
 * ```
 *
 * @example
 * ```ts
 * const spinner = showSpinner({
 *   message: "Downloading...",
 *   title: "Please Wait",
 *   frames: SPINNER_CIRCLE,
 *   interval: 100,
 * });
 *
 * // Later...
 * spinner.stop();
 * ```
 */
export declare function showSpinner(options: string | SpinnerOptions | SpinnerConfig): SpinnerController;
/**
 * Run an async operation with a spinner.
 * Automatically stops the spinner when the operation completes.
 *
 * @param message - Message to display while loading
 * @param operation - Async operation to run
 * @param successMessage - Optional message to show on success
 * @returns The result of the operation
 *
 * @example
 * ```ts
 * const data = await withSpinner(
 *   "Fetching data...",
 *   () => fetchData(),
 *   "Data loaded!"
 * );
 * ```
 */
export declare function withSpinner<T>(message: string, operation: () => Promise<T>, successMessage?: string): Promise<T>;
//# sourceMappingURL=spinner.d.ts.map