/**
 * QuarkTUI - A lightweight TUI component framework
 *
 * QuarkTUI provides a structured way to build terminal user interfaces
 * using components, services, widgets, and dialogs.
 *
 * @example
 * ```typescript
 * import {
 *   Component,
 *   Text,
 *   Spacer,
 *   Row,
 *   selectMenu,
 *   showSpinner,
 *   pickFile,
 * } from "./quarktui";
 *
 * // Use dialogs directly
 * const result = await selectMenu({
 *   title: "Choose an option",
 *   options: [
 *     { label: "Option 1", value: "opt1" },
 *     { label: "Option 2", value: "opt2" },
 *   ],
 * });
 *
 * // Or build components
 * class MyComponent extends Component<MyService> {
 *   readonly config = {
 *     title: "My App",
 *     hints: ["Space Action", "q/⌫ Back"],
 *   };
 *
 *   render(ctx: RenderContext): Widget[] {
 *     return [
 *       Text("Hello!", { align: "center", style: "bold" }),
 *       Spacer(),
 *       Row([Text("Status:"), Text("Ready", { style: "success" })]),
 *     ];
 *   }
 * }
 * ```
 */
// =============================================================================
// Component System
// =============================================================================
export { Component } from "./component";
// =============================================================================
// Widgets
// =============================================================================
export { 
// Primitives
Text, Spacer, Row, Table, ProgressBar, Progress, List, BulletList, NumberedList, CheckboxList, } from "./widgets";
// Renderer
export { render, renderFitted } from "./renderer";
// =============================================================================
// Core - Terminal Operations
// =============================================================================
export { 
// Render buffering
beginRender, flushRender, cancelRender, isRenderBuffering, bufferWrite, bufferWriteLine, 
// Screen control
clearScreen, clearToEnd, clearLine, 
// Cursor control
hideCursor, showCursor, moveCursor, moveCursorUp, moveCursorDown, moveCursorLeft, moveCursorRight, saveCursorPosition, restoreCursorPosition, 
// Terminal info
getTerminalSize, isTTY, isInputTTY, 
// Output
write, writeLine, bell, 
// Alternate screen
enterAlternateScreen, leaveAlternateScreen, 
// Constants
DEFAULT_WIDTH, DEFAULT_HEIGHT, } from "./core";
// =============================================================================
// Core - Theme System
// =============================================================================
export { 
// Theme management
getCurrentTheme, setTheme, onThemeChange, getColors, resetTheme, createTheme, 
// ANSI codes
RESET, BOLD, DIM, ITALIC, UNDERLINE, INVERSE, HIDDEN, STRIKETHROUGH, 
// Color helpers
fg, bg, fgRgb, bgRgb, ANSI, ANSI_BG, } from "./core";
// =============================================================================
// Core - Text Styling
// =============================================================================
export { 
// Main styling function
style, raw, 
// String utilities
stripAnsi, visibleLength, repeat, padRight, padLeft, padCenter, truncate, 
// Deprecated (for backward compatibility)
formatDim, formatBold, formatSuccess, formatError, formatWarning, formatInfo, } from "./core";
// =============================================================================
// Core - Keyboard Input
// =============================================================================
export { 
// Handler creation
createKeyboardHandler, 
// Single keypress utilities
waitForKeypress, waitForKeypressCancellable, 
// Key detection
isBackKey, isConfirmKey, isUpKey, isDownKey, isLeftKey, isRightKey, isHelpKey, getNumberKey, isPrintable, } from "./core";
// =============================================================================
// Core - Drawing Primitives
// =============================================================================
export { 
// Box characters
BOX, BOX_SHARP, BOX_DOUBLE, 
// Layout configuration
DEFAULT_PADDING_X, DEFAULT_PADDING_Y, DEFAULT_MAX_FRAME_WIDTH, DEFAULT_FRAME_WIDTH_PERCENT, setLayout, getLayout, getPadding, 
// Frame dimensions
getFrameDimensions, invalidateFrameDimensionsCache, calculateCenteringPadding, calculateHorizontalCentering, calculateFrameWidth, 
// Centered frame state
beginCenteredFrame, endCenteredFrame, 
// Drawing functions
drawHorizontalPadding, drawVerticalPadding, drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine, drawLine, drawCenteredLine, drawRightAlignedLine, 
// Utilities
calculateContentHeight, horizontalRule, } from "./core";
// =============================================================================
// Dialogs - Select Menu
// =============================================================================
export { selectMenu, } from "./dialogs";
// =============================================================================
// Dialogs - Text Input
// =============================================================================
export { textInput, passwordInput, } from "./dialogs";
// =============================================================================
// Dialogs - Confirm
// =============================================================================
export { confirm, confirmYesNo, } from "./dialogs";
// =============================================================================
// Dialogs - Message
// =============================================================================
export { showMessage, showMessageAndWait, message, info, success, warning, error, } from "./dialogs";
// =============================================================================
// Dialogs - Spinner
// =============================================================================
export { showSpinner, withSpinner, 
// Spinner frame presets
SPINNER_DOTS, SPINNER_LINE, SPINNER_ARC, SPINNER_CIRCLE, SPINNER_BOX, SPINNER_BOUNCE, SPINNER_BAR, } from "./dialogs";
// =============================================================================
// Dialogs - Help System
// =============================================================================
export { showHelp, mergeHelpContent, createSimpleHelp, } from "./dialogs";
// =============================================================================
// Pickers
// =============================================================================
export { pickFile, pickFileByExtension, pickFolder, pickFolderFromHome, } from "./pickers";
// =============================================================================
// Window System
// =============================================================================
export { createWindow, } from "./window";
//# sourceMappingURL=index.js.map