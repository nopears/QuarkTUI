/**
 * QuarkTUI - Types
 *
 * Central export point for all QuarkTUI type definitions.
 */

// Event types
export type {
  KeypressEvent,
  KeyboardHandler,
  KeyboardHandlerOptions,
} from "./events";

// Menu and dialog types
export type {
  MenuOption,
  SelectMenuOptions,
  SelectResult,
  TextInputOptions,
  TextInputResult,
  ConfirmOptions,
  ConfirmResult,
  MessageType,
  MessageOptions,
  SpinnerOptions,
  SpinnerController,
} from "./menu";

// Theme types
export type {
  ThemeColors,
  Theme,
  ThemeProvider,
} from "./theme";
