/**
 * QuarkTUI - Folder Picker
 *
 * A generic folder browser/picker dialog for selecting directories.
 * Supports navigation, folder selection, and customizable styling.
 */

import path from "node:path";
import { readdir, stat } from "node:fs/promises";
import type { Stats } from "node:fs";
import { selectMenu } from "../dialogs/select";
import { style } from "../core/style";

// =============================================================================
// Types
// =============================================================================

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
 * Entry type in the folder picker.
 */
type EntryType = "dir" | "up" | "select";

/**
 * Internal representation of a directory entry.
 */
interface FolderEntry {
  label: string;
  value: string;
  type: EntryType;
  hint?: string;
}

// =============================================================================
// Default Configuration
// =============================================================================

const DEFAULT_ICONS = {
  folder: "📁",
  folderOpen: "📂",
  select: "✓",
};

const DEFAULT_LABELS = {
  cancel: "Cancel",
  parentDir: "parent directory",
  selectFolder: "Select this folder",
};

const DEFAULT_MAX_PATH_LENGTH = 45;

// =============================================================================
// Helpers
// =============================================================================

/**
 * Truncate a path if it's too long.
 */
function truncatePath(dirPath: string, maxLen: number): string {
  if (dirPath.length <= maxLen) return dirPath;

  const parts = dirPath.split(path.sep);
  if (parts.length <= 2) return "..." + dirPath.slice(-maxLen + 3);

  const lastPart = parts[parts.length - 1];
  if (!lastPart) return "..." + dirPath.slice(-maxLen + 3);

  let result = lastPart;
  let i = parts.length - 2;

  while (i >= 0) {
    const part = parts[i];
    if (!part || result.length + part.length + 4 >= maxLen) break;
    result = path.join(part, result);
    i--;
  }

  return ".../" + result;
}

/**
 * List folder entries for navigation.
 */
async function listFolderEntries(
  currentDir: string,
  options: FolderPickerOptions,
): Promise<FolderEntry[]> {
  const entries: FolderEntry[] = [];
  const icons = { ...DEFAULT_ICONS, ...options.icons };
  const labels = { ...DEFAULT_LABELS, ...options.labels };

  // Add option to select current folder
  entries.push({
    label: style(`${icons.select} ${labels.selectFolder}`, "success"),
    value: "__SELECT__",
    type: "select",
  });

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
  let dirItems: string[];
  try {
    dirItems = await readdir(currentDir);
  } catch {
    return entries;
  }

  const dirs: FolderEntry[] = [];

  for (const name of dirItems) {
    // Skip hidden files unless showHidden is true
    if (!options.showHidden && name.startsWith(".")) continue;

    const fullPath = path.join(currentDir, name);
    let fileStat: Stats;
    try {
      fileStat = await stat(fullPath);
    } catch {
      continue;
    }

    if (fileStat.isDirectory()) {
      // Apply filtering
      let includeFolder = true;

      if (options.filter) {
        includeFolder = options.filter(name, fileStat);
      }

      if (includeFolder) {
        dirs.push({
          label: `${icons.folder} ${name}`,
          value: fullPath,
          type: "dir",
        });
      }
    }
  }

  // Sort alphabetically
  dirs.sort((a, b) => a.label.localeCompare(b.label));

  entries.push(...dirs);

  return entries;
}

// =============================================================================
// Main Function
// =============================================================================

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
export async function pickFolder(
  options: FolderPickerOptions = {},
): Promise<string | null> {
  const title = options.title ?? "Select a folder";
  const maxPathLen = options.maxPathLength ?? DEFAULT_MAX_PATH_LENGTH;
  const labels = { ...DEFAULT_LABELS, ...options.labels };

  let currentDir = path.resolve(options.startDir ?? process.cwd());

  while (true) {
    const entries = await listFolderEntries(currentDir, options);
    const displayPath = truncatePath(currentDir, maxPathLen);

    // Count subdirectories
    const dirCount = entries.filter((e) => e.type === "dir").length;

    // Build info lines
    const infoLines = [
      `${style("Location:", "dim")} ${displayPath}`,
      dirCount > 0
        ? `${style("Subfolders:", "dim")} ${dirCount}`
        : style("No subfolders", "dim"),
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

    // Handle folder selection
    if (result.value === "__SELECT__") {
      return currentDir;
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
    if (!selected) continue;

    // Handle directory navigation
    if (selected.type === "dir") {
      currentDir = selected.value;
      continue;
    }
  }
}

/**
 * Display a folder picker starting from the user's home directory.
 * Convenience wrapper around pickFolder.
 *
 * @param options - Additional folder picker options
 * @returns The selected folder path, or null if cancelled
 */
export async function pickFolderFromHome(
  options: Omit<FolderPickerOptions, "startDir"> = {},
): Promise<string | null> {
  const homeDir = process.env.HOME ?? process.env.USERPROFILE ?? process.cwd();
  return pickFolder({ ...options, startDir: homeDir });
}
