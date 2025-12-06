/**
 * QuarkTUI - List Widget
 *
 * A versatile list widget for displaying items with various marker styles.
 * Supports bullet points, numbered lists, checkboxes, and scrollable lists
 * with selection highlighting.
 */

import {
  style as applyStyle,
  visibleLength,
  type StyleType,
} from "../core/style";
import { getCurrentTheme, RESET } from "../core/theme";
import type { Widget, RenderContext, Alignment } from "./types";

// =============================================================================
// Types
// =============================================================================

/** List marker/bullet style */
export type ListStyle =
  | "bullet"
  | "numbered"
  | "dash"
  | "arrow"
  | "check"
  | "checkbox"
  | "none";

/** A list item can be a plain string or a styled item object */
export type ListItem =
  | string
  | {
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

// =============================================================================
// Marker Definitions
// =============================================================================

const MARKERS: Record<ListStyle, string> = {
  bullet: "•",
  numbered: "", // Handled specially
  dash: "-",
  arrow: "›",
  check: "✓",
  checkbox: "☐",
  none: "",
};

const CHECKBOX_CHECKED = "☑";
const CHECKBOX_UNCHECKED = "☐";

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get text content from a list item.
 */
function getItemText(item: ListItem): string {
  if (typeof item === "string") {
    return item;
  }
  return item.text;
}

/**
 * Get style from a list item.
 */
function getItemStyle(item: ListItem): StyleType | StyleType[] | undefined {
  if (typeof item === "string") {
    return undefined;
  }
  return item.style;
}

/**
 * Get checked state from a list item.
 */
function getItemChecked(item: ListItem): boolean {
  if (typeof item === "string") {
    return false;
  }
  return item.checked ?? false;
}

/**
 * Get custom marker from a list item.
 */
function getItemMarker(item: ListItem): string | undefined {
  if (typeof item === "string") {
    return undefined;
  }
  return item.marker;
}

/**
 * Apply styles to text.
 */
function styleText(text: string, styles?: StyleType | StyleType[]): string {
  if (!styles) {
    return text;
  }

  if (Array.isArray(styles)) {
    return applyStyle(text, ...styles);
  }

  return applyStyle(text, styles);
}

/**
 * Get the marker for a specific item.
 */
function getMarker(
  item: ListItem,
  index: number,
  listStyle: ListStyle,
  startNumber: number,
): string {
  // Check for custom marker on the item
  const customMarker = getItemMarker(item);
  if (customMarker !== undefined) {
    return customMarker;
  }

  // Handle checkbox style specially
  if (listStyle === "checkbox") {
    return getItemChecked(item) ? CHECKBOX_CHECKED : CHECKBOX_UNCHECKED;
  }

  // Handle numbered style
  if (listStyle === "numbered") {
    return `${startNumber + index}.`;
  }

  // Return the standard marker
  return MARKERS[listStyle] ?? "";
}

/**
 * Calculate the maximum marker width for alignment.
 */
function calculateMarkerWidth(
  items: ListItem[],
  listStyle: ListStyle,
  startNumber: number,
): number {
  if (listStyle === "none") {
    return 0;
  }

  if (listStyle === "numbered") {
    // Calculate width of the largest number
    const maxNum = startNumber + items.length - 1;
    return `${maxNum}.`.length;
  }

  // For other styles, check all items for custom markers
  let maxWidth = visibleLength(MARKERS[listStyle] ?? "");

  for (const item of items) {
    const customMarker = getItemMarker(item);
    if (customMarker !== undefined) {
      maxWidth = Math.max(maxWidth, visibleLength(customMarker));
    }
  }

  return maxWidth;
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
 * Pad a marker to a consistent width.
 */
function padMarker(marker: string, width: number): string {
  const markerLen = visibleLength(marker);
  if (markerLen >= width) {
    return marker;
  }
  // Right-align markers (numbers look better this way)
  return " ".repeat(width - markerLen) + marker;
}

// =============================================================================
// List Widget
// =============================================================================

/**
 * Internal List widget class.
 */
class ListWidget implements Widget {
  readonly type = "list" as const;

  constructor(private options: ListOptions) {}

  render(ctx: RenderContext): string[] {
    const {
      items,
      style: listStyle = "bullet",
      align = "left",
      indent = 0,
      gap = 1,
      selectedIndex,
      selectedMarker = "❯",
      selectedStyle = ["bold"],
      maxVisible,
      scrollOffset = 0,
      showScrollIndicators = true,
      scrollUpIndicator = "↑ more...",
      scrollDownIndicator = "↓ more...",
      startNumber = 1,
    } = this.options;

    const theme = getCurrentTheme();
    const lines: string[] = [];

    if (items.length === 0) {
      return lines;
    }

    // Calculate marker width for alignment
    const markerWidth = calculateMarkerWidth(items, listStyle, startNumber);
    const gapStr = " ".repeat(gap);
    const indentStr = " ".repeat(indent);

    // Determine visible range
    let startIdx = 0;
    let endIdx = items.length;

    if (maxVisible !== undefined && maxVisible < items.length) {
      startIdx = Math.max(0, Math.min(scrollOffset, items.length - maxVisible));
      endIdx = Math.min(items.length, startIdx + maxVisible);
    }

    const hasMoreAbove = startIdx > 0;
    const hasMoreBelow = endIdx < items.length;

    // Adjust visible range if we need space for scroll indicators
    let visibleCount = endIdx - startIdx;
    if (showScrollIndicators) {
      if (hasMoreAbove && maxVisible !== undefined) {
        visibleCount = Math.min(visibleCount, maxVisible - 1);
        endIdx = startIdx + visibleCount;
      }
      if (hasMoreBelow && maxVisible !== undefined) {
        visibleCount = Math.min(visibleCount, maxVisible - (hasMoreAbove ? 1 : 0) - 1);
        endIdx = startIdx + visibleCount;
      }
    }

    // Recalculate after adjustment
    const actualHasMoreBelow = endIdx < items.length;

    // Show scroll up indicator
    if (showScrollIndicators && hasMoreAbove) {
      const indicator = `${indentStr}${" ".repeat(markerWidth)}${gapStr}${theme.colors.textMuted}${scrollUpIndicator}${RESET}`;
      lines.push(alignContent(indicator, ctx.innerWidth, align));
    }

    // Render visible items
    for (let i = startIdx; i < endIdx; i++) {
      const item = items[i];
      if (!item) continue;

      const isSelected = selectedIndex !== undefined && i === selectedIndex;

      // Get marker
      let marker: string;
      if (isSelected && selectedMarker) {
        marker = selectedMarker;
      } else {
        marker = getMarker(item, i, listStyle, startNumber);
      }

      // Pad marker for alignment
      const paddedMarker = listStyle === "none" && !isSelected
        ? ""
        : padMarker(marker, Math.max(markerWidth, visibleLength(selectedMarker)));

      // Get item text and style
      const itemText = getItemText(item);
      let itemStyle = getItemStyle(item);

      // Apply selected style if selected
      if (isSelected) {
        itemStyle = selectedStyle;
      }

      // Build the line
      const styledMarker = isSelected
        ? `${theme.colors.highlight}${paddedMarker}${RESET}`
        : `${theme.colors.textMuted}${paddedMarker}${RESET}`;

      const styledText = styleText(itemText, itemStyle);

      let line: string;
      if (listStyle === "none" && !isSelected) {
        line = `${indentStr}${styledText}`;
      } else {
        line = `${indentStr}${styledMarker}${gapStr}${styledText}`;
      }

      lines.push(alignContent(line, ctx.innerWidth, align));
    }

    // Show scroll down indicator
    if (showScrollIndicators && actualHasMoreBelow) {
      const indicator = `${indentStr}${" ".repeat(markerWidth)}${gapStr}${theme.colors.textMuted}${scrollDownIndicator}${RESET}`;
      lines.push(alignContent(indicator, ctx.innerWidth, align));
    }

    return lines;
  }
}

// =============================================================================
// Public Factory Functions
// =============================================================================

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
export function List(optionsOrItems: ListOptions | ListItem[]): Widget {
  if (Array.isArray(optionsOrItems)) {
    return new ListWidget({ items: optionsOrItems });
  }
  return new ListWidget(optionsOrItems);
}

/**
 * Create a bullet list (shorthand).
 *
 * @param items - Array of items
 * @returns A List widget with bullet style
 *
 * @example
 * BulletList(["Item 1", "Item 2", "Item 3"])
 */
export function BulletList(items: ListItem[]): Widget {
  return new ListWidget({ items, style: "bullet" });
}

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
export function NumberedList(items: ListItem[], startNumber = 1): Widget {
  return new ListWidget({ items, style: "numbered", startNumber });
}

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
export function CheckboxList(items: ListItem[]): Widget {
  return new ListWidget({ items, style: "checkbox" });
}
