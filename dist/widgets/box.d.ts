/**
 * QuarkTUI - Box/Panel Widget
 *
 * A container widget that wraps content in a bordered box.
 * Supports various border styles, titles, footers, and customizable padding.
 */
import { type StyleType } from "../core/style";
import type { Widget, Alignment } from "./types";
/** Box border style */
export type BoxStyle = "rounded" | "sharp" | "double" | "thick" | "dashed" | "ascii" | "none";
/** Box title/label position */
export type TitlePosition = "left" | "center" | "right";
/** Options for the Box widget */
export interface BoxOptions {
    /** Content inside the box (strings, widgets, or mixed array) */
    content: string | Widget | (string | Widget)[];
    /** Border style */
    style?: BoxStyle;
    /** Title displayed in the top border */
    title?: string;
    /** Position of the title */
    titleAlign?: TitlePosition;
    /** Style(s) for the title */
    titleStyle?: StyleType | StyleType[];
    /** Footer displayed in the bottom border */
    footer?: string;
    /** Position of the footer */
    footerAlign?: TitlePosition;
    /** Style(s) for the footer */
    footerStyle?: StyleType | StyleType[];
    /** Horizontal padding inside the box (default: 1) */
    paddingX?: number;
    /** Vertical padding inside the box (default: 0) */
    paddingY?: number;
    /** Style(s) for the border */
    borderStyle?: StyleType | StyleType[];
    /** Fixed width for the box (default: auto-fit content) */
    width?: number;
    /** Minimum width for the box */
    minWidth?: number;
    /** Maximum width for the box */
    maxWidth?: number;
    /** Horizontal alignment of content inside the box */
    contentAlign?: Alignment;
    /** Horizontal alignment of the box itself */
    align?: Alignment;
}
/**
 * Create a Box widget.
 *
 * @param optionsOrContent - Box configuration or content
 * @returns A Box widget
 *
 * @example
 * // Simple box with string content
 * Box("Hello, World!")
 *
 * @example
 * // Box with title
 * Box({
 *   content: "This is the content",
 *   title: "My Box",
 * })
 *
 * @example
 * // Box with title and footer
 * Box({
 *   content: ["Line 1", "Line 2", "Line 3"],
 *   title: "Information",
 *   footer: "Press Enter to continue",
 *   style: "double",
 * })
 *
 * @example
 * // Styled box with custom padding
 * Box({
 *   content: "Important message!",
 *   title: "Warning",
 *   titleStyle: "warning",
 *   borderStyle: "warning",
 *   paddingX: 2,
 *   paddingY: 1,
 * })
 *
 * @example
 * // Centered box with fixed width
 * Box({
 *   content: "Centered content",
 *   width: 40,
 *   align: "center",
 *   contentAlign: "center",
 * })
 *
 * @example
 * // Box with nested widgets
 * Box({
 *   content: [
 *     Text("Header", { style: "bold" }),
 *     Divider(),
 *     BulletList(["Item 1", "Item 2"]),
 *   ],
 *   title: "Widget Box",
 * })
 *
 * @example
 * // ASCII style for compatibility
 * Box({
 *   content: "Plain text",
 *   style: "ascii",
 * })
 */
export declare function Box(optionsOrContent: BoxOptions | string | Widget | (string | Widget)[]): Widget;
/**
 * Create a Panel widget (alias for Box with default styling).
 *
 * @param title - Panel title
 * @param content - Panel content
 * @param options - Additional options
 * @returns A Box widget styled as a panel
 *
 * @example
 * Panel("Settings", "Configure your options here")
 *
 * @example
 * Panel("User Info", [
 *   KeyValue("Name:", "John Doe"),
 *   KeyValue("Email:", "john@example.com"),
 * ])
 *
 * @example
 * Panel("Status", "All systems operational", {
 *   borderStyle: "success",
 *   titleStyle: "success",
 * })
 */
export declare function Panel(title: string, content: string | Widget | (string | Widget)[], options?: Partial<Omit<BoxOptions, "title" | "content">>): Widget;
/**
 * Create an info box with info styling.
 *
 * @param content - Box content
 * @param title - Optional title (default: "Info")
 * @returns A styled info box
 *
 * @example
 * InfoBox("This is helpful information.")
 * InfoBox("Custom titled info", "Note")
 */
export declare function InfoBox(content: string | Widget | (string | Widget)[], title?: string): Widget;
/**
 * Create a warning box with warning styling.
 *
 * @param content - Box content
 * @param title - Optional title (default: "Warning")
 * @returns A styled warning box
 *
 * @example
 * WarningBox("Please proceed with caution.")
 */
export declare function WarningBox(content: string | Widget | (string | Widget)[], title?: string): Widget;
/**
 * Create an error box with error styling.
 *
 * @param content - Box content
 * @param title - Optional title (default: "Error")
 * @returns A styled error box
 *
 * @example
 * ErrorBox("Something went wrong!")
 */
export declare function ErrorBox(content: string | Widget | (string | Widget)[], title?: string): Widget;
/**
 * Create a success box with success styling.
 *
 * @param content - Box content
 * @param title - Optional title (default: "Success")
 * @returns A styled success box
 *
 * @example
 * SuccessBox("Operation completed successfully!")
 */
export declare function SuccessBox(content: string | Widget | (string | Widget)[], title?: string): Widget;
//# sourceMappingURL=box.d.ts.map