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
export { Component, type ComponentConfig } from "./component";
export { type Widget, type RenderContext, type WidgetType, type Alignment, type TextOptions, type RowOptions, type SpacerOptions, type TableCell, type TableColumn, type TableOptions, type ProgressBarOptions, type ProgressBarStyle, type ListItem, type ListOptions, type ListStyle, Text, Spacer, Row, Table, ProgressBar, Progress, List, BulletList, NumberedList, CheckboxList, } from "./widgets";
export { render, renderFitted } from "./renderer";
export { beginRender, flushRender, cancelRender, isRenderBuffering, bufferWrite, bufferWriteLine, clearScreen, clearToEnd, clearLine, hideCursor, showCursor, moveCursor, moveCursorUp, moveCursorDown, moveCursorLeft, moveCursorRight, saveCursorPosition, restoreCursorPosition, getTerminalSize, isTTY, isInputTTY, write, writeLine, bell, enterAlternateScreen, leaveAlternateScreen, type TerminalSize, DEFAULT_WIDTH, DEFAULT_HEIGHT, } from "./core";
export { getCurrentTheme, setTheme, onThemeChange, getColors, resetTheme, createTheme, RESET, BOLD, DIM, ITALIC, UNDERLINE, INVERSE, HIDDEN, STRIKETHROUGH, fg, bg, fgRgb, bgRgb, ANSI, ANSI_BG, type Theme, type ThemeColors, } from "./core";
export { style, raw, stripAnsi, visibleLength, repeat, padRight, padLeft, padCenter, truncate, type StyleType, formatDim, formatBold, formatSuccess, formatError, formatWarning, formatInfo, } from "./core";
export { createKeyboardHandler, waitForKeypress, waitForKeypressCancellable, isBackKey, isConfirmKey, isUpKey, isDownKey, isLeftKey, isRightKey, isHelpKey, getNumberKey, isPrintable, type KeypressEvent, type KeyboardHandler, type KeyboardHandlerOptions, } from "./core";
export { BOX, BOX_SHARP, BOX_DOUBLE, DEFAULT_PADDING_X, DEFAULT_PADDING_Y, DEFAULT_MAX_FRAME_WIDTH, DEFAULT_FRAME_WIDTH_PERCENT, setLayout, getLayout, getPadding, getFrameDimensions, invalidateFrameDimensionsCache, calculateCenteringPadding, calculateHorizontalCentering, calculateFrameWidth, beginCenteredFrame, endCenteredFrame, drawHorizontalPadding, drawVerticalPadding, drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine, drawLine, drawCenteredLine, drawRightAlignedLine, calculateContentHeight, horizontalRule, type LayoutConfig, type FrameDimensions, } from "./core";
export { selectMenu, type SelectMenuConfig, type MenuOption, type SelectMenuOptions, type SelectResult, } from "./dialogs";
export { textInput, passwordInput, type TextInputConfig, type TextInputOptions, type TextInputResult, } from "./dialogs";
export { confirm, confirmYesNo, type ConfirmConfig, type ConfirmOptions, type ConfirmResult, } from "./dialogs";
export { showMessage, showMessageAndWait, message, info, success, warning, error, type MessageConfig, type MessageType, type MessageOptions, } from "./dialogs";
export { showSpinner, withSpinner, SPINNER_DOTS, SPINNER_LINE, SPINNER_ARC, SPINNER_CIRCLE, SPINNER_BOX, SPINNER_BOUNCE, SPINNER_BAR, type SpinnerConfig, type SpinnerOptions, type SpinnerController, } from "./dialogs";
export { showHelp, mergeHelpContent, createSimpleHelp, type KeyBinding, type HelpSection, type HelpContent, } from "./dialogs";
export { pickFile, pickFileByExtension, pickFolder, pickFolderFromHome, type FilePickerOptions, type FolderPickerOptions, } from "./pickers";
export type { ThemeProvider } from "./types";
export { createWindow, type WindowConfig, type WindowActions, type WindowInstance, } from "./window";
//# sourceMappingURL=index.d.ts.map