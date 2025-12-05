/**
 * QuarkTUI - Select Menu Dialog
 *
 * A configurable list selection dialog with keyboard navigation.
 * Supports hints, info lines, and customizable styling.
 */
import type { MenuOption, SelectMenuOptions, SelectResult } from "../types/menu";
export type { MenuOption, SelectMenuOptions, SelectResult };
/**
 * Extended options for select menu with additional customization.
 */
export interface SelectMenuConfig<T> extends SelectMenuOptions<T> {
    /** Custom header renderer */
    renderHeader?: (innerWidth: number) => void;
    /** Custom footer renderer */
    renderFooter?: (innerWidth: number) => void;
    /** Allow number keys for quick selection (default: true if <= 9 items) */
    allowNumberKeys?: boolean;
}
/**
 * Display a select menu and wait for user selection.
 *
 * @param options - Menu configuration
 * @returns The selected value or cancelled result
 *
 * @example
 * ```ts
 * const result = await selectMenu({
 *   title: "Choose an option",
 *   options: [
 *     { label: "Option 1", value: "opt1" },
 *     { label: "Option 2", value: "opt2", hint: "recommended" },
 *     { label: "Cancel", value: "cancel" },
 *   ],
 * });
 *
 * if (result.type === "selected") {
 *   console.log("Selected:", result.value);
 * }
 * ```
 */
export declare function selectMenu<T = string>(options: SelectMenuOptions<T> | SelectMenuConfig<T>): Promise<SelectResult<T>>;
//# sourceMappingURL=select.d.ts.map