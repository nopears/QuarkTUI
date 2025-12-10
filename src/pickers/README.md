# QuarkTUI Pickers Module

File system selection dialogs for choosing files and folders.

## Import

```typescript
import {
  pickFile,
  pickFileByExtension,
  pickFolder,
  pickFolderFromHome,
  type FilePickerOptions,
  type FolderPickerOptions,
} from "quarktui/pickers";
```

## Features

### File Picker
- Browse directory structure
- Filter by extension or custom function
- Show/hide hidden files
- Custom icons for file types
- Display file counts and location

### Folder Picker
- Browse and select folders
- Start from any directory
- Convenient home directory picker

## Common Tasks

### Pick a file
```typescript
import { pickFile } from "quarktui/pickers";

const file = await pickFile({
  title: "Select a file",
  startDir: process.cwd(),
});

if (file) {
  console.log("Selected:", file);
}
```

### Pick with extension filter
```typescript
import { pickFile } from "quarktui/pickers";

const audioFile = await pickFile({
  title: "Select an audio file",
  extensions: [".mp3", ".wav", ".flac"],
});
```

### Pick with custom filter
```typescript
import { pickFile } from "quarktui/pickers";

const largeFile = await pickFile({
  title: "Select a large file",
  filter: (name, stats) => stats.size > 1024 * 1024,
});
```

### Pick with custom icons
```typescript
import { pickFile } from "quarktui/pickers";

const file = await pickFile({
  title: "Select a file",
  icons: {
    byExtension: {
      ".mp3": "🎧",
      ".txt": "📄",
      ".pdf": "📕",
    },
  },
});
```

### Pick a folder
```typescript
import { pickFolder } from "quarktui/pickers";

const folder = await pickFolder({
  title: "Select a folder",
  startDir: process.cwd(),
});

if (folder) {
  console.log("Selected:", folder);
}
```

### Pick from home directory
```typescript
import { pickFolderFromHome } from "quarktui/pickers";

const folder = await pickFolderFromHome({
  title: "Select a folder",
});
```

## File Type Icons

The file picker includes default icons for 40+ file types:

- **Documents**: PDF, Word, Text, Markdown
- **Spreadsheets**: Excel, CSV
- **Images**: JPG, PNG, GIF, SVG, WebP
- **Audio**: MP3, WAV, FLAC, AAC, OGG
- **Video**: MP4, AVI, MKV, MOV, WebM
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Code**: JavaScript, TypeScript, Python, Java, Go, Rust, Ruby, PHP, HTML, CSS, JSON, YAML, Shell
- **Executables**: EXE, APP, DMG

Override any icon via `icons.byExtension` option.

## API Reference

See the main [README.md](../../README.md) for complete API documentation.
