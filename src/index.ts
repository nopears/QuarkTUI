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

export { Component, type ComponentConfig } from "./component";

// =============================================================================
// Widgets
// =============================================================================

export {
	// Types
	type Widget,
	type RenderContext,
	type WidgetType,
	type Alignment,
	type TextOptions,
	type RowOptions,
	type SpacerOptions,
	type TableCell,
	type TableColumn,
	type TableOptions,
	// Primitives
	Text,
	Spacer,
	Row,
	Table,
} from "./widgets";

// Renderer
export { render, renderFitted } from "./renderer";

// =============================================================================
// Core - Terminal Operations
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
} from "./core";

// =============================================================================
// Core - Theme System
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
} from "./core";

// =============================================================================
// Core - Text Styling
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
} from "./core";

// =============================================================================
// Core - Keyboard Input
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
} from "./core";

// =============================================================================
// Core - Drawing Primitives
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
} from "./core";

// =============================================================================
// Dialogs - Select Menu
// =============================================================================

export {
	selectMenu,
	type SelectMenuConfig,
	type MenuOption,
	type SelectMenuOptions,
	type SelectResult,
} from "./dialogs";

// =============================================================================
// Dialogs - Text Input
// =============================================================================

export {
	textInput,
	passwordInput,
	type TextInputConfig,
	type TextInputOptions,
	type TextInputResult,
} from "./dialogs";

// =============================================================================
// Dialogs - Confirm
// =============================================================================

export {
	confirm,
	confirmYesNo,
	type ConfirmConfig,
	type ConfirmOptions,
	type ConfirmResult,
} from "./dialogs";

// =============================================================================
// Dialogs - Message
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
	type MessageType,
	type MessageOptions,
} from "./dialogs";

// =============================================================================
// Dialogs - Spinner
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
	type SpinnerOptions,
	type SpinnerController,
} from "./dialogs";

// =============================================================================
// Dialogs - Help System
// =============================================================================

export {
	showHelp,
	mergeHelpContent,
	createSimpleHelp,
	type KeyBinding,
	type HelpSection,
	type HelpContent,
} from "./dialogs";

// =============================================================================
// Pickers
// =============================================================================

export {
	pickFile,
	pickFileByExtension,
	pickFolder,
	pickFolderFromHome,
	type FilePickerOptions,
	type FolderPickerOptions,
} from "./pickers";

// =============================================================================
// Types (re-export from types module for convenience)
// =============================================================================

export type { ThemeProvider } from "./types";

// =============================================================================
// Window System
// =============================================================================

export {
	createWindow,
	type WindowConfig,
	type WindowActions,
	type WindowInstance,
} from "./window";
