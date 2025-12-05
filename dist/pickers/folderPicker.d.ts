/**
 * QuarkTUI - Folder Picker
 *
 * A generic folder browser/picker dialog for selecting directories.
 * Supports navigation, folder selection, and customizable styling.
 */
import type { Stats } from "node:fs";
/**
 * Options for configuring the folder picker.
 */
export interface FolderPickerOptions {
    /** Starting directory (default: current working directory) */
    startDir?: string;
    /** Title displayed at the top of the picker */
    title?: string;
    /** Filter function - return true to include the folder */
    filter?: (dirname: string, stats: Stats) => boolean;
    /** Whether to show hidden folders (starting with .) */
    showHidden?: boolean;
    /** Custom icons */
    icons?: {
        folder?: string;
        folderOpen?: string;
        select?: string;
    };
    /** Custom labels */
    labels?: {
        cancel?: string;
        parentDir?: string;
        selectFolder?: string;
    };
    /** Maximum path length to display before truncating */
    maxPathLength?: number;
}
/**
 * Display a folder picker dialog and wait for user selection.
 *
 * @param options - Folder picker configuration
 * @returns The selected folder path, or null if cancelled
 *
 * @example
 * ```ts
 * // Simple folder picker
 * const folder = await pickFolder();
 *
 * // With custom starting directory
 * const downloadFolder = await pickFolder({
 *   title: "Select download location",
 *   startDir: "~/Downloads",
 * });
 *
 * // With custom filter
 * const gitRepo = await pickFolder({
 *   title: "Select a git repository",
 *   filter: async (name) => {
 *     // Could check for .git folder existence
 *     return true;
 *   },
 * });
 * ```
 */
export declare function pickFolder(options?: FolderPickerOptions): Promise<string | null>;
/**
 * Display a folder picker starting from the user's home directory.
 * Convenience wrapper around pickFolder.
 *
 * @param options - Additional folder picker options
 * @returns The selected folder path, or null if cancelled
 */
export declare function pickFolderFromHome(options?: Omit<FolderPickerOptions, "startDir">): Promise<string | null>;
//# sourceMappingURL=folderPicker.d.ts.map