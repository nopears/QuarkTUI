/**
 * QuarkTUI - Core Module
 *
 * Central export point for all core functionality.
 * This includes terminal operations, theming, styling, keyboard input, and drawing.
 */
export { clearScreen, clearToEnd, clearLine, hideCursor, showCursor, moveCursor, moveCursorUp, moveCursorDown, moveCursorLeft, moveCursorRight, saveCursorPosition, restoreCursorPosition, getTerminalSize, isTTY, isInputTTY, write, writeLine, bell, enterAlternateScreen, leaveAlternateScreen, type TerminalSize, DEFAULT_WIDTH, DEFAULT_HEIGHT, } from "./terminal";
export { getCurrentTheme, setTheme, onThemeChange, getColors, resetTheme, createTheme, RESET, BOLD, DIM, ITALIC, UNDERLINE, INVERSE, HIDDEN, STRIKETHROUGH, fg, bg, fgRgb, bgRgb, ANSI, ANSI_BG, type Theme, type ThemeColors, } from "./theme";
export { style, raw, stripAnsi, visibleLength, repeat, padRight, padLeft, padCenter, truncate, type StyleType, formatDim, formatBold, formatSuccess, formatError, formatWarning, formatInfo, } from "./style";
export { createKeyboardHandler, waitForKeypress, waitForKeypressCancellable, isBackKey, isConfirmKey, isUpKey, isDownKey, isLeftKey, isRightKey, isHelpKey, getNumberKey, isPrintable, type KeypressEvent, type KeyboardHandler, type KeyboardHandlerOptions, } from "./keyboard";
export { BOX, BOX_SHARP, BOX_DOUBLE, DEFAULT_PADDING_X, DEFAULT_PADDING_Y, DEFAULT_MAX_FRAME_WIDTH, DEFAULT_FRAME_WIDTH_PERCENT, setLayout, getLayout, getPadding, getFrameDimensions, calculateCenteringPadding, calculateHorizontalCentering, calculateFrameWidth, beginCenteredFrame, endCenteredFrame, drawHorizontalPadding, drawVerticalPadding, drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine, drawLine, drawCenteredLine, drawRightAlignedLine, calculateContentHeight, horizontalRule, type LayoutConfig, type FrameDimensions, } from "./drawing";
//# sourceMappingURL=index.d.ts.map