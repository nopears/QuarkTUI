/**
 * QuarkTUI - Menu and Dialog Types
 *
 * Type definitions for menus, dialogs, and user input components.
 */

// =============================================================================
// Menu Types
// =============================================================================

/**
 * A single option in a menu.
 */
export interface MenuOption<T = string> {
  /** Display label for the option */
  label: string;
  /** Value returned when this option is selected */
  value: T;
  /** Optional hint text displayed next to the label */
  hint?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

/**
 * Options for configuring a select menu.
 */
export interface SelectMenuOptions<T = string> {
  /** Title displayed at the top of the menu */
  title: string;
  /** List of selectable options */
  options: MenuOption<T>[];
  /** Index of initially selected option (default: 0) */
  selectedIndex?: number;
  /** Optional info lines displayed below the title */
  infoLines?: string[];
  /** Whether to show option numbers for quick selection */
  showNumbers?: boolean;
}

/**
 * Result of a select menu interaction.
 */
export type SelectResult<T = string> =
  | { type: "selected"; value: T }
  | { type: "cancelled" };

// =============================================================================
// Text Input Types
// =============================================================================

/**
 * Options for configuring a text input dialog.
 */
export interface TextInputOptions {
  /** Title/prompt displayed above the input */
  title: string;
  /** Placeholder text shown when input is empty */
  placeholder?: string;
  /** Initial value for the input */
  initialValue?: string;
  /** Validation function - returns error message or null if valid */
  validate?: (value: string) => string | null;
  /** Optional info lines displayed below the title */
  infoLines?: string[];
  /** Maximum length of input */
  maxLength?: number;
}

/**
 * Result of a text input interaction.
 */
export type TextInputResult =
  | { type: "submitted"; value: string }
  | { type: "cancelled" };

// =============================================================================
// Confirm Dialog Types
// =============================================================================

/**
 * Options for configuring a confirmation dialog.
 */
export interface ConfirmOptions {
  /** Question or prompt to display */
  title: string;
  /** Optional detailed message */
  message?: string;
  /** Label for confirm button (default: "Yes") */
  confirmLabel?: string;
  /** Label for cancel button (default: "No") */
  cancelLabel?: string;
  /** Whether confirm is the default selection (default: false) */
  defaultConfirm?: boolean;
}

/**
 * Result of a confirmation dialog.
 */
export type ConfirmResult = { type: "confirmed" } | { type: "cancelled" };

// =============================================================================
// Message Dialog Types
// =============================================================================

/**
 * Type of message to display.
 */
export type MessageType = "info" | "success" | "warning" | "error";

/**
 * Options for configuring a message dialog.
 */
export interface MessageOptions {
  /** Title of the message */
  title: string;
  /** Lines of text to display */
  lines: string[];
  /** Type of message (affects icon and color) */
  type?: MessageType;
  /** Whether to wait for user input before closing */
  waitForKey?: boolean;
}

// =============================================================================
// Spinner Types
// =============================================================================

/**
 * Options for configuring a spinner/loading indicator.
 */
export interface SpinnerOptions {
  /** Message to display next to the spinner */
  message: string;
  /** Custom spinner frames (default: braille dots) */
  frames?: string[];
  /** Frame update interval in ms (default: 80) */
  interval?: number;
}

/**
 * Controller for an active spinner.
 */
export interface SpinnerController {
  /** Update the spinner message */
  update: (message: string) => void;
  /** Stop the spinner with an optional final message */
  stop: (finalMessage?: string) => void;
}
