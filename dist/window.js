/**
 * Unified Window Component
 *
 * Manages the full lifecycle of a UI screen: rendering, keyboard handling, and cleanup.
 * Provides a consistent pattern for all interactive screens in the application.
 */
import { style, getFrameDimensions, clearScreen, hideCursor, showCursor, DEFAULT_PADDING_Y, drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine, drawLine, drawCenteredLine, createKeyboardHandler, isBackKey, isHelpKey, showHelp, } from "./index";
// =============================================================================
// Layout Constants
// =============================================================================
// Header: empty line + title + description + empty line = 4 lines
const HEADER_LINE_COUNT = 4;
// Footer: empty line + hints + empty line = 3 lines minimum
const FOOTER_BASE_LINE_COUNT = 3;
// Borders and dividers: top border + divider after header + divider before footer + bottom border
const FRAME_OVERHEAD = 4;
// =============================================================================
// Formatting Helpers
// =============================================================================
/**
 * Format hints with dimmed keys
 * Input: ["Space Play/Pause", "↑↓ BPM"]
 * Output: "Space Play/Pause  ↑↓ BPM" with first word dimmed
 */
function formatHints(hints) {
    return hints
        .map((hint) => {
        const spaceIndex = hint.indexOf(" ");
        if (spaceIndex === -1) {
            return style(hint, "dim");
        }
        const key = hint.slice(0, spaceIndex);
        const action = hint.slice(spaceIndex);
        return `${style(key, "dim")}${action}`;
    })
        .join("  ");
}
// =============================================================================
// Drawing Functions
// =============================================================================
function drawWindowHeader(innerWidth, title, subtitle, description) {
    // Build title line
    let titleLine = style(title, "bold", "accent");
    if (subtitle) {
        titleLine += `  ${style(subtitle, "dim")}`;
    }
    drawEmptyLine(innerWidth);
    drawCenteredLine(titleLine, innerWidth);
    if (description) {
        drawCenteredLine(style(description, "muted"), innerWidth);
    }
    else {
        drawEmptyLine(innerWidth);
    }
    drawEmptyLine(innerWidth);
}
function drawWindowFooter(innerWidth, hints) {
    const formattedHints = formatHints(hints);
    drawEmptyLine(innerWidth);
    drawLine(`  ${formattedHints}`, innerWidth);
    drawEmptyLine(innerWidth);
}
function calculateContentHeight(terminalHeight) {
    // Total overhead: DEFAULT_PADDING_Y + header + footer + frame elements
    const totalOverhead = DEFAULT_PADDING_Y +
        HEADER_LINE_COUNT +
        FOOTER_BASE_LINE_COUNT +
        FRAME_OVERHEAD;
    return Math.max(1, terminalHeight - totalOverhead);
}
function renderWindow(config, ctx) {
    const { innerWidth, contentHeight } = ctx;
    clearScreen();
    hideCursor();
    // Vertical padding
    for (let i = 0; i < DEFAULT_PADDING_Y; i++) {
        console.log();
    }
    drawTopBorder(innerWidth);
    drawWindowHeader(innerWidth, config.title, config.subtitle, config.description);
    drawDivider(innerWidth);
    // Get content from render function
    const contentResult = config.onRender(ctx);
    const contentLines = Array.isArray(contentResult)
        ? contentResult
        : [];
    // Calculate vertical centering
    const actualContentLines = contentLines.length;
    const availableExtraLines = Math.max(0, contentHeight - actualContentLines);
    const topPadding = Math.floor(availableExtraLines / 2);
    const bottomPadding = availableExtraLines - topPadding;
    // Top padding for vertical centering
    for (let i = 0; i < topPadding; i++) {
        drawEmptyLine(innerWidth);
    }
    // Draw content lines
    for (const line of contentLines) {
        if (config.centerContent) {
            drawCenteredLine(line, innerWidth);
        }
        else {
            drawLine(line, innerWidth);
        }
    }
    // Bottom padding for vertical centering
    for (let i = 0; i < bottomPadding; i++) {
        drawEmptyLine(innerWidth);
    }
    drawDivider(innerWidth);
    drawWindowFooter(innerWidth, config.hints);
    drawBottomBorder(innerWidth);
}
// =============================================================================
// Window Factory
// =============================================================================
/**
 * Create a unified window component with lifecycle management.
 *
 * @example
 * ```ts
 * await createWindow({
 *   title: "♪ METRONOME",
 *   subtitle: "Basic Rock",
 *   description: "Real-time drum pattern player",
 *   hints: ["Space Play/Pause", "↑↓ BPM ±5", "q/⌫ Back"],
 *   helpContent: HELP_METRONOME,
 *
 *   onRender: (ctx) => {
 *     return buildMetronomeContent(bpm, isPlaying, ctx.innerWidth);
 *   },
 *
 *   onKeypress: (key, actions) => {
 *     if (key.name === "space") { isPlaying = !isPlaying; actions.redraw(); }
 *     if (key.name === "up") { bpm += 5; actions.redraw(); }
 *     if (key.name === "down") { bpm -= 5; actions.redraw(); }
 *   },
 * }).run();
 * ```
 */
export function createWindow(config) {
    return {
        run: () => runWindow(config),
    };
}
async function runWindow(config) {
    let keyboard = null;
    let isClosing = false;
    let resolvePromise;
    // Calculate render context
    const getRenderContext = () => {
        const { width, height } = getFrameDimensions();
        const innerWidth = width - 2;
        const contentHeight = calculateContentHeight(height);
        return { innerWidth, contentHeight };
    };
    // Actions exposed to the config callbacks
    const actions = {
        redraw: () => {
            if (!isClosing) {
                renderWindow(config, getRenderContext());
            }
        },
        close: () => {
            if (!isClosing) {
                isClosing = true;
                cleanup();
                resolvePromise();
            }
        },
        pauseKeyboard: () => {
            if (keyboard) {
                keyboard.cleanup();
                keyboard = null;
            }
        },
        resumeKeyboard: () => {
            if (!keyboard && !isClosing) {
                setupKeyboard();
                renderWindow(config, getRenderContext());
            }
        },
    };
    // Handle terminal resize
    const onResize = () => {
        if (!isClosing) {
            renderWindow(config, getRenderContext());
        }
    };
    process.stdout.on("resize", onResize);
    // Cleanup function
    const cleanup = () => {
        process.stdout.off("resize", onResize);
        if (config.onUnmount) {
            config.onUnmount();
        }
        if (keyboard) {
            keyboard.cleanup();
            keyboard = null;
        }
        showCursor();
        clearScreen();
    };
    // Setup keyboard handler
    const setupKeyboard = () => {
        keyboard = createKeyboardHandler();
        keyboard.onKeypress(async (key) => {
            if (isClosing)
                return;
            // Call custom keypress handler first (await if async)
            if (config.onKeypress) {
                const handledResult = config.onKeypress(key, actions);
                // Await the result if it's a promise
                const handled = handledResult instanceof Promise
                    ? await handledResult
                    : handledResult;
                if (handled === true) {
                    // Custom handler consumed the event, skip defaults
                    return;
                }
            }
            // Help key (if help content provided)
            if (config.helpContent && isHelpKey(key)) {
                // Cleanup keyboard before showing help
                if (keyboard) {
                    keyboard.cleanup();
                    keyboard = null;
                }
                await showHelp(config.helpContent);
                // Re-setup keyboard and redraw after help closes
                if (!isClosing) {
                    setupKeyboard();
                    renderWindow(config, getRenderContext());
                }
                return;
            }
            // Back/quit keys
            if (isBackKey(key)) {
                actions.close();
                return;
            }
        });
    };
    return new Promise((resolve) => {
        resolvePromise = resolve;
        // Initial render
        renderWindow(config, getRenderContext());
        // Setup keyboard
        setupKeyboard();
        // Call onMount hook with actions
        if (config.onMount) {
            const mountResult = config.onMount(actions);
            if (mountResult instanceof Promise) {
                mountResult.catch((err) => {
                    console.error("onMount error:", err);
                });
            }
        }
    });
}
//# sourceMappingURL=window.js.map