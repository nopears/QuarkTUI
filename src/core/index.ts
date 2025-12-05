/**
 * QuarkTUI - Core Module
 *
 * Central export point for all core functionality.
 * This includes terminal operations, theming, styling, keyboard input, and drawing.
 */

// =============================================================================
// Terminal Operations
// =============================================================================

export {
  // Screen control
  clearScreen,
  clearToEnd,
  clearLine,
  // Cursor control
  hideCursor,
  showCursor,
  moveCursor,
  moveCursorUp,
  moveCursorDown,
  moveCursorLeft,
  moveCursorRight,
  saveCursorPosition,
  restoreCursorPosition,
  // Terminal info
  getTerminalSize,
  isTTY,
  isInputTTY,
  // Output
  write,
  writeLine,
  bell,
  // Alternate screen
  enterAlternateScreen,
  leaveAlternateScreen,
  // Types
  type TerminalSize,
  // Constants
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
} from "./terminal";

// =============================================================================
// Theme System
// =============================================================================

export {
  // Theme management
  getCurrentTheme,
  setTheme,
  onThemeChange,
  getColors,
  resetTheme,
  createTheme,
  // ANSI codes
  RESET,
  BOLD,
  DIM,
  ITALIC,
  UNDERLINE,
  INVERSE,
  HIDDEN,
  STRIKETHROUGH,
  // Color helpers
  fg,
  bg,
  fgRgb,
  bgRgb,
  ANSI,
  ANSI_BG,
  // Types
  type Theme,
  type ThemeColors,
} from "./theme";

// =============================================================================
// Text Styling
// =============================================================================

export {
  // Main styling function
  style,
  raw,
  // String utilities
  stripAnsi,
  visibleLength,
  repeat,
  padRight,
  padLeft,
  padCenter,
  truncate,
  // Types
  type StyleType,
  // Deprecated (for backward compatibility)
  formatDim,
  formatBold,
  formatSuccess,
  formatError,
  formatWarning,
  formatInfo,
} from "./style";

// =============================================================================
// Keyboard Input
// =============================================================================

export {
  // Handler creation
  createKeyboardHandler,
  // Single keypress utilities
  waitForKeypress,
  waitForKeypressCancellable,
  // Key detection
  isBackKey,
  isConfirmKey,
  isUpKey,
  isDownKey,
  isLeftKey,
  isRightKey,
  isHelpKey,
  getNumberKey,
  isPrintable,
  // Types
  type KeypressEvent,
  type KeyboardHandler,
  type KeyboardHandlerOptions,
} from "./keyboard";

// =============================================================================
// Drawing Primitives
// =============================================================================

export {
  // Box characters
  BOX,
  BOX_SHARP,
  BOX_DOUBLE,
  // Layout configuration
  DEFAULT_PADDING_X,
  DEFAULT_PADDING_Y,
  setLayout,
  getLayout,
  getPadding,
  // Frame dimensions
  getFrameDimensions,
  // Drawing functions
  drawHorizontalPadding,
  drawVerticalPadding,
  drawTopBorder,
  drawBottomBorder,
  drawDivider,
  drawEmptyLine,
  drawLine,
  drawCenteredLine,
  drawRightAlignedLine,
  // Utilities
  calculateContentHeight,
  horizontalRule,
  // Types
  type LayoutConfig,
  type FrameDimensions,
} from "./drawing";
