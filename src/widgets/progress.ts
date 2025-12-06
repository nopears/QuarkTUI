/**
 * QuarkTUI - ProgressBar Widget
 *
 * A visual progress indicator with customizable appearance.
 * Supports different styles, labels, and color themes.
 */

import { style as applyStyle, visibleLength, repeat } from "../core/style";
import { getCurrentTheme, RESET } from "../core/theme";
import type { Widget, RenderContext, Alignment } from "./types";

// =============================================================================
// Types
// =============================================================================

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

// =============================================================================
// Character Sets
// =============================================================================

const CHAR_SETS: Record<ProgressBarStyle, ProgressBarChars> = {
  block: {
    filled: "█",
    empty: "░",
    left: "",
    right: "",
  },
  line: {
    filled: "━",
    empty: "─",
    left: "╸",
    right: "╺",
  },
  ascii: {
    filled: "=",
    empty: "-",
    left: "[",
    right: "]",
  },
  dots: {
    filled: "●",
    empty: "○",
    left: "",
    right: "",
  },
  gradient: {
    filled: "█",
    empty: "▒",
    left: "▐",
    right: "▌",
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Clamp a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Apply alignment to content within a given width.
 */
function alignContent(
  content: string,
  width: number,
  alignment: Alignment,
): string {
  const contentLen = visibleLength(content);

  if (contentLen >= width) {
    return content;
  }

  const padding = width - contentLen;

  switch (alignment) {
    case "center": {
      const leftPad = Math.floor(padding / 2);
      return " ".repeat(leftPad) + content;
    }
    case "right": {
      return " ".repeat(padding) + content;
    }
    case "left":
    default:
      return content;
  }
}

/**
 * Build the progress bar string.
 */
function buildProgressBar(
  percentage: number,
  barWidth: number,
  chars: ProgressBarChars,
  filledColor: string,
  emptyColor: string,
): string {
  const fillWidth = Math.round((percentage / 100) * barWidth);
  const emptyWidth = barWidth - fillWidth;

  const filledPart = filledColor + repeat(chars.filled, fillWidth) + RESET;
  const emptyPart = emptyColor + repeat(chars.empty, emptyWidth) + RESET;

  return chars.left + filledPart + emptyPart + chars.right;
}

/**
 * Format the label based on options.
 */
function formatLabel(
  percentage: number,
  value: number,
  max: number,
  options: ProgressBarOptions,
): string {
  if (options.label !== undefined) {
    return options.label;
  }

  if (options.showValue) {
    return `${Math.round(value)}/${Math.round(max)}`;
  }

  if (options.showPercentage !== false) {
    return `${Math.round(percentage)}%`;
  }

  return "";
}

// =============================================================================
// ProgressBar Widget
// =============================================================================

/**
 * Internal ProgressBar widget class.
 */
class ProgressBarWidget implements Widget {
  readonly type = "progress" as const;

  constructor(private options: ProgressBarOptions) {}

  render(ctx: RenderContext): string[] {
    const {
      value,
      max = 1,
      width,
      style = "block",
      showPercentage = true,
      labelPosition = "right",
      align = "left",
      filledColor,
      emptyColor,
      chars: customChars,
    } = this.options;

    const theme = getCurrentTheme();

    // Calculate percentage
    const normalizedValue = clamp(value, 0, max);
    const percentage = max > 0 ? (normalizedValue / max) * 100 : 0;

    // Get colors
    const fillColor = filledColor ?? theme.colors.highlight;
    const bgColor = emptyColor ?? theme.colors.textMuted;

    // Get character set and apply custom overrides
    const baseChars = CHAR_SETS[style] ?? CHAR_SETS.block;
    const chars: ProgressBarChars = {
      ...baseChars,
      ...customChars,
    };

    // Format label
    const label = formatLabel(percentage, normalizedValue, max, this.options);
    const labelLen = visibleLength(label);

    // Calculate bar width
    const bracketsWidth = visibleLength(chars.left) + visibleLength(chars.right);
    let barWidth: number;

    if (width) {
      barWidth = width - bracketsWidth;
    } else {
      // Auto-fill available width, accounting for label
      const labelSpace =
        labelPosition === "left" || labelPosition === "right"
          ? labelLen + 1 // +1 for space separator
          : 0;
      barWidth = ctx.innerWidth - bracketsWidth - labelSpace;
    }

    barWidth = Math.max(1, barWidth);

    // Build the bar
    const bar = buildProgressBar(percentage, barWidth, chars, fillColor, bgColor);

    // Build the final output based on label position
    let output: string;

    switch (labelPosition) {
      case "left":
        output = label ? `${label} ${bar}` : bar;
        break;
      case "right":
        output = label ? `${bar} ${label}` : bar;
        break;
      case "inside": {
        // Overlay label in center of bar
        const barOnlyWidth = barWidth + bracketsWidth;
        if (labelLen > 0 && labelLen < barOnlyWidth) {
          const barStr = buildProgressBar(
            percentage,
            barWidth,
            chars,
            fillColor,
            bgColor,
          );
          // For "inside", we just append the label after the bar
          // True overlay would require more complex ANSI manipulation
          output = `${barStr} ${label}`;
        } else {
          output = bar;
        }
        break;
      }
      case "none":
        output = bar;
        break;
      default:
        output = label ? `${bar} ${label}` : bar;
    }

    // Apply alignment
    const alignedOutput = alignContent(output, ctx.innerWidth, align);

    return [alignedOutput];
  }
}

// =============================================================================
// Public Factory Function
// =============================================================================

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
export function ProgressBar(options: ProgressBarOptions): Widget {
  return new ProgressBarWidget(options);
}

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
export function Progress(
  value: number,
  style: ProgressBarStyle = "block",
): Widget {
  return new ProgressBarWidget({ value, style });
}
