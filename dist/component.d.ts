/**
 * QuarkTUI - Component
 *
 * Base class for all UI components.
 * Handles lifecycle, keyboard input, and rendering via the widget system.
 */
import type { KeypressEvent } from "./core/keyboard";
import type { HelpContent } from "./dialogs/help";
import type { Widget, RenderContext } from "./widgets/types";
/**
 * Configuration options that can be set on a component.
 */
export interface ComponentConfig {
    /** Window title (e.g., "♪ METRONOME") */
    title: string;
    /** Optional subtitle displayed next to title */
    subtitle?: string;
    /** Optional description displayed below title */
    description?: string;
    /** Keyboard hints for footer */
    hints: string[];
    /** Help content shown when ? is pressed */
    helpContent?: HelpContent;
    /** Whether to center content horizontally (default: true) */
    centerContent?: boolean;
}
/**
 * Base class for all QuarkTUI components.
 *
 * Extend this class to create a new component:
 *
 * @example
 * ```typescript
 * class MyComponent extends Component<MyService> {
 *   readonly config = {
 *     title: "My Component",
 *     hints: ["Space Action", "q/⌫ Back"],
 *   };
 *
 *   render(ctx: RenderContext): Widget[] {
 *     return [
 *       Text("Hello!", { align: "center" }),
 *     ];
 *   }
 * }
 *
 * // Usage:
 * const service = new MyService();
 * const component = new MyComponent(service);
 * await component.run();
 * ```
 */
export declare abstract class Component<TService = unknown> {
    /** Service instance injected via constructor */
    protected readonly service: TService;
    /** Window actions - available after mount */
    private actions;
    /**
     * Component configuration.
     * Must be defined by the subclass.
     */
    abstract readonly config: ComponentConfig;
    /**
     * Render the component's UI using widgets.
     * Called whenever the component needs to redraw.
     *
     * @param ctx - Render context with dimensions
     * @returns Array of widgets to display
     */
    abstract render(ctx: RenderContext): Widget[];
    /**
     * Create a new component instance.
     *
     * @param service - Service instance for business logic
     */
    constructor(service: TService);
    /**
     * Called when the component is mounted (after first render).
     * Override to perform setup tasks.
     */
    onMount(): void | Promise<void>;
    /**
     * Called when the component is about to unmount.
     * Override to perform cleanup tasks.
     */
    onUnmount(): void;
    /**
     * Handle keypress events.
     * Override to handle custom keyboard input.
     *
     * @param key - The keypress event
     * @returns true if the event was handled, false/void otherwise
     */
    onKeypress(key: KeypressEvent): boolean | void | Promise<boolean | void>;
    /**
     * Request a re-render of the component.
     * Call this when state changes and UI needs to update.
     */
    protected redraw(): void;
    /**
     * Close the component and return from run().
     */
    protected close(): void;
    /**
     * Pause keyboard handling.
     * Useful before showing modals or dialogs.
     */
    protected pauseKeyboard(): void;
    /**
     * Resume keyboard handling.
     * Call after modals or dialogs close.
     */
    protected resumeKeyboard(): void;
    /**
     * Run the component.
     * This displays the component and waits for it to close.
     *
     * @returns Promise that resolves when the component closes
     */
    run(): Promise<void>;
}
//# sourceMappingURL=component.d.ts.map