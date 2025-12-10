/**
 * QuarkTUI - Dialogs Module
 *
 * Central export point for all dialog components.
 * Includes select menus, text input, confirmations, messages, spinners, and help.
 */
export { selectMenu, type SelectMenuConfig } from "./select";
export type { MenuOption, SelectMenuOptions, SelectResult } from "./select";
export { textInput, passwordInput, type TextInputConfig } from "./input";
export type { TextInputOptions, TextInputResult } from "./input";
export { confirm, confirmYesNo, type ConfirmConfig } from "./confirm";
export type { ConfirmOptions, ConfirmResult } from "./confirm";
export { showMessage, showMessageAndWait, message, info, success, warning, error, type MessageConfig, } from "./message";
export type { MessageType, MessageOptions } from "./message";
export { showSpinner, withSpinner, SPINNER_DOTS, SPINNER_LINE, SPINNER_ARC, SPINNER_CIRCLE, SPINNER_BOX, SPINNER_BOUNCE, SPINNER_BAR, type SpinnerConfig, } from "./spinner";
export type { SpinnerOptions, SpinnerController } from "./spinner";
export { showHelp, isHelpKey, mergeHelpContent, createSimpleHelp, } from "./help";
export type { KeyBinding, HelpSection, HelpContent } from "./help";
export { drawDialogHeader, drawDialogFooter, drawSimpleHeader, drawSimpleFooter, drawIconHeader, formatHints, type DialogHeaderOptions, type DialogFooterOptions, } from "./shared";
export { multiSelect, quickMultiSelect, type MultiSelectConfig, } from "./multiselect";
export type { MultiSelectOption, MultiSelectOptions, MultiSelectResult, } from "./multiselect";
//# sourceMappingURL=index.d.ts.map