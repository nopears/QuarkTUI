/**
 * QuarkTUI - Confirm Dialog
 *
 * A simple Yes/No confirmation dialog with keyboard navigation.
 */
import type { ConfirmOptions, ConfirmResult } from "../types/menu";
export type { ConfirmOptions, ConfirmResult };
/**
 * Extended options for confirm dialog with additional customization.
 */
export interface ConfirmConfig extends ConfirmOptions {
    /** Custom header renderer */
    renderHeader?: (innerWidth: number) => void;
    /** Custom footer renderer */
    renderFooter?: (innerWidth: number) => void;
}
/**
 * Display a confirmation dialog and wait for user response.
 *
 * @param options - Confirm dialog configuration
 * @returns Confirmed or cancelled result
 *
 * @example
 * ```ts
 * const result = await confirm({
 *   title: "Delete this file?",
 *   message: "This action cannot be undone.",
 *   confirmLabel: "Delete",
 *   cancelLabel: "Keep",
 * });
 *
 * if (result.type === "confirmed") {
 *   // User confirmed
 * }
 * ```
 */
export declare function confirm(options: ConfirmOptions | ConfirmConfig): Promise<ConfirmResult>;
/**
 * Simple yes/no confirm with just a title.
 *
 * @param title - The question to ask
 * @returns True if confirmed, false otherwise
 */
export declare function confirmYesNo(title: string): Promise<boolean>;
//# sourceMappingURL=confirm.d.ts.map