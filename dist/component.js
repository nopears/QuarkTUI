/**
 * QuarkTUI - Component
 *
 * Base class for all UI components.
 * Handles lifecycle, keyboard input, and rendering via the widget system.
 */
import { createWindow } from "./window";
import { render } from "./renderer";
// =============================================================================
// Base Component Class
// =============================================================================
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
export class Component {
    /** Service instance injected via constructor */
    service;
    /** Window actions - available after mount */
    actions = null;
    // ===========================================================================
    // Constructor
    // ===========================================================================
    /**
     * Create a new component instance.
     *
     * @param service - Service instance for business logic
     */
    constructor(service) {
        this.service = service;
    }
    // ===========================================================================
    // Lifecycle Hooks (optional overrides)
    // ===========================================================================
    /**
     * Called when the component is mounted (after first render).
     * Override to perform setup tasks.
     */
    onMount() { }
    /**
     * Called when the component is about to unmount.
     * Override to perform cleanup tasks.
     */
    onUnmount() { }
    /**
     * Handle keypress events.
     * Override to handle custom keyboard input.
     *
     * @param key - The keypress event
     * @returns true if the event was handled, false/void otherwise
     */
    onKeypress(key) {
        return false;
    }
    // ===========================================================================
    // Protected Methods (available to subclasses)
    // ===========================================================================
    /**
     * Request a re-render of the component.
     * Call this when state changes and UI needs to update.
     */
    redraw() {
        if (this.actions) {
            this.actions.redraw();
        }
    }
    /**
     * Close the component and return from run().
     */
    close() {
        if (this.actions) {
            this.actions.close();
        }
    }
    /**
     * Pause keyboard handling.
     * Useful before showing modals or dialogs.
     */
    pauseKeyboard() {
        if (this.actions) {
            this.actions.pauseKeyboard();
        }
    }
    /**
     * Resume keyboard handling.
     * Call after modals or dialogs close.
     */
    resumeKeyboard() {
        if (this.actions) {
            this.actions.resumeKeyboard();
        }
    }
    // ===========================================================================
    // Public Methods
    // ===========================================================================
    /**
     * Run the component.
     * This displays the component and waits for it to close.
     *
     * @returns Promise that resolves when the component closes
     */
    async run() {
        const windowConfig = {
            title: this.config.title,
            subtitle: this.config.subtitle,
            description: this.config.description,
            hints: this.config.hints,
            helpContent: this.config.helpContent,
            centerContent: this.config.centerContent ?? true,
            onRender: (ctx) => {
                const widgets = this.render(ctx);
                return render(widgets, ctx);
            },
            onKeypress: async (key, actions) => {
                return this.onKeypress(key);
            },
            onMount: async (actions) => {
                this.actions = actions;
                await this.onMount();
            },
            onUnmount: () => {
                this.onUnmount();
                this.actions = null;
            },
        };
        await createWindow(windowConfig).run();
    }
}
//# sourceMappingURL=component.js.map