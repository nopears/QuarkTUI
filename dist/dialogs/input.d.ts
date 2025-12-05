/**
 * QuarkTUI - Text Input Dialog
 *
 * A text input dialog with validation support, placeholder text,
 * and customizable styling.
 */
import type { TextInputOptions, TextInputResult } from "../types/menu";
export type { TextInputOptions, TextInputResult };
/**
 * Extended options for text input with additional customization.
 */
export interface TextInputConfig extends TextInputOptions {
    /** Custom header renderer */
    renderHeader?: (innerWidth: number) => void;
    /** Custom footer renderer */
    renderFooter?: (innerWidth: number) => void;
    /** Whether to mask input (for passwords) */
    maskInput?: boolean;
    /** Character to use for masking (default: •) */
    maskChar?: string;
}
/**
 * Display a text input dialog and wait for user input.
 *
 * @param options - Input configuration
 * @returns The submitted value or cancelled result
 *
 * @example
 * ```ts
 * const result = await textInput({
 *   title: "Enter your name",
 *   placeholder: "John Doe",
 *   validate: (value) => {
 *     if (value.length < 2) return "Name must be at least 2 characters";
 *     return null;
 *   },
 * });
 *
 * if (result.type === "submitted") {
 *   console.log("Name:", result.value);
 * }
 * ```
 */
export declare function textInput(options: TextInputOptions | TextInputConfig): Promise<TextInputResult>;
/**
 * Display a password input dialog (masked input).
 *
 * @param options - Input configuration (maskInput is automatically set to true)
 * @returns The submitted value or cancelled result
 */
export declare function passwordInput(options: Omit<TextInputOptions, "maskInput">): Promise<TextInputResult>;
//# sourceMappingURL=input.d.ts.map