/**
 * QuarkTUI - Spinner/Loading Indicator
 *
 * A customizable loading spinner with message support.
 * Can be updated while running and stopped with a final message.
 */
import { clearScreen, hideCursor, showCursor } from "../core/terminal";
import { getCurrentTheme, RESET, BOLD } from "../core/theme";
import { drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine, drawLine, drawCenteredLine, drawVerticalPadding, getFrameDimensions, getPadding, } from "../core/drawing";
// =============================================================================
// Default Spinner Frames
// =============================================================================
/**
 * Braille dot spinner frames (default).
 */
export const SPINNER_DOTS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
/**
 * Line spinner frames.
 */
export const SPINNER_LINE = ["-", "\\", "|", "/"];
/**
 * Arc spinner frames.
 */
export const SPINNER_ARC = ["◜", "◠", "◝", "◞", "◡", "◟"];
/**
 * Circle spinner frames.
 */
export const SPINNER_CIRCLE = ["◐", "◓", "◑", "◒"];
/**
 * Box spinner frames.
 */
export const SPINNER_BOX = ["▖", "▘", "▝", "▗"];
/**
 * Bounce spinner frames.
 */
export const SPINNER_BOUNCE = ["⠁", "⠂", "⠄", "⠂"];
/**
 * Growing bar spinner frames.
 */
export const SPINNER_BAR = [
    "▏",
    "▎",
    "▍",
    "▌",
    "▋",
    "▊",
    "▉",
    "█",
    "▉",
    "▊",
    "▋",
    "▌",
    "▍",
    "▎",
    "▏",
];
// =============================================================================
// Rendering
// =============================================================================
function renderSpinner(config, frame, message) {
    const { width, height } = getFrameDimensions();
    const innerWidth = width - 2;
    const theme = getCurrentTheme();
    const { y: paddingY } = getPadding();
    // Calculate layout
    const hasTitle = !!config.title;
    const headerLineCount = hasTitle ? 4 : 2; // With or without title
    const footerLineCount = 2;
    const availableContentLines = height - headerLineCount - footerLineCount - 2;
    clearScreen();
    hideCursor();
    // Vertical padding
    drawVerticalPadding(paddingY);
    // Top border
    drawTopBorder(innerWidth);
    // Header
    drawEmptyLine(innerWidth);
    if (hasTitle) {
        const styledTitle = `${BOLD}${theme.colors.accent}${config.title}${RESET}`;
        drawCenteredLine(styledTitle, innerWidth);
        drawEmptyLine(innerWidth);
        drawDivider(innerWidth);
    }
    // Calculate content centering
    const contentLines = 1; // Just the spinner line
    const extraLines = Math.max(0, availableContentLines - contentLines);
    const topPadding = Math.floor(extraLines / 2);
    const bottomPadding = extraLines - topPadding;
    // Top padding for centering
    for (let i = 0; i < topPadding; i++) {
        drawEmptyLine(innerWidth);
    }
    // Spinner line
    const spinnerLine = `${theme.colors.highlight}${frame}${RESET} ${message}`;
    if (config.centerMessage) {
        drawCenteredLine(spinnerLine, innerWidth);
    }
    else {
        drawLine(`  ${spinnerLine}`, innerWidth);
    }
    // Bottom padding for centering
    for (let i = 0; i < bottomPadding; i++) {
        drawEmptyLine(innerWidth);
    }
    if (hasTitle) {
        drawDivider(innerWidth);
    }
    // Footer
    drawEmptyLine(innerWidth);
    drawBottomBorder(innerWidth);
}
// =============================================================================
// Main Function
// =============================================================================
/**
 * Show a loading spinner with a message.
 * Returns a controller to update the message or stop the spinner.
 *
 * @param options - Spinner configuration (can be just a message string)
 * @returns Controller to update or stop the spinner
 *
 * @example
 * ```ts
 * const spinner = showSpinner("Loading data...");
 *
 * await fetchData();
 * spinner.update("Processing...");
 *
 * await processData();
 * spinner.stop("Done!");
 * ```
 *
 * @example
 * ```ts
 * const spinner = showSpinner({
 *   message: "Downloading...",
 *   title: "Please Wait",
 *   frames: SPINNER_CIRCLE,
 *   interval: 100,
 * });
 *
 * // Later...
 * spinner.stop();
 * ```
 */
export function showSpinner(options) {
    // Normalize options
    const config = typeof options === "string" ? { message: options } : options;
    const frames = config.frames ?? SPINNER_DOTS;
    const interval = config.interval ?? 80;
    let frameIndex = 0;
    let currentMessage = config.message;
    let stopped = false;
    let intervalId = null;
    // Render function
    const render = () => {
        if (stopped)
            return;
        const frame = frames[frameIndex] ?? frames[0] ?? "●";
        renderSpinner(config, frame, currentMessage);
    };
    // Initial render
    render();
    // Start animation
    intervalId = setInterval(() => {
        if (stopped)
            return;
        frameIndex = (frameIndex + 1) % frames.length;
        render();
    }, interval);
    // Handle terminal resize
    const onResize = () => {
        if (!stopped) {
            render();
        }
    };
    process.stdout.on("resize", onResize);
    // Return controller
    return {
        update: (message) => {
            if (!stopped) {
                currentMessage = message;
                render();
            }
        },
        stop: (finalMessage) => {
            if (stopped)
                return;
            stopped = true;
            // Clean up
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            process.stdout.off("resize", onResize);
            // Show final message if provided
            if (finalMessage) {
                const theme = getCurrentTheme();
                const { width, height } = getFrameDimensions();
                const innerWidth = width - 2;
                const { y: paddingY } = getPadding();
                const hasTitle = !!config.title;
                const headerLineCount = hasTitle ? 4 : 2;
                const footerLineCount = 2;
                const availableContentLines = height - headerLineCount - footerLineCount - 2;
                clearScreen();
                hideCursor();
                drawVerticalPadding(paddingY);
                drawTopBorder(innerWidth);
                drawEmptyLine(innerWidth);
                if (hasTitle) {
                    const styledTitle = `${BOLD}${theme.colors.accent}${config.title}${RESET}`;
                    drawCenteredLine(styledTitle, innerWidth);
                    drawEmptyLine(innerWidth);
                    drawDivider(innerWidth);
                }
                const extraLines = Math.max(0, availableContentLines - 1);
                const topPadding = Math.floor(extraLines / 2);
                const bottomPadding = extraLines - topPadding;
                for (let i = 0; i < topPadding; i++) {
                    drawEmptyLine(innerWidth);
                }
                const successLine = `${theme.colors.success}✓${RESET} ${finalMessage}`;
                if (config.centerMessage) {
                    drawCenteredLine(successLine, innerWidth);
                }
                else {
                    drawLine(`  ${successLine}`, innerWidth);
                }
                for (let i = 0; i < bottomPadding; i++) {
                    drawEmptyLine(innerWidth);
                }
                if (hasTitle) {
                    drawDivider(innerWidth);
                }
                drawEmptyLine(innerWidth);
                drawBottomBorder(innerWidth);
            }
            showCursor();
        },
    };
}
/**
 * Run an async operation with a spinner.
 * Automatically stops the spinner when the operation completes.
 *
 * @param message - Message to display while loading
 * @param operation - Async operation to run
 * @param successMessage - Optional message to show on success
 * @returns The result of the operation
 *
 * @example
 * ```ts
 * const data = await withSpinner(
 *   "Fetching data...",
 *   () => fetchData(),
 *   "Data loaded!"
 * );
 * ```
 */
export async function withSpinner(message, operation, successMessage) {
    const spinner = showSpinner(message);
    try {
        const result = await operation();
        spinner.stop(successMessage);
        return result;
    }
    catch (error) {
        spinner.stop();
        throw error;
    }
}
//# sourceMappingURL=spinner.js.map