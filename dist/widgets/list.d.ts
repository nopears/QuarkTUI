/**
 * QuarkTUI - List Widget
 *
 * A versatile list widget for displaying items with various marker styles.
 * Supports bullet points, numbered lists, checkboxes, and scrollable lists
 * with selection highlighting.
 */
import { type StyleType } from "../core/style";
import type { Widget, Alignment } from "./types";
/** List marker/bullet style */
export type ListStyle = "bullet" | "numbered" | "dash" | "arrow" | "check" | "checkbox" | "none";
/** A list item can be a plain string or a styled item object */
export type ListItem = string | {
    /** Text content of the item */
    text: string;
    /** Style(s) to apply to the text */
    style?: StyleType | StyleType[];
    /** For checkbox style: whether the item is checked */
    checked?: boolean;
    /** Custom marker for this item (overrides list style) */
    marker?: string;
};
/** Options for the List widget */
export interface ListOptions {
    /** Array of items to display */
    items: ListItem[];
    /** Marker style for the list */
    style?: ListStyle;
    /** Horizontal alignment of the entire list */
    align?: Alignment;
    /** Indentation in spaces before the marker (default: 0) */
    indent?: number;
    /** Gap between marker and text (default: 1) */
    gap?: number;
    /** Index of the selected/highlighted item (optional) */
    selectedIndex?: number;
    /** Style for the selected item marker */
    selectedMarker?: string;
    /** Style for the selected item text */
    selectedStyle?: StyleType | StyleType[];
    /** Maximum number of visible items (enables scrolling) */
    maxVisible?: number;
    /** Current scroll offset (used with maxVisible) */
    scrollOffset?: number;
    /** Show scroll indicators when content is clipped */
    showScrollIndicators?: boolean;
    /** Custom scroll indicator for "more above" */
    scrollUpIndicator?: string;
    /** Custom scroll indicator for "more below" */
    scrollDownIndicator?: string;
    /** Starting number for numbered lists (default: 1) */
    startNumber?: number;
}
/**
 * Create a List widget.
 *
 * @param optionsOrItems - List configuration or array of items
 * @returns A List widget
 *
 * @example
 * // Simple bullet list from array
 * List(["Item 1", "Item 2", "Item 3"])
 *
 * @example
 * // Numbered list
 * List({
 *   items: ["First", "Second", "Third"],
 *   style: "numbered",
 * })
 *
 * @example
 * // Checkbox list with checked items
 * List({
 *   items: [
 *     { text: "Complete task", checked: true },
 *     { text: "Pending task", checked: false },
 *     { text: "Another task" },
 *   ],
 *   style: "checkbox",
 * })
 *
 * @example
 * // Styled items with different colors
 * List({
 *   items: [
 *     { text: "Success!", style: "success" },
 *     { text: "Warning!", style: "warning" },
 *     { text: "Error!", style: "error" },
 *   ],
 *   style: "arrow",
 * })
 *
 * @example
 * // Scrollable list with selection
 * List({
 *   items: longArray,
 *   selectedIndex: 2,
 *   maxVisible: 5,
 *   scrollOffset: 0,
 * })
 *
 * @example
 * // Indented list with custom gap
 * List({
 *   items: ["Indented item 1", "Indented item 2"],
 *   style: "dash",
 *   indent: 4,
 *   gap: 2,
 * })
 */
export declare function List(optionsOrItems: ListOptions | ListItem[]): Widget;
/**
 * Create a bullet list (shorthand).
 *
 * @param items - Array of items
 * @returns A List widget with bullet style
 *
 * @example
 * BulletList(["Item 1", "Item 2", "Item 3"])
 */
export declare function BulletList(items: ListItem[]): Widget;
/**
 * Create a numbered list (shorthand).
 *
 * @param items - Array of items
 * @param startNumber - Starting number (default: 1)
 * @returns A List widget with numbered style
 *
 * @example
 * NumberedList(["First", "Second", "Third"])
 * NumberedList(["Item A", "Item B"], 5) // Starts at 5
 */
export declare function NumberedList(items: ListItem[], startNumber?: number): Widget;
/**
 * Create a checkbox list (shorthand).
 *
 * @param items - Array of items (use objects with `checked: true` for checked items)
 * @returns A List widget with checkbox style
 *
 * @example
 * CheckboxList([
 *   { text: "Done", checked: true },
 *   { text: "Pending" },
 * ])
 */
export declare function CheckboxList(items: ListItem[]): Widget;
//# sourceMappingURL=list.d.ts.map