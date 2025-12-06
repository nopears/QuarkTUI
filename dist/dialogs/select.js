/**
 * QuarkTUI - Select Menu Dialog
 *
 * A configurable list selection dialog with keyboard navigation.
 * Supports hints, info lines, and customizable styling.
 */
import { clearScreen, hideCursor, showCursor } from "../core/terminal";
import { getCurrentTheme, RESET, BOLD, DIM } from "../core/theme";
import { waitForKeypressCancellable, isUpKey, isDownKey, isConfirmKey, isBackKey, getNumberKey, } from "../core/keyboard";
import { drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine, drawLine, drawVerticalPadding, getFrameDimensions, getPadding, DEFAULT_INTERNAL_PADDING, } from "../core/drawing";
import { drawDialogHeader, drawDialogFooter } from "./shared";
// =============================================================================
// Header & Footer
// =============================================================================
// =============================================================================
// Rendering
// =============================================================================
function renderSelectMenu(config, selectedIndex) {
    const { width, height } = getFrameDimensions();
    const innerWidth = width - 2;
    const theme = getCurrentTheme();
    const { y: paddingY } = getPadding();
    // Calculate layout
    const headerLineCount = 4; // empty + title + description/empty + empty + divider
    const footerLineCount = 4; // divider + empty + hints + empty
    const infoLineCount = config.infoLines ? config.infoLines.length + 1 : 0; // +1 for spacing
    const availableContentLines = height - headerLineCount - footerLineCount - infoLineCount - 2; // -2 for borders
    const optionCount = config.options.length;
    clearScreen();
    hideCursor();
    // Vertical padding
    drawVerticalPadding(paddingY);
    // Top border
    drawTopBorder(innerWidth);
    // Header
    if (config.renderHeader) {
        config.renderHeader(innerWidth);
    }
    else {
        drawDialogHeader(innerWidth, {
            title: config.title,
            appName: config.appName,
            subtitle: config.subtitle,
            description: config.description,
        });
    }
    drawDivider(innerWidth);
    // Internal padding (space between border and content)
    const pad = " ".repeat(DEFAULT_INTERNAL_PADDING);
    // Info lines (if any)
    if (config.infoLines && config.infoLines.length > 0) {
        for (const line of config.infoLines) {
            drawLine(`${pad}${DIM}${line}${RESET}`, innerWidth);
        }
        drawEmptyLine(innerWidth);
    }
    // Calculate visible range for scrolling
    let startIndex = 0;
    let endIndex = Math.min(optionCount, availableContentLines);
    // Adjust visible range if selected item would be out of view
    if (selectedIndex >= endIndex) {
        endIndex = selectedIndex + 1;
        startIndex = Math.max(0, endIndex - availableContentLines);
    }
    else if (selectedIndex < startIndex) {
        startIndex = selectedIndex;
        endIndex = Math.min(optionCount, startIndex + availableContentLines);
    }
    // Show scroll indicator at top if needed
    const hasMoreAbove = startIndex > 0;
    const hasMoreBelow = endIndex < optionCount;
    // Render options
    let linesDrawn = 0;
    if (hasMoreAbove) {
        drawLine(`${pad}${DIM}↑ more...${RESET}`, innerWidth);
        linesDrawn++;
    }
    for (let i = startIndex; i < endIndex && linesDrawn < availableContentLines; i++) {
        const opt = config.options[i];
        if (!opt)
            continue;
        const isSelected = i === selectedIndex;
        const isDisabled = opt.disabled === true;
        // Build the option line
        let prefix;
        let label;
        let hint = "";
        if (isSelected) {
            prefix = `${pad.slice(0, -1)}${theme.colors.highlight}❯${RESET} `;
            label = `${BOLD}${theme.colors.text}${opt.label}${RESET}`;
        }
        else if (isDisabled) {
            prefix = `${pad} `;
            label = `${DIM}${opt.label}${RESET}`;
        }
        else {
            prefix = `${pad} `;
            label = `${DIM}${opt.label}${RESET}`;
        }
        if (opt.hint) {
            hint = ` ${theme.colors.textMuted}(${opt.hint})${RESET}`;
        }
        // Add number key hint if enabled
        const showNumbers = config.allowNumberKeys ?? config.options.length <= 9;
        let numberHint = "";
        if (showNumbers && i < 9) {
            numberHint = `${DIM}${i + 1}${RESET} `;
        }
        drawLine(`${prefix}${numberHint}${label}${hint}`, innerWidth);
        linesDrawn++;
    }
    if (hasMoreBelow) {
        drawLine(`${pad}${DIM}↓ more...${RESET}`, innerWidth);
        linesDrawn++;
    }
    // Fill remaining space
    while (linesDrawn < availableContentLines) {
        drawEmptyLine(innerWidth);
        linesDrawn++;
    }
    drawDivider(innerWidth);
    // Footer
    if (config.renderFooter) {
        config.renderFooter(innerWidth);
    }
    else {
        drawDialogFooter(innerWidth, {
            hints: ["↑↓ Navigate", "⏎ Select", "q/⌫ Back"],
        });
    }
    drawBottomBorder(innerWidth);
}
// =============================================================================
// Main Function
// =============================================================================
/**
 * Display a select menu and wait for user selection.
 *
 * @param options - Menu configuration
 * @returns The selected value or cancelled result
 *
 * @example
 * ```ts
 * const result = await selectMenu({
 *   title: "Choose an option",
 *   options: [
 *     { label: "Option 1", value: "opt1" },
 *     { label: "Option 2", value: "opt2", hint: "recommended" },
 *     { label: "Cancel", value: "cancel" },
 *   ],
 * });
 *
 * if (result.type === "selected") {
 *   console.log("Selected:", result.value);
 * }
 * ```
 *
 * @example
 * ```ts
 * // With app name and description
 * const result = await selectMenu({
 *   title: "Main Menu",
 *   appName: "♪ LAZYGIG",
 *   subtitle: "Settings",
 *   description: "Configure your preferences",
 *   options: [
 *     { label: "Theme", value: "theme" },
 *     { label: "Audio", value: "audio" },
 *   ],
 * });
 * ```
 */
export async function selectMenu(options) {
    const config = options;
    let selectedIndex = config.selectedIndex ?? 0;
    const maxIndex = config.options.length - 1;
    let needsRedraw = false;
    // Ensure selectedIndex is valid
    selectedIndex = Math.max(0, Math.min(selectedIndex, maxIndex));
    // Skip disabled options initially
    while (selectedIndex <= maxIndex && config.options[selectedIndex]?.disabled) {
        selectedIndex++;
    }
    if (selectedIndex > maxIndex) {
        // All options disabled? Reset to 0
        selectedIndex = 0;
    }
    // Handle terminal resize
    const onResize = () => {
        needsRedraw = true;
    };
    process.stdout.on("resize", onResize);
    const cleanup = () => {
        process.stdout.off("resize", onResize);
        showCursor();
    };
    // Find next non-disabled option
    const findNextEnabled = (from, direction) => {
        let index = from;
        const limit = direction === 1 ? maxIndex : 0;
        while (index !== limit) {
            index += direction;
            if (!config.options[index]?.disabled) {
                return index;
            }
        }
        // Wrap around
        index = direction === 1 ? 0 : maxIndex;
        while (index !== from) {
            if (!config.options[index]?.disabled) {
                return index;
            }
            index += direction;
        }
        return from; // No other enabled options
    };
    // Initial render
    renderSelectMenu(config, selectedIndex);
    while (true) {
        // Check for resize while waiting for key
        let timeoutId = null;
        const { promise: keyPromise, cancel: cancelKeyWait } = waitForKeypressCancellable();
        const key = await Promise.race([
            keyPromise,
            new Promise((resolve) => {
                const check = () => {
                    if (needsRedraw) {
                        needsRedraw = false;
                        resolve(null);
                    }
                    else {
                        timeoutId = setTimeout(check, 100);
                    }
                };
                timeoutId = setTimeout(check, 100);
            }),
        ]);
        // Clear any pending timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // Handle resize
        if (key === null) {
            cancelKeyWait();
            renderSelectMenu(config, selectedIndex);
            continue;
        }
        // Handle navigation
        if (isUpKey(key)) {
            selectedIndex = findNextEnabled(selectedIndex > 0 ? selectedIndex : maxIndex + 1, -1);
            renderSelectMenu(config, selectedIndex);
        }
        else if (isDownKey(key)) {
            selectedIndex = findNextEnabled(selectedIndex < maxIndex ? selectedIndex : -1, 1);
            renderSelectMenu(config, selectedIndex);
        }
        else if (isConfirmKey(key)) {
            const selected = config.options[selectedIndex];
            if (selected && !selected.disabled) {
                cleanup();
                return { type: "selected", value: selected.value };
            }
        }
        else if (isBackKey(key)) {
            cleanup();
            return { type: "cancelled" };
        }
        else {
            // Check for number key selection
            const showNumbers = config.allowNumberKeys ?? config.options.length <= 9;
            if (showNumbers) {
                const num = getNumberKey(key);
                if (num !== null && num >= 1 && num <= config.options.length) {
                    const index = num - 1;
                    const opt = config.options[index];
                    if (opt && !opt.disabled) {
                        cleanup();
                        return { type: "selected", value: opt.value };
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=select.js.map