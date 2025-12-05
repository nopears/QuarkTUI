/**
 * QuarkTUI - Message Dialog
 *
 * Display messages, alerts, and notifications to the user.
 * Supports different message types (info, success, warning, error)
 * with appropriate icons and colors.
 */
import { clearScreen, hideCursor, showCursor } from "../core/terminal";
import { getCurrentTheme, RESET, BOLD, DIM } from "../core/theme";
import { waitForKeypress } from "../core/keyboard";
import { drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine, drawLine, drawCenteredLine, drawVerticalPadding, calculateCenteringPadding, calculateFrameWidth, beginCenteredFrame, endCenteredFrame, } from "../core/drawing";
const MESSAGE_TYPES = {
    info: { icon: "●", colorKey: "info" },
    success: { icon: "✓", colorKey: "success" },
    warning: { icon: "!", colorKey: "warning" },
    error: { icon: "✗", colorKey: "error" },
};
// =============================================================================
// Rendering
// =============================================================================
function renderMessage(config) {
    const frameWidth = calculateFrameWidth(60, 0.8);
    const innerWidth = frameWidth - 2;
    const theme = getCurrentTheme();
    const type = config.type ?? "info";
    const typeConfig = MESSAGE_TYPES[type];
    const color = theme.colors[typeConfig.colorKey];
    // Calculate content height for vertical centering
    const headerLineCount = 4; // empty + title + empty + divider
    const footerLineCount = config.waitForKey ? 4 : 3; // divider + empty + [hint +] empty
    const contentLineCount = config.lines.length;
    const totalHeight = headerLineCount + contentLineCount + footerLineCount + 2; // +2 for borders
    const topPadding = calculateCenteringPadding(totalHeight);
    clearScreen();
    hideCursor();
    // Vertical padding for centering
    drawVerticalPadding(topPadding);
    // Begin centered frame
    beginCenteredFrame(frameWidth);
    // Top border
    drawTopBorder(innerWidth);
    // Header
    if (config.renderHeader) {
        config.renderHeader(innerWidth);
    }
    else {
        const icon = `${color}${typeConfig.icon}${RESET}`;
        const styledTitle = config.title
            ? `${icon} ${BOLD}${config.title}${RESET}`
            : icon;
        drawEmptyLine(innerWidth);
        drawCenteredLine(styledTitle, innerWidth);
        drawEmptyLine(innerWidth);
    }
    drawDivider(innerWidth);
    // Content lines
    for (const line of config.lines) {
        if (config.centerLines) {
            drawCenteredLine(line, innerWidth);
        }
        else {
            drawLine(`  ${line}`, innerWidth);
        }
    }
    drawDivider(innerWidth);
    // Footer
    if (config.renderFooter) {
        config.renderFooter(innerWidth);
    }
    else {
        drawEmptyLine(innerWidth);
        if (config.waitForKey) {
            drawCenteredLine(`${DIM}Press any key to continue...${RESET}`, innerWidth);
        }
        drawEmptyLine(innerWidth);
    }
    drawBottomBorder(innerWidth);
    // End centered frame
    endCenteredFrame();
}
// =============================================================================
// Main Functions
// =============================================================================
/**
 * Display a message without waiting for user input.
 * Useful for showing status before an operation.
 *
 * @param title - Message title
 * @param lines - Lines of text to display
 * @param type - Type of message (affects icon and color)
 *
 * @example
 * ```ts
 * showMessage("Processing", ["Please wait..."], "info");
 * await doSomething();
 * showMessage("Complete", ["Operation finished successfully."], "success");
 * ```
 */
export function showMessage(title, lines, type = "info") {
    renderMessage({
        title,
        lines,
        type,
        waitForKey: false,
    });
}
/**
 * Display a message and wait for user to press a key.
 *
 * @param title - Message title
 * @param lines - Lines of text to display
 * @param type - Type of message (affects icon and color)
 *
 * @example
 * ```ts
 * await showMessageAndWait(
 *   "Operation Complete",
 *   ["Your file has been saved.", "Location: /path/to/file.txt"],
 *   "success"
 * );
 * ```
 */
export async function showMessageAndWait(title, lines, type = "info") {
    renderMessage({
        title,
        lines,
        type,
        waitForKey: true,
    });
    await waitForKeypress();
    showCursor();
}
/**
 * Display a message dialog with full configuration options.
 *
 * @param options - Full message configuration
 *
 * @example
 * ```ts
 * await message({
 *   title: "Welcome",
 *   lines: ["Thanks for using our app!", "Press any key to start."],
 *   type: "info",
 *   waitForKey: true,
 *   centerLines: true,
 * });
 * ```
 */
export async function message(options) {
    const config = options;
    renderMessage(config);
    if (config.waitForKey !== false) {
        await waitForKeypress();
        showCursor();
    }
}
// =============================================================================
// Convenience Functions
// =============================================================================
/**
 * Show an info message and wait for key.
 */
export async function info(title, ...lines) {
    await showMessageAndWait(title, lines, "info");
}
/**
 * Show a success message and wait for key.
 */
export async function success(title, ...lines) {
    await showMessageAndWait(title, lines, "success");
}
/**
 * Show a warning message and wait for key.
 */
export async function warning(title, ...lines) {
    await showMessageAndWait(title, lines, "warning");
}
/**
 * Show an error message and wait for key.
 */
export async function error(title, ...lines) {
    await showMessageAndWait(title, lines, "error");
}
//# sourceMappingURL=message.js.map