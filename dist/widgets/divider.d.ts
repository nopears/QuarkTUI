/**
 * QuarkTUI - Divider Widget
 *
 * A horizontal divider/separator widget with various styles and optional labels.
 * Useful for visually separating sections of content.
 */
import { type StyleType } from "../core/style";
import type { Widget, Alignment } from "./types";
/** Divider line style */
export type DividerStyle = "line" | "double" | "thick" | "dashed" | "dotted" | "space";
/** Options for the Divider widget */
export interface DividerOptions {
    /** Visual style of the divider line */
    style?: DividerStyle;
    /** Optional label text to display in the divider */
    label?: string;
    /** Position of the label */
    labelAlign?: Alignment;
    /** Style(s) to apply to the label */
    labelStyle?: StyleType | StyleType[];
    /** Style(s) to apply to the line */
    lineStyle?: StyleType | StyleType[];
    /** Padding around the label (default: 1) */
    labelPadding?: number;
    /** Custom character for the line */
    char?: string;
    /** Width of the divider (default: full width) */
    width?: number;
    /** Horizontal alignment of the divider */
    align?: Alignment;
    /** Left/right margin from edges (default: 0) */
    margin?: number;
}
/**
 * Create a Divider widget.
 *
 * @param optionsOrLabel - Divider configuration or just a label string
 * @returns A Divider widget
 *
 * @example
 * // Simple horizontal line
 * Divider()
 *
 * @example
 * // Divider with centered label
 * Divider("Section Title")
 *
 * @example
 * // Divider with custom style
 * Divider({
 *   style: "double",
 *   label: "Important",
 *   labelStyle: "bold",
 * })
 *
 * @example
 * // Dashed divider with left-aligned label
 * Divider({
 *   style: "dashed",
 *   label: "Options",
 *   labelAlign: "left",
 *   labelStyle: ["bold", "warning"],
 * })
 *
 * @example
 * // Custom character divider
 * Divider({ char: "·", lineStyle: "dim" })
 *
 * @example
 * // Divider with margin
 * Divider({ margin: 4, style: "thick" })
 */
export declare function Divider(optionsOrLabel?: DividerOptions | string): Widget;
/**
 * Create a simple horizontal rule (shorthand).
 *
 * @param style - Optional divider style
 * @returns A Divider widget
 *
 * @example
 * HR()           // Simple line
 * HR("double")   // Double line
 * HR("dashed")   // Dashed line
 */
export declare function HR(style?: DividerStyle): Widget;
//# sourceMappingURL=divider.d.ts.map