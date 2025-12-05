/**
 * QuarkTUI - Spacer Widget
 *
 * Creates empty vertical space (blank lines).
 */

import type { Widget, RenderContext, SpacerOptions } from "./types";

// =============================================================================
// Spacer Widget
// =============================================================================

/**
 * Internal Spacer widget class.
 */
class SpacerWidget implements Widget {
  readonly type = "spacer" as const;

  constructor(private options: SpacerOptions = {}) {}

  render(_ctx: RenderContext): string[] {
    const { lines = 1 } = this.options;

    // Return an array of empty strings
    return Array(lines).fill("");
  }
}

// =============================================================================
// Public Factory Function
// =============================================================================

/**
 * Create a Spacer widget.
 *
 * @param lines - Number of empty lines (default: 1)
 * @returns A Spacer widget
 *
 * @example
 * // Single empty line
 * Spacer()
 *
 * @example
 * // Multiple empty lines
 * Spacer(3)
 */
export function Spacer(lines?: number): Widget {
  return new SpacerWidget({ lines });
}
