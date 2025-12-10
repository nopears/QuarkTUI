/**
 * QuarkTUI - File Picker
 *
 * A generic file browser/picker dialog for selecting files.
 * Supports filtering by extension, custom icons, and navigation.
 */
import type { Stats } from "node:fs";
/**
 * Options for configuring the file picker.
 */
export interface FilePickerOptions {
    /** Starting directory (default: current working directory) */
    startDir?: string;
    /** Title displayed at the top of the picker */
    title?: string;
    /** Filter function - return true to include the file */
    filter?: (filename: string, stats: Stats) => boolean;
    /** Simple extension filter (alternative to filter function) */
    extensions?: string[];
    /** Whether to show hidden files (starting with .) */
    showHidden?: boolean;
    /** Custom icons */
    icons?: {
        folder?: string;
        folderOpen?: string;
        file?: string;
        /** Icons for specific file types by extension */
        byExtension?: Record<string, string>;
    };
    /** Custom labels */
    labels?: {
        cancel?: string;
        parentDir?: string;
    };
    /** Maximum path length to display before truncating */
    maxPathLength?: number;
}
/**
 * Display a file picker dialog and wait for user selection.
 *
 * @param options - File picker configuration
 * @returns The selected file path, or null if cancelled
 *
 * @example
 * ```ts
 * // Simple file picker
 * const file = await pickFile();
 *
 * // With extension filter
 * const audioFile = await pickFile({
 *   title: "Select an audio file",
 *   extensions: [".mp3", ".wav", ".flac"],
 * });
 *
 * // With custom filter
 * const largeFile = await pickFile({
 *   title: "Select a large file",
 *   filter: (name, stats) => stats.size > 1024 * 1024,
 * });
 * ```
 */
export declare function pickFile(options?: FilePickerOptions): Promise<string | null>;
/**
 * Display a file picker that only shows files matching certain extensions.
 * Convenience wrapper around pickFile.
 *
 * @param extensions - File extensions to filter by (e.g., [".txt", ".md"])
 * @param options - Additional file picker options
 * @returns The selected file path, or null if cancelled
 */
export declare function pickFileByExtension(extensions: string[], options?: Omit<FilePickerOptions, "extensions" | "filter">): Promise<string | null>;
//# sourceMappingURL=filePicker.d.ts.map