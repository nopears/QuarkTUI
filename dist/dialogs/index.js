/**
 * QuarkTUI - Dialogs Module
 *
 * Central export point for all dialog components.
 * Includes select menus, text input, confirmations, messages, spinners, and help.
 */
// =============================================================================
// Select Menu
// =============================================================================
export { selectMenu, } from "./select";
// =============================================================================
// Text Input
// =============================================================================
export { textInput, passwordInput, } from "./input";
// =============================================================================
// Confirm Dialog
// =============================================================================
export { confirm, confirmYesNo, } from "./confirm";
// =============================================================================
// Message Dialog
// =============================================================================
export { showMessage, showMessageAndWait, message, info, success, warning, error, } from "./message";
// =============================================================================
// Spinner
// =============================================================================
export { showSpinner, withSpinner, 
// Spinner frame presets
SPINNER_DOTS, SPINNER_LINE, SPINNER_ARC, SPINNER_CIRCLE, SPINNER_BOX, SPINNER_BOUNCE, SPINNER_BAR, } from "./spinner";
// =============================================================================
// Help System
// =============================================================================
export { showHelp, isHelpKey, mergeHelpContent, createSimpleHelp, } from "./help";
//# sourceMappingURL=index.js.map