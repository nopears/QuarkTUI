/**
 * Unified Window Component
 *
 * Manages the full lifecycle of a UI screen: rendering, keyboard handling, and cleanup.
 * Provides a consistent pattern for all interactive screens in the application.
 */
import { type KeypressEvent, type HelpContent } from "./index";
import type { RenderContext } from "./widgets/types";
export interface WindowConfig {
    /** Window title (e.g., "♪ METRONOME") */
    title: string;
    /** Optional subtitle displayed next to title (dimmed) */
    subtitle?: string;
    /** Optional description displayed below title (gray) */
    description?: string;
    /** Keyboard hints for footer (e.g., ["Space Play/Pause", "↑↓ BPM", "q/⌫ Back"]) */
    hints: string[];
    /** If provided, ? key shows this help */
    helpContent?: HelpContent;
    /** Render function called to generate content lines */
    onRender: (ctx: RenderContext) => string[] | void;
    /** If true, content lines are centered. If false (default), lines handle their own alignment */
    centerContent?: boolean;
    /**
     * Custom keypress handler called BEFORE default handlers.
     * Return true to prevent default handling (back/help).
     * Can be async - the window will await it before processing default handlers.
     */
    onKeypress?: (key: KeypressEvent, actions: WindowActions) => boolean | void | Promise<boolean | void>;
    /** Called when window is mounted (after first render), receives actions for async updates */
    onMount?: (actions: WindowActions) => void | Promise<void>;
    /** Called when window is unmounted (before cleanup) */
    onUnmount?: () => void;
}
export interface WindowActions {
    /** Trigger a re-render */
    redraw: () => void;
    /** Close the window and resolve the promise */
    close: () => void;
    /** Pause keyboard handling (call before showing a modal) */
    pauseKeyboard: () => void;
    /** Resume keyboard handling (call after modal closes) */
    resumeKeyboard: () => void;
}
export interface WindowInstance {
    /** Start the window and wait for it to close */
    run: () => Promise<void>;
}
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
export declare function createWindow(config: WindowConfig): WindowInstance;
export type { KeypressEvent } from "./core/keyboard";
export type { HelpContent } from "./dialogs/help";
//# sourceMappingURL=window.d.ts.map