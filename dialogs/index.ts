/**
 * QuarkTUI - Dialogs Module
 *
 * Central export point for all dialog components.
 * Includes select menus, text input, confirmations, messages, spinners, and help.
 */

// =============================================================================
// Select Menu
// =============================================================================

export {
  selectMenu,
  type SelectMenuConfig,
} from "./select";

export type {
  MenuOption,
  SelectMenuOptions,
  SelectResult,
} from "./select";

// =============================================================================
// Text Input
// =============================================================================

export {
  textInput,
  passwordInput,
  type TextInputConfig,
} from "./input";

export type {
  TextInputOptions,
  TextInputResult,
} from "./input";

// =============================================================================
// Confirm Dialog
// =============================================================================

export {
  confirm,
  confirmYesNo,
  type ConfirmConfig,
} from "./confirm";

export type {
  ConfirmOptions,
  ConfirmResult,
} from "./confirm";

// =============================================================================
// Message Dialog
// =============================================================================

export {
  showMessage,
  showMessageAndWait,
  message,
  info,
  success,
  warning,
  error,
  type MessageConfig,
} from "./message";

export type {
  MessageType,
  MessageOptions,
} from "./message";

// =============================================================================
// Spinner
// =============================================================================

export {
  showSpinner,
  withSpinner,
  // Spinner frame presets
  SPINNER_DOTS,
  SPINNER_LINE,
  SPINNER_ARC,
  SPINNER_CIRCLE,
  SPINNER_BOX,
  SPINNER_BOUNCE,
  SPINNER_BAR,
  type SpinnerConfig,
} from "./spinner";

export type {
  SpinnerOptions,
  SpinnerController,
} from "./spinner";

// =============================================================================
// Help System
// =============================================================================

export {
  showHelp,
  isHelpKey,
  mergeHelpContent,
  createSimpleHelp,
} from "./help";

export type {
  KeyBinding,
  HelpSection,
  HelpContent,
} from "./help";
