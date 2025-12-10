/**
 * QuarkTUI - Multi-Select Dialog
 *
 * A dialog for selecting multiple items from a list with checkbox-style selection.
 * Supports keyboard navigation, search filtering, and batch selection.
 */
/**
 * A single option in the multi-select menu.
 */
export interface MultiSelectOption<T = string> {
    /** Display label */
    label: string;
    /** Value returned when selected */
    value: T;
    /** Optional hint text shown next to the label */
    hint?: string;
    /** Whether this option is disabled/not selectable */
    disabled?: boolean;
    /** Initial checked state */
    checked?: boolean;
}
/**
 * Options for the multi-select dialog.
 */
export interface MultiSelectOptions<T = string> {
    /** Title displayed at the top */
    title: string;
    /** Array of selectable options */
    options: MultiSelectOption<T>[];
    /** Index of initially focused option */
    focusedIndex?: number;
    /** Informational lines displayed above options */
    infoLines?: string[];
    /** Minimum number of selections required (default: 0) */
    minSelections?: number;
    /** Maximum number of selections allowed (default: unlimited) */
    maxSelections?: number;
    /** Show "Select All" / "Deselect All" options (default: true) */
    showBulkActions?: boolean;
}
/**
 * Extended configuration for multi-select dialog.
 */
export interface MultiSelectConfig<T> extends MultiSelectOptions<T> {
    /** Custom header renderer */
    renderHeader?: (innerWidth: number) => void;
    /** Custom footer renderer */
    renderFooter?: (innerWidth: number) => void;
    /** Allow number keys for quick toggle (default: true if <= 9 items) */
    allowNumberKeys?: boolean;
    /** App name displayed first (e.g., "♪ LAZYGIG") */
    appName?: string;
    /** Page name displayed after app name on same line */
    subtitle?: string;
    /** Description displayed below on its own line */
    description?: string;
}
/**
 * Result from the multi-select dialog.
 */
export type MultiSelectResult<T> = {
    type: "selected";
    values: T[];
} | {
    type: "cancelled";
};
/**
 * Display a multi-select dialog and wait for user selection.
 *
 * @param options - Multi-select configuration
 * @returns The selected values or cancelled result
 *
 * @example
 * ```ts
 * const result = await multiSelect({
 *   title: "Select your preferences",
 *   options: [
 *     { label: "Option A", value: "a" },
 *     { label: "Option B", value: "b", checked: true },
 *     { label: "Option C", value: "c" },
 *   ],
 * });
 *
 * if (result.type === "selected") {
 *   console.log("Selected:", result.values);
 * }
 * ```
 *
 * @example
 * ```ts
 * // With min/max constraints
 * const result = await multiSelect({
 *   title: "Choose 2-4 items",
 *   options: items,
 *   minSelections: 2,
 *   maxSelections: 4,
 * });
 * ```
 *
 * @example
 * ```ts
 * // With app branding
 * const result = await multiSelect({
 *   title: "Features",
 *   appName: "♪ LAZYGIG",
 *   subtitle: "Settings",
 *   description: "Enable or disable features",
 *   options: features,
 * });
 * ```
 */
export declare function multiSelect<T = string>(options: MultiSelectOptions<T> | MultiSelectConfig<T>): Promise<MultiSelectResult<T>>;
/**
 * Quick multi-select from an array of strings.
 *
 * @param title - Dialog title
 * @param items - Array of string options
 * @param initiallyChecked - Array of initially checked indices
 * @returns Selected strings or empty array if cancelled
 *
 * @example
 * ```ts
 * const selected = await quickMultiSelect(
 *   "Choose toppings",
 *   ["Cheese", "Pepperoni", "Mushrooms", "Olives"],
 *   [0, 1], // Cheese and Pepperoni pre-selected
 * );
 * ```
 */
export declare function quickMultiSelect(title: string, items: string[], initiallyChecked?: number[]): Promise<string[]>;
//# sourceMappingURL=multiselect.d.ts.map