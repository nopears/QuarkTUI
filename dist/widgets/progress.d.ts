/**
 * QuarkTUI - ProgressBar Widget
 *
 * A visual progress indicator with customizable appearance.
 * Supports different styles, labels, and color themes.
 */
import type { Widget, Alignment } from "./types";
/** Progress bar visual style */
export type ProgressBarStyle = "block" | "line" | "ascii" | "dots" | "gradient";
/** Progress bar character set */
interface ProgressBarChars {
    filled: string;
    empty: string;
    left: string;
    right: string;
}
/** Options for the ProgressBar widget */
export interface ProgressBarOptions {
    /** Progress value from 0 to 1 (or 0 to max if max is specified) */
    value: number;
    /** Maximum value (default: 1) */
    max?: number;
    /** Width of the progress bar in characters (default: auto-fill available width) */
    width?: number;
    /** Visual style of the progress bar */
    style?: ProgressBarStyle;
    /** Show percentage label (default: true) */
    showPercentage?: boolean;
    /** Show value label (e.g., "50/100") */
    showValue?: boolean;
    /** Custom label to display (overrides percentage/value) */
    label?: string;
    /** Label position relative to bar */
    labelPosition?: "left" | "right" | "inside" | "none";
    /** Horizontal alignment of the entire widget */
    align?: Alignment;
    /** Color for the filled portion (uses theme highlight by default) */
    filledColor?: string;
    /** Color for the empty portion (uses theme muted by default) */
    emptyColor?: string;
    /** Custom characters for the progress bar */
    chars?: Partial<ProgressBarChars>;
}
/**
 * Create a ProgressBar widget.
 *
 * @param options - Progress bar configuration
 * @returns A ProgressBar widget
 *
 * @example
 * // Simple progress bar (50%)
 * ProgressBar({ value: 0.5 })
 *
 * @example
 * // Progress bar with custom max and value display
 * ProgressBar({ value: 50, max: 100, showValue: true })
 *
 * @example
 * // Styled progress bar with custom width
 * ProgressBar({
 *   value: 0.75,
 *   width: 30,
 *   style: "line",
 *   showPercentage: true,
 * })
 *
 * @example
 * // ASCII style with label on left
 * ProgressBar({
 *   value: 3,
 *   max: 10,
 *   style: "ascii",
 *   labelPosition: "left",
 *   showValue: true,
 * })
 *
 * @example
 * // Custom characters
 * ProgressBar({
 *   value: 0.6,
 *   chars: { filled: "▓", empty: "░", left: "[", right: "]" },
 * })
 *
 * @example
 * // Centered progress bar with custom label
 * ProgressBar({
 *   value: 0.33,
 *   align: "center",
 *   label: "Loading...",
 *   width: 40,
 * })
 */
export declare function ProgressBar(options: ProgressBarOptions): Widget;
/**
 * Create a simple progress bar with just a value.
 * Convenience wrapper for common use case.
 *
 * @param value - Progress value from 0 to 1
 * @param style - Optional visual style
 * @returns A ProgressBar widget
 *
 * @example
 * Progress(0.5)
 * Progress(0.75, "line")
 */
export declare function Progress(value: number, style?: ProgressBarStyle): Widget;
export {};
//# sourceMappingURL=progress.d.ts.map