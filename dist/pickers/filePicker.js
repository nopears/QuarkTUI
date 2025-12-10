/**
 * QuarkTUI - File Picker
 *
 * A generic file browser/picker dialog for selecting files.
 * Supports filtering by extension, custom icons, and navigation.
 */
import path from "node:path";
import { readdir, stat } from "node:fs/promises";
import { selectMenu } from "../dialogs/select";
import { style } from "../core/style";
// =============================================================================
// Default Configuration
// =============================================================================
const DEFAULT_ICONS = {
    folder: "📁",
    folderOpen: "📂",
    file: "📄",
    byExtension: {
        // Documents
        ".pdf": "📕",
        ".doc": "📘",
        ".docx": "📘",
        ".txt": "📝",
        ".md": "📝",
        ".rtf": "📄",
        // Spreadsheets
        ".xls": "📊",
        ".xlsx": "📊",
        ".csv": "📊",
        // Images
        ".jpg": "🖼️",
        ".jpeg": "🖼️",
        ".png": "🖼️",
        ".gif": "🖼️",
        ".svg": "🖼️",
        ".bmp": "🖼️",
        ".webp": "🖼️",
        // Audio
        ".mp3": "🎵",
        ".wav": "🎵",
        ".flac": "🎵",
        ".aac": "🎵",
        ".m4a": "🎵",
        ".ogg": "🎵",
        // Video
        ".mp4": "🎬",
        ".avi": "🎬",
        ".mkv": "🎬",
        ".mov": "🎬",
        ".wmv": "🎬",
        ".flv": "🎬",
        ".webm": "🎬",
        // Archives
        ".zip": "📦",
        ".rar": "📦",
        ".7z": "📦",
        ".tar": "📦",
        ".gz": "📦",
        // Code
        ".js": "📜",
        ".ts": "📜",
        ".jsx": "📜",
        ".tsx": "📜",
        ".py": "🐍",
        ".java": "☕",
        ".cpp": "⚙️",
        ".c": "⚙️",
        ".go": "🐹",
        ".rs": "🦀",
        ".rb": "💎",
        ".php": "🐘",
        ".html": "🌐",
        ".css": "🎨",
        ".json": "📋",
        ".xml": "📋",
        ".yaml": "📋",
        ".yml": "📋",
        ".toml": "📋",
        ".sh": "🔧",
        ".bash": "🔧",
        ".zsh": "🔧",
        // Executables
        ".exe": "⚡",
        ".app": "⚡",
        ".dmg": "⚡",
    },
};
const DEFAULT_LABELS = {
    cancel: "Cancel",
    parentDir: "parent directory",
};
const DEFAULT_MAX_PATH_LENGTH = 45;
// =============================================================================
// Helpers
// =============================================================================
/**
 * Truncate a path if it's too long.
 */
function truncatePath(dirPath, maxLen) {
    if (dirPath.length <= maxLen)
        return dirPath;
    const parts = dirPath.split(path.sep);
    if (parts.length <= 2)
        return "..." + dirPath.slice(-maxLen + 3);
    const lastPart = parts[parts.length - 1];
    if (!lastPart)
        return "..." + dirPath.slice(-maxLen + 3);
    let result = lastPart;
    let i = parts.length - 2;
    while (i >= 0) {
        const part = parts[i];
        if (!part || result.length + part.length + 4 >= maxLen)
            break;
        result = path.join(part, result);
        i--;
    }
    return ".../" + result;
}
/**
 * Get file extension for hint display.
 */
function getExtension(filename) {
    const ext = path.extname(filename).slice(1).toUpperCase();
    return ext || "FILE";
}
/**
 * Get the appropriate icon for a file based on its extension.
 */
function getFileIcon(filename, defaultIcon, extensionIcons) {
    const ext = path.extname(filename).toLowerCase();
    if (extensionIcons && ext in extensionIcons) {
        return extensionIcons[ext];
    }
    return defaultIcon;
}
/**
 * Check if a file matches the extension filter.
 */
function matchesExtensions(filename, extensions) {
    const lower = filename.toLowerCase();
    return extensions.some((ext) => {
        const normalizedExt = ext.startsWith(".") ? ext : `.${ext}`;
        return lower.endsWith(normalizedExt.toLowerCase());
    });
}
/**
 * List directory entries with filtering.
 */
async function listDirectoryEntries(currentDir, options) {
    const entries = [];
    const icons = { ...DEFAULT_ICONS, ...options.icons };
    const labels = { ...DEFAULT_LABELS, ...options.labels };
    // Add parent directory option
    const parent = path.dirname(currentDir);
    if (parent !== currentDir) {
        entries.push({
            label: `${icons.folderOpen} ..`,
            value: "__UP__",
            type: "up",
            hint: labels.parentDir,
        });
    }
    // Read directory contents
    let dirItems;
    try {
        dirItems = await readdir(currentDir);
    }
    catch {
        return entries;
    }
    const dirs = [];
    const files = [];
    for (const name of dirItems) {
        // Skip hidden files unless showHidden is true
        if (!options.showHidden && name.startsWith("."))
            continue;
        const fullPath = path.join(currentDir, name);
        let fileStat;
        try {
            fileStat = await stat(fullPath);
        }
        catch {
            continue;
        }
        if (fileStat.isDirectory()) {
            dirs.push({
                label: `${icons.folder} ${name}`,
                value: fullPath,
                type: "dir",
            });
        }
        else if (fileStat.isFile()) {
            // Apply filtering
            let includeFile = true;
            if (options.filter) {
                includeFile = options.filter(name, fileStat);
            }
            else if (options.extensions && options.extensions.length > 0) {
                includeFile = matchesExtensions(name, options.extensions);
            }
            if (includeFile) {
                const fileIcon = getFileIcon(name, icons.file, icons.byExtension);
                files.push({
                    label: `${fileIcon} ${name}`,
                    value: fullPath,
                    type: "file",
                    hint: getExtension(name),
                });
            }
        }
    }
    // Sort alphabetically
    dirs.sort((a, b) => a.label.localeCompare(b.label));
    files.sort((a, b) => a.label.localeCompare(b.label));
    entries.push(...dirs, ...files);
    return entries;
}
// =============================================================================
// Main Function
// =============================================================================
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
export async function pickFile(options = {}) {
    const title = options.title ?? "Select a file";
    const maxPathLen = options.maxPathLength ?? DEFAULT_MAX_PATH_LENGTH;
    const labels = { ...DEFAULT_LABELS, ...options.labels };
    let currentDir = path.resolve(options.startDir ?? process.cwd());
    while (true) {
        const entries = await listDirectoryEntries(currentDir, options);
        const displayPath = truncatePath(currentDir, maxPathLen);
        // Count files and directories
        const fileCount = entries.filter((e) => e.type === "file").length;
        const dirCount = entries.filter((e) => e.type === "dir").length;
        // Build info lines
        const infoParts = [];
        if (dirCount > 0) {
            infoParts.push(`${dirCount} folder${dirCount !== 1 ? "s" : ""}`);
        }
        if (fileCount > 0) {
            infoParts.push(`${fileCount} file${fileCount !== 1 ? "s" : ""}`);
        }
        const infoLines = [
            `${style("Location:", "dim")} ${displayPath}`,
            infoParts.length > 0
                ? `${style("Contents:", "dim")} ${infoParts.join(", ")}`
                : style("Empty directory", "dim"),
        ];
        // Build menu options
        const menuOptions = [
            ...entries.map((e) => ({
                label: e.label,
                value: e.value,
                hint: e.hint,
            })),
            { label: `❌ ${labels.cancel}`, value: "__CANCEL__" },
        ];
        const result = await selectMenu({
            title,
            options: menuOptions,
            infoLines,
        });
        // Handle cancellation
        if (result.type === "cancelled" || result.value === "__CANCEL__") {
            return null;
        }
        // Handle navigation up
        if (result.value === "__UP__") {
            const parent = path.dirname(currentDir);
            if (parent !== currentDir) {
                currentDir = parent;
            }
            continue;
        }
        // Find the selected entry
        const selected = entries.find((e) => e.value === result.value);
        if (!selected)
            continue;
        // Handle directory navigation
        if (selected.type === "dir") {
            currentDir = selected.value;
            continue;
        }
        // Handle file selection
        if (selected.type === "file") {
            return selected.value;
        }
    }
}
/**
 * Display a file picker that only shows files matching certain extensions.
 * Convenience wrapper around pickFile.
 *
 * @param extensions - File extensions to filter by (e.g., [".txt", ".md"])
 * @param options - Additional file picker options
 * @returns The selected file path, or null if cancelled
 */
export async function pickFileByExtension(extensions, options = {}) {
    return pickFile({ ...options, extensions });
}
//# sourceMappingURL=filePicker.js.map