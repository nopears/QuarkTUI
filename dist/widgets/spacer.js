/**
 * QuarkTUI - Spacer Widget
 *
 * Creates empty vertical space (blank lines).
 */
// =============================================================================
// Spacer Widget
// =============================================================================
/**
 * Internal Spacer widget class.
 */
class SpacerWidget {
    options;
    type = "spacer";
    constructor(options = {}) {
        this.options = options;
    }
    render(_ctx) {
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
export function Spacer(lines) {
    return new SpacerWidget({ lines });
}
//# sourceMappingURL=spacer.js.map