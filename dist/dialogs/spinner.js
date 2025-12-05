/**
 * QuarkTUI - Spinner/Loading Indicator
 *
 * A customizable loading spinner with message support.
 * Can be updated while running and stopped with a final message.
 */
import { clearScreen, hideCursor, showCursor } from "../core/terminal";
import { getCurrentTheme, RESET, BOLD } from "../core/theme";
import { drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine, drawCenteredLine, drawVerticalPadding, calculateCenteringPadding, calculateFrameWidth, beginCenteredFrame, endCenteredFrame, } from "../core/drawing";
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
    const theme = getCurrentTheme();
    // Calculate frame width for horizontal centering
    const frameWidth = calculateFrameWidth();
    const innerWidth = frameWidth - 2;
    // Calculate actual content height
    const hasTitle = !!config.title;
    const headerLineCount = hasTitle ? 4 : 2;
    const footerLineCount = 2;
    const spinnerLineCount = 3; // empty + spinner + empty
    const contentHeight = 2 + // borders
        headerLineCount +
        footerLineCount +
        spinnerLineCount;
    // Calculate vertical centering
    const topPadding = calculateCenteringPadding(contentHeight);
    clearScreen();
    hideCursor();
    // Set up horizontal centering
    beginCenteredFrame(frameWidth);
    // Dynamic vertical padding
    drawVerticalPadding(topPadding);
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
    // Spinner line
    drawEmptyLine(innerWidth);
    const spinnerLine = `${theme.colors.highlight}${frame}${RESET} ${message}`;
    drawCenteredLine(spinnerLine, innerWidth);
    drawEmptyLine(innerWidth);
    if (hasTitle) {
        drawDivider(innerWidth);
    }
    // Footer
    drawEmptyLine(innerWidth);
    drawBottomBorder(innerWidth);
    // End horizontal centering
    endCenteredFrame();
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
                // Calculate frame width for horizontal centering
                const frameWidth = calculateFrameWidth();
                const innerWidth = frameWidth - 2;
                const hasTitle = !!config.title;
                const headerLineCount = hasTitle ? 4 : 2;
                const footerLineCount = 2;
                const spinnerLineCount = 3;
                const contentHeight = 2 + // borders
                    headerLineCount +
                    footerLineCount +
                    spinnerLineCount;
                const topPadding = calculateCenteringPadding(contentHeight);
                clearScreen();
                hideCursor();
                // Set up horizontal centering
                beginCenteredFrame(frameWidth);
                drawVerticalPadding(topPadding);
                drawTopBorder(innerWidth);
                drawEmptyLine(innerWidth);
                if (hasTitle) {
                    const styledTitle = `${BOLD}${theme.colors.accent}${config.title}${RESET}`;
                    drawCenteredLine(styledTitle, innerWidth);
                    drawEmptyLine(innerWidth);
                    drawDivider(innerWidth);
                }
                // Spinner success line
                drawEmptyLine(innerWidth);
                const successLine = `${theme.colors.success}✓${RESET} ${finalMessage}`;
                drawCenteredLine(successLine, innerWidth);
                drawEmptyLine(innerWidth);
                if (hasTitle) {
                    drawDivider(innerWidth);
                }
                drawEmptyLine(innerWidth);
                drawBottomBorder(innerWidth);
                // End horizontal centering
                endCenteredFrame();
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