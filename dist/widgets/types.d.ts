/**
 * QuarkTUI - Widget Types
 *
 * Core type definitions for the widget system.
 */
import type { StyleType } from "../core/style";
/**
 * Context passed to widgets during rendering.
 * Contains information about the available space.
 */
export interface RenderContext {
    /** Width inside borders (excluding border characters) */
    innerWidth: number;
    /** Available lines for content area */
    contentHeight: number;
}
/** Supported widget types */
export type WidgetType = "text" | "spacer" | "row" | "table" | "progress" | "list" | "divider" | "columns";
/**
 * Base interface for all widgets.
 * Each widget knows how to render itself to string lines.
 */
export interface Widget {
    /** Type identifier for the widget */
    readonly type: WidgetType;
    /**
     * Render the widget to an array of strings.
     * Each string represents one line of output.
     */
    render(ctx: RenderContext): string[];
}
/** Horizontal alignment options */
export type Alignment = "left" | "center" | "right";
/** Options for the Text widget */
export interface TextOptions {
    /** Horizontal alignment within the available width */
    align?: Alignment;
    /** Style(s) to apply to the text */
    style?: StyleType | StyleType[];
}
/** Options for the Row widget */
export interface RowOptions {
    /** Number of spaces between items (default: 1) */
    gap?: number;
    /** Horizontal alignment of the entire row */
    align?: Alignment;
}
/** Options for the Spacer widget */
export interface SpacerOptions {
    /** Number of empty lines (default: 1) */
    lines?: number;
}
//# sourceMappingURL=types.d.ts.map