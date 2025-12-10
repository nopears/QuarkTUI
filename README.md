# QuarkTUI

A lightweight TUI (Terminal User Interface) component framework for building interactive terminal applications with TypeScript.

## Features

- **Component System** - Build reusable UI components with lifecycle hooks
- **Widget Primitives** - Text, Row, Spacer, Table widgets for layout
- **Dialogs** - Select menus, text input, confirmations, messages, spinners, help screens
- **Pickers** - File and folder selection dialogs
- **Theming** - Customizable color themes with ANSI color support
- **Keyboard Handling** - Raw mode keyboard input with key detection utilities
- **Drawing Primitives** - Box drawing, borders, and layout helpers
- **Consistent Sizing** - All components use unified frame dimensions

## Installation

```bash
npm install quarktui
```

## Quick Start

```typescript
import {
  Component,
  Text,
  Spacer,
  type RenderContext,
  type Widget,
} from "quarktui";

class HelloComponent extends Component<null> {
  readonly config = {
    title: "Hello World",
    hints: ["q/⌫ Back"],
  };

  render(ctx: RenderContext): Widget[] {
    return [
      Text("Welcome to QuarkTUI!", { style: "bold" }),
      Spacer(),
      Text("Press q to exit", { style: "dim" }),
    ];
  }
}

// Run the component
const component = new HelloComponent(null);
await component.run();
```

## Table of Contents

- [Components](#components)
- [Widgets](#widgets)
- [Dialogs](#dialogs)
- [Pickers](#pickers)
- [Theming](#theming)
- [Keyboard Handling](#keyboard-handling)
- [Drawing Primitives](#drawing-primitives)
- [Layout Configuration](#layout-configuration)
- [API Reference](#api-reference)

---

## Components

Components are the building blocks of QuarkTUI applications. Extend the `Component` base class to create interactive screens.

### Basic Component

```typescript
import { Component, Text, type RenderContext, type Widget } from "quarktui";

class MyService {
  getData(): string {
    return "Hello from service!";
  }
}

class MyComponent extends Component<MyService> {
  readonly config = {
    title: "♪ MY APP",
    subtitle: "Dashboard",
    description: "A simple example component",
    hints: ["Space Action", "↑↓ Navigate", "q/⌫ Back"],
    helpContent: {
      title: "Help",
      sections: [
        {
          heading: "Overview",
          lines: ["This is a help section."],
        },
      ],
    },
    centerContent: true,
  };

  render(ctx: RenderContext): Widget[] {
    const message = this.service.getData();
    return [Text(message)];
  }
}

// Usage
const service = new MyService();
const component = new MyComponent(service);
await component.run();
```

### Component Configuration

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Window title displayed in the header |
| `subtitle` | `string?` | Optional subtitle next to title (dimmed) |
| `description` | `string?` | Optional description below title |
| `hints` | `string[]` | Keyboard hints shown in footer |
| `helpContent` | `HelpContent?` | Help content shown when `?` is pressed |
| `centerContent` | `boolean?` | Center content horizontally (default: true) |

### Lifecycle Hooks

```typescript
class MyComponent extends Component<MyService> {
  // Called after first render
  onMount(): void {
    console.log("Component mounted");
  }

  // Called before cleanup
  onUnmount(): void {
    console.log("Component unmounting");
  }

  // Handle keyboard input
  onKeypress(key: KeypressEvent): boolean | void {
    if (key.name === "space") {
      // Handle space key
      this.redraw(); // Trigger re-render
      return true; // Event handled
    }
    return false; // Let default handlers process
  }
}
```

### Protected Methods

| Method | Description |
|--------|-------------|
| `redraw()` | Request a re-render of the component |
| `close()` | Close the component and return from `run()` |
| `pauseKeyboard()` | Pause keyboard handling (before showing dialogs) |
| `resumeKeyboard()` | Resume keyboard handling (after dialogs close) |

---

## Widgets

Widgets are the primitives used to build component UIs.

### Text

Display styled text.

```typescript
import { Text } from "quarktui";

// Simple text
Text("Hello World")

// With alignment
Text("Centered text", { align: "center" })
Text("Right-aligned", { align: "right" })

// With style
Text("Bold text", { style: "bold" })
Text("Dimmed text", { style: "dim" })
Text("Colored text", { style: "success" })
```

**Options:**
- `align`: `"left"` | `"center"` | `"right"` (default: `"left"`)
- `style`: `StyleType` - Any valid style type

### Spacer

Add vertical spacing.

```typescript
import { Spacer } from "quarktui";

// Single empty line
Spacer()

// Multiple empty lines
Spacer({ lines: 3 })
```

### Row

Display multiple items on a single line.

```typescript
import { Row } from "quarktui";

// Simple row
Row(["Left", "Middle", "Right"])

// With separator
Row(["Item 1", "Item 2", "Item 3"], { separator: " | " })

// With alignment
Row(["Centered row"], { align: "center" })
```

### Table

Display tabular data.

```typescript
import { Table, type TableColumn, type TableCell } from "quarktui";

const columns: TableColumn[] = [
  { header: "Name", width: 20, align: "left" },
  { header: "Value", width: 10, align: "right" },
];

const rows: TableCell[][] = [
  [{ text: "Item 1" }, { text: "100", style: "success" }],
  [{ text: "Item 2" }, { text: "200", style: "warning" }],
];

Table({ columns, rows, align: "center" })
```

### ProgressBar

Display a visual progress indicator.

```typescript
import { ProgressBar, Progress } from "quarktui";

// Simple progress bar (50%)
ProgressBar({ value: 0.5 })

// With value display (50/100)
ProgressBar({ value: 50, max: 100, showValue: true })

// Different styles: "block" | "line" | "ascii" | "dots" | "gradient" | "audio"
ProgressBar({ value: 0.75, style: "line" })

// Audio player style with position indicator
ProgressBar({
  value: 45,
  max: 100,
  style: "audio",
  label: "Now Playing",
  labelPosition: "left",
  valuePosition: "right",
})

// Label on left, percentage on right
ProgressBar({
  value: 3,
  max: 10,
  style: "ascii",
  label: "Loading",
  labelPosition: "left",
  valuePosition: "right",
})

// Percentage on left, label on right
ProgressBar({
  value: 0.5,
  label: "Status",
  labelPosition: "right",
  valuePosition: "left",
})

// Custom width and centered
ProgressBar({
  value: 0.33,
  width: 40,
  align: "center",
  label: "Loading...",
})

// Custom characters
ProgressBar({
  value: 0.6,
  chars: { filled: "▓", empty: "░", left: "[", right: "]" },
})

// Shorthand for simple progress
Progress(0.5)           // 50% with block style
Progress(0.75, "line")  // 75% with line style
```

**Options:**
- `value`: Progress value (0 to 1, or 0 to max)
- `max`: Maximum value (default: 1)
- `width`: Bar width in characters (default: auto-fill)
- `style`: Visual style - `"block"`, `"line"`, `"ascii"`, `"dots"`, `"gradient"`, `"audio"`
- `showPercentage`: Show percentage label (default: true)
- `showValue`: Show value label (e.g., "50/100")
- `label`: Custom label text
- `labelPosition`: Position for custom label - `"left"`, `"right"`, `"inside"`, `"none"` (default: `"none"`)
- `valuePosition`: Position for percentage/value display - `"left"`, `"right"`, `"inside"`, `"none"` (default: `"right"`)
- `align`: Horizontal alignment
- `filledColor`: Custom color for filled portion
- `emptyColor`: Custom color for empty portion
- `chars`: Custom character set
- `valuePosition`: Position for percentage/value display - `"left"`, `"right"`, `"inside"`, `"none"` (default: `"right"`)
- `align`: Horizontal alignment
- `filledColor`: Custom color for filled portion
- `emptyColor`: Custom color for empty portion
- `chars`: Custom character set

### List

Display lists with various marker styles.

```typescript
import { List, BulletList, NumberedList, CheckboxList } from "quarktui";

// Simple bullet list from array
List(["Item 1", "Item 2", "Item 3"])

// Numbered list
List({
  items: ["First", "Second", "Third"],
  style: "numbered",
})

// Checkbox list with checked items
List({
  items: [
    { text: "Complete task", checked: true },
    { text: "Pending task", checked: false },
    { text: "Another task" },
  ],
  style: "checkbox",
})

// Styled items with different colors
List({
  items: [
    { text: "Success!", style: "success" },
    { text: "Warning!", style: "warning" },
    { text: "Error!", style: "error" },
  ],
  style: "arrow",
})

// Scrollable list with selection highlighting
List({
  items: longArray,
  selectedIndex: 2,
  maxVisible: 5,
  scrollOffset: 0,
})

// Shorthand functions
BulletList(["Apple", "Banana", "Cherry"])
NumberedList(["First", "Second", "Third"])
CheckboxList([
  { text: "Done", checked: true },
  { text: "Pending" },
])
```

**Styles:** `"bullet"` (•), `"numbered"` (1.), `"dash"` (-), `"arrow"` (›), `"check"` (✓), `"checkbox"` (☐/☑), `"none"`

**Options:**
- `items`: Array of strings or `{ text, style?, checked?, marker? }` objects
- `style`: Marker style (default: `"bullet"`)
- `align`: Horizontal alignment
- `indent`: Spaces before marker (default: 0)
- `gap`: Space between marker and text (default: 1)
- `selectedIndex`: Index of highlighted item
- `selectedMarker`: Marker for selected item (default: `"❯"`)
- `selectedStyle`: Style for selected item text
- `maxVisible`: Max items shown (enables scrolling)
- `scrollOffset`: Current scroll position
- `showScrollIndicators`: Show ↑/↓ when clipped (default: true)
- `startNumber`: Starting number for numbered lists (default: 1)

### Divider

Horizontal separator line with optional label.

```typescript
import { Divider, HR } from "quarktui";

// Simple horizontal line
Divider()

// Divider with centered label
Divider("Section Title")

// Divider with custom style
Divider({
  style: "double",
  label: "Important",
  labelStyle: "bold",
})

// Dashed divider with left-aligned label
Divider({
  style: "dashed",
  label: "Options",
  labelAlign: "left",
  labelStyle: ["bold", "warning"],
})

// Custom character divider
Divider({ char: "·", lineStyle: "dim" })

// Shorthand for simple line
HR()           // Simple line
HR("double")   // Double line ═══
HR("dashed")   // Dashed line ╌╌╌
```

**Styles:** `"line"` (─), `"double"` (═), `"thick"` (━), `"dashed"` (╌), `"dotted"` (┄), `"space"`

**Options:**
- `style`: Line style (default: `"line"`)
- `label`: Optional text label
- `labelAlign`: Label position - `"left"`, `"center"`, `"right"`
- `labelStyle`: Style(s) for the label
- `lineStyle`: Style(s) for the line (default: `"dim"`)
- `labelPadding`: Space around label (default: 1)
- `char`: Custom line character
- `width`: Fixed width (default: full width)
- `margin`: Left/right margin (default: 0)

### Columns

Multi-column layout with flexible widths.

```typescript
import { Columns, KeyValue } from "quarktui";

// Simple two-column layout
Columns(["Left content", "Right content"])

// Three equal columns
Columns({
  columns: ["Column 1", "Column 2", "Column 3"],
  gap: 4,
})

// Fixed and flexible widths
Columns({
  columns: [
    { content: "Label:", width: 10, align: "right" },
    { content: "Value here", width: "flex" },
  ],
})

// Percentage widths
Columns({
  columns: [
    { content: "Sidebar", width: "30%" },
    { content: "Main content", width: "70%" },
  ],
})

// Auto-width (fit content)
Columns({
  columns: [
    { content: "ID", width: "auto" },
    { content: "Description", width: "flex" },
    { content: "Status", width: "auto" },
  ],
})

// Styled columns
Columns({
  columns: [
    { content: "Name", style: "bold" },
    { content: "Active", style: "success", align: "center" },
  ],
})

// Key-value shorthand
KeyValue("Name:", "John Doe")
KeyValue("Status:", "Active", 15)  // with label width
```

**Width Options:**
- `number` - Fixed width in characters
- `"auto"` - Fit content
- `"flex"` - Take remaining space equally
- `"30%"` - Percentage of available width

**Options:**
- `columns`: Array of column definitions or strings
- `gap`: Space between columns (default: 2)
- `align`: Horizontal alignment of entire row
- `defaultWidth`: Default column width (default: `"flex"`)
- `minWidth`: Minimum column width (default: 1)

### Box / Panel

Container widget with borders, titles, and footers.

```typescript
import { Box, Panel, InfoBox, WarningBox, ErrorBox, SuccessBox } from "quarktui";

// Simple box with content
Box("Hello, World!")

// Box with title
Box({
  content: "This is the content",
  title: "My Box",
})

// Box with title and footer
Box({
  content: ["Line 1", "Line 2", "Line 3"],
  title: "Information",
  footer: "Press Enter to continue",
  style: "double",
})

// Styled box with custom padding
Box({
  content: "Important message!",
  title: "Warning",
  titleStyle: "warning",
  borderStyle: "warning",
  paddingX: 2,
  paddingY: 1,
})

// Centered box with fixed width
Box({
  content: "Centered content",
  width: 40,
  align: "center",
  contentAlign: "center",
})

// Box with nested widgets
Box({
  content: [
    Text("Header", { style: "bold" }),
    Divider(),
    BulletList(["Item 1", "Item 2"]),
  ],
  title: "Widget Box",
})

// Panel shorthand (box with title)
Panel("Settings", "Configure your options here")
Panel("User Info", [
  KeyValue("Name:", "John Doe"),
  KeyValue("Email:", "john@example.com"),
])

// Semantic box helpers
InfoBox("This is helpful information.")
WarningBox("Please proceed with caution.")
ErrorBox("Something went wrong!")
SuccessBox("Operation completed successfully!")
```

**Border Styles:** `"rounded"` | `"sharp"` | `"double"` | `"thick"` | `"dashed"` | `"ascii"` | `"none"`

**Options:**
- `content`: String, Widget, or array of strings/widgets
- `style`: Border style (default: `"rounded"`)
- `title`: Title in top border
- `titleAlign`: Title position (`"left"` | `"center"` | `"right"`)
- `titleStyle`: Style for title text
- `footer`: Footer in bottom border
- `footerAlign`: Footer position
- `footerStyle`: Style for footer text
- `paddingX`: Horizontal padding inside box (default: 1)
- `paddingY`: Vertical padding inside box (default: 0)
- `borderStyle`: Style for border characters
- `width`: Fixed width (default: auto-fit)
- `minWidth`: Minimum width
- `maxWidth`: Maximum width
- `contentAlign`: Alignment of content inside box
- `align`: Alignment of the box itself

---

## Dialogs

Pre-built dialog components for common interactions.

### Select Menu

Display a list of options for selection.

```typescript
import { selectMenu } from "quarktui";

const result = await selectMenu({
  title: "Choose an option",
  options: [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2", hint: "recommended" },
    { label: "Cancel", value: "cancel" },
  ],
});

if (result.type === "selected") {
  console.log("Selected:", result.value);
} else {
  console.log("Cancelled");
}
```

**Options:**
- `title`: Menu title
- `options`: Array of `{ label, value, hint?, disabled? }`
- `selectedIndex`: Initial selected index
- `infoLines`: Additional info lines above options
- `appName`: App name for header
- `subtitle`: Subtitle for header
- `description`: Description below header

### Multi-Select Dialog

Select multiple items from a list with checkbox-style selection.

```typescript
import { multiSelect, quickMultiSelect } from "quarktui";

// Basic multi-select
const result = await multiSelect({
  title: "Select your preferences",
  options: [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b", checked: true },
    { label: "Option C", value: "c" },
    { label: "Disabled", value: "d", disabled: true },
  ],
});

if (result.type === "selected") {
  console.log("Selected:", result.values); // ["a", "b", "c"]
} else {
  console.log("Cancelled");
}

// With min/max constraints
const result2 = await multiSelect({
  title: "Choose 2-4 items",
  options: items,
  minSelections: 2,
  maxSelections: 4,
});

// With app branding
const result3 = await multiSelect({
  title: "Features",
  appName: "♪ LAZYGIG",
  subtitle: "Settings",
  description: "Enable or disable features",
  options: features,
});

// Quick multi-select from strings
const selected = await quickMultiSelect(
  "Choose toppings",
  ["Cheese", "Pepperoni", "Mushrooms", "Olives"],
  [0, 1], // Cheese and Pepperoni pre-selected
);
```

**Keyboard Shortcuts:**
- `↑/↓` - Navigate options
- `Space` - Toggle selection
- `Enter` - Confirm selection
- `a` - Select all
- `n` - Deselect all (none)
- `q/Esc` - Cancel

**Options:**
- `title`: Dialog title
- `options`: Array of `{ label, value, hint?, disabled?, checked? }`
- `focusedIndex`: Initial focused index
- `minSelections`: Minimum selections required (default: 0)
- `maxSelections`: Maximum selections allowed (default: unlimited)
- `infoLines`: Additional info lines above options
- `appName`: App name for header
- `subtitle`: Subtitle for header
- `description`: Description below header

### Text Input

Get text input from user.

```typescript
import { textInput, passwordInput } from "quarktui";

// Regular text input
const result = await textInput({
  title: "Enter your name",
  placeholder: "John Doe",
  initialValue: "",
  maxLength: 50,
  validate: (value) => {
    if (value.length < 2) return "Name must be at least 2 characters";
    return null; // Valid
  },
});

if (result.type === "submitted") {
  console.log("Name:", result.value);
}

// Password input (masked)
const password = await passwordInput({
  title: "Enter password",
});
```

### Confirm Dialog

Yes/No confirmation dialog.

```typescript
import { confirm, confirmYesNo } from "quarktui";

// Full options
const result = await confirm({
  title: "Delete this file?",
  message: "This action cannot be undone.",
  confirmLabel: "Delete",
  cancelLabel: "Keep",
  defaultConfirm: false,
});

if (result.type === "confirmed") {
  // User confirmed
}

// Simple yes/no
const confirmed = await confirmYesNo("Are you sure?");
```

### Message Dialog

Display messages, alerts, and notifications.

```typescript
import { showMessage, showMessageAndWait, info, success, warning, error } from "quarktui";

// Show message without waiting
showMessage("Processing", ["Please wait..."], "info");

// Show message and wait for keypress
await showMessageAndWait("Complete", ["Operation finished."], "success");

// Convenience functions
await info("Info", "This is informational.");
await success("Success", "Operation completed!");
await warning("Warning", "Proceed with caution.");
await error("Error", "Something went wrong.");
```

**Message Types:** `"info"` | `"success"` | `"warning"` | `"error"`

### Spinner

Show loading indicator during async operations.

```typescript
import { showSpinner, withSpinner, SPINNER_DOTS, SPINNER_CIRCLE } from "quarktui";

// Manual control
const spinner = showSpinner("Loading data...");
await fetchData();
spinner.update("Processing...");
await processData();
spinner.stop("Done!");

// With title
const spinner2 = showSpinner({
  message: "Downloading...",
  title: "Please Wait",
  frames: SPINNER_CIRCLE,
  interval: 100,
});

// Automatic control
const data = await withSpinner(
  "Fetching data...",
  () => fetchData(),
  "Data loaded!"
);
```

**Spinner Frames:** `SPINNER_DOTS`, `SPINNER_LINE`, `SPINNER_ARC`, `SPINNER_CIRCLE`, `SPINNER_BOX`, `SPINNER_BOUNCE`, `SPINNER_BAR`

### Help Dialog

Display scrollable help content.

```typescript
import { showHelp, type HelpContent } from "quarktui";

const helpContent: HelpContent = {
  title: "Application Help",
  sections: [
    {
      heading: "Getting Started",
      lines: [
        "Welcome to the application!",
        "Use the arrow keys to navigate.",
      ],
    },
    {
      heading: "Keyboard Shortcuts",
      lines: [
        "Space - Play/Pause",
        "↑/↓   - Adjust volume",
        "q     - Quit",
      ],
    },
  ],
};

await showHelp(helpContent);
```

---

## Pickers

File system selection dialogs.

### File Picker

```typescript
import { pickFile } from "quarktui";

const result = await pickFile({
  title: "Select a file",
  startPath: process.cwd(),
  extensions: [".txt", ".md", ".json"], // Optional filter
});

if (result.type === "selected") {
  console.log("Selected file:", result.path);
}
```

### Folder Picker

```typescript
import { pickFolder } from "quarktui";

const result = await pickFolder({
  title: "Select a folder",
  startPath: process.cwd(),
});

if (result.type === "selected") {
  console.log("Selected folder:", result.path);
}
```

---

## Theming

Customize colors and styles.

### Using Built-in Theme

```typescript
import { getCurrentTheme, getColors, style } from "quarktui";

// Get current theme colors
const colors = getColors();
console.log(colors.accent, colors.success, colors.error);

// Style text
const styled = style("Hello", "bold", "accent");
```

### Creating Custom Theme

```typescript
import { setTheme, createTheme } from "quarktui";

const myTheme = createTheme({
  colors: {
    text: "\x1b[37m",
    textMuted: "\x1b[90m",
    accent: "\x1b[36m",
    highlight: "\x1b[33m",
    success: "\x1b[32m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    info: "\x1b[34m",
    border: "\x1b[90m",
    cursor: "\x1b[36m",
  },
});

setTheme(myTheme);
```

### Style Types

Available style types for the `style()` function:

- `"bold"`, `"dim"`, `"italic"`, `"underline"`
- `"text"`, `"muted"`, `"accent"`, `"highlight"`
- `"success"`, `"warning"`, `"error"`, `"info"`

### ANSI Codes

```typescript
import { RESET, BOLD, DIM, ITALIC, UNDERLINE, fg, bg, fgRgb, bgRgb, ANSI, ANSI_BG } from "quarktui";

// Named colors
const red = `${ANSI.red}Red text${RESET}`;
const blueBg = `${ANSI_BG.blue}Blue background${RESET}`;

// 256-color mode
const orange = `${fg(208)}Orange text${RESET}`;

// True color (RGB)
const custom = `${fgRgb(255, 128, 0)}Custom color${RESET}`;
```

---

## Keyboard Handling

Low-level keyboard input handling.

### Keyboard Handler

```typescript
import { createKeyboardHandler, type KeypressEvent } from "quarktui";

const keyboard = createKeyboardHandler();

keyboard.onKeypress((key: KeypressEvent) => {
  console.log("Key pressed:", key.name, key.str);
  
  if (key.ctrl && key.name === "c") {
    keyboard.cleanup();
    process.exit();
  }
});

// Later: cleanup
keyboard.cleanup();
```

### Wait for Keypress

```typescript
import { waitForKeypress, waitForKeypressCancellable } from "quarktui";

// Wait for any key
const key = await waitForKeypress();

// Cancellable version
const { promise, cancel } = waitForKeypressCancellable();
// Later: cancel() to stop waiting
const key = await promise;
```

### Key Detection Utilities

```typescript
import {
  isUpKey,
  isDownKey,
  isLeftKey,
  isRightKey,
  isConfirmKey,
  isBackKey,
  isHelpKey,
  isPrintable,
  getNumberKey,
} from "quarktui";

keyboard.onKeypress((key) => {
  if (isUpKey(key)) console.log("Up pressed");
  if (isDownKey(key)) console.log("Down pressed");
  if (isConfirmKey(key)) console.log("Enter pressed");
  if (isBackKey(key)) console.log("Back/Escape pressed");
  if (isHelpKey(key)) console.log("Help (?) pressed");
  
  const num = getNumberKey(key);
  if (num !== null) console.log("Number pressed:", num);
  
  if (isPrintable(key)) console.log("Printable:", key.str);
});
```

### KeypressEvent Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Key name (e.g., "return", "escape", "up") |
| `str` | `string?` | Character string (for printable keys) |
| `ctrl` | `boolean` | Control key held |
| `shift` | `boolean` | Shift key held |
| `meta` | `boolean` | Meta/Alt key held |

---

## Drawing Primitives

Low-level drawing utilities for custom rendering.

### Terminal Control

```typescript
import {
  clearScreen,
  clearToEnd,
  clearLine,
  hideCursor,
  showCursor,
  moveCursor,
  getTerminalSize,
  write,
  writeLine,
} from "quarktui";

clearScreen();
hideCursor();

const { width, height } = getTerminalSize();
moveCursor(10, 5);
write("Hello at position (10, 5)");

showCursor();
```

### Render Buffering

For flicker-free rendering, QuarkTUI provides a render buffer system that batches all terminal writes into a single operation:

```typescript
import {
  beginRender,
  flushRender,
  cancelRender,
  isRenderBuffering,
  clearScreen,
  drawTopBorder,
  drawLine,
  drawBottomBorder,
} from "quarktui";

// Start buffered rendering
beginRender();

// All draw operations are collected in memory
clearScreen();
drawTopBorder(60);
drawLine("Hello World", 60);
drawBottomBorder(60);

// Flush everything to terminal in one write (reduces flicker)
flushRender();

// Check if buffering is active
if (isRenderBuffering()) {
  // Currently in buffered mode
}

// Cancel without flushing (discards buffer)
cancelRender();
```

**Note:** All built-in dialogs (`selectMenu`, `confirm`, `textInput`, etc.) automatically use buffered rendering for smooth updates.

### Box Drawing

```typescript
import {
  drawTopBorder,
  drawBottomBorder,
  drawDivider,
  drawEmptyLine,
  drawLine,
  drawCenteredLine,
  drawRightAlignedLine,
  drawVerticalPadding,
  BOX,
  BOX_SHARP,
  BOX_DOUBLE,
} from "quarktui";

const innerWidth = 60;

drawTopBorder(innerWidth);           // ╭──────...──────╮
drawEmptyLine(innerWidth);           // │               │
drawCenteredLine("Title", innerWidth); // │    Title    │
drawDivider(innerWidth);             // ├──────...──────┤
drawLine("Content", innerWidth);     // │Content        │
drawBottomBorder(innerWidth);        // ╰──────...──────╯

// Use different box styles
drawTopBorder(innerWidth, BOX_SHARP);  // ┌──────...──────┐
drawTopBorder(innerWidth, BOX_DOUBLE); // ╔══════...══════╗
```

### Box Characters

```typescript
import { BOX } from "quarktui";

// Rounded corners (default)
BOX.topLeft     // ╭
BOX.topRight    // ╮
BOX.bottomLeft  // ╰
BOX.bottomRight // ╯
BOX.horizontal  // ─
BOX.vertical    // │
BOX.teeLeft     // ├
BOX.teeRight    // ┤
```

---

## Layout Configuration

Configure global layout settings.

### Padding Configuration

```typescript
import {
  setLayout,
  getLayout,
  getPadding,
  DEFAULT_PADDING_X,
  DEFAULT_PADDING_Y,
  DEFAULT_INTERNAL_PADDING,
} from "quarktui";

// Get current layout
const layout = getLayout();
console.log(layout.paddingX, layout.paddingY);

// Set custom padding
setLayout({
  paddingX: 6,  // Horizontal padding from terminal edges
  paddingY: 3,  // Vertical padding from terminal edges
});

// Get padding values
const { x, y } = getPadding();
```

### Frame Dimensions

Frame dimensions are **memoized** for performance - the values are cached and automatically invalidated when:
- The terminal is resized
- `setLayout()` is called

```typescript
import { getFrameDimensions, calculateFrameWidth, invalidateFrameDimensionsCache } from "quarktui";

// Get dimensions adjusted for padding (cached for performance)
const { width, height, innerWidth, innerHeight } = getFrameDimensions();

// Calculate centered frame width
const frameWidth = calculateFrameWidth(60, 0.8); // max 60, 80% of terminal

// Manually invalidate cache if needed (rarely necessary)
invalidateFrameDimensionsCache();
```

### Default Values

| Constant | Default | Description |
|----------|---------|-------------|
| `DEFAULT_PADDING_X` | 4 | Horizontal padding from terminal edges |
| `DEFAULT_PADDING_Y` | 2 | Vertical padding from terminal edges |
| `DEFAULT_INTERNAL_PADDING` | 2 | Space between border and content |
| `DEFAULT_MAX_FRAME_WIDTH` | 60 | Maximum frame width |
| `DEFAULT_FRAME_WIDTH_PERCENT` | 0.8 | Frame width as percentage of terminal |

---

## API Reference

### Exports Summary

```typescript
// Component System
export { Component, type ComponentConfig } from "./component";

// Widgets
export { Text, Spacer, Row, Table, ProgressBar, Progress, List, BulletList, NumberedList, CheckboxList, Divider, HR, Columns, KeyValue, Box, Panel, InfoBox, WarningBox, ErrorBox, SuccessBox } from "./widgets";
export type { Widget, RenderContext, TableCell, TableColumn, ProgressBarOptions, ProgressBarStyle, ListItem, ListOptions, ListStyle, DividerOptions, DividerStyle, ColumnDef, ColumnWidth, ColumnsOptions, BoxOptions, BoxStyle, TitlePosition } from "./widgets";

// Dialogs
export { selectMenu, textInput, passwordInput, confirm, confirmYesNo } from "./dialogs";
export { multiSelect, quickMultiSelect } from "./dialogs";
export { showMessage, showMessageAndWait, message, info, success, warning, error } from "./dialogs";
export { showSpinner, withSpinner, SPINNER_DOTS, SPINNER_CIRCLE, /* ... */ } from "./dialogs";
export { showHelp } from "./dialogs";
export type { MenuOption, SelectMenuOptions, SelectResult } from "./dialogs";
export type { MultiSelectOption, MultiSelectOptions, MultiSelectResult } from "./dialogs";
export type { TextInputOptions, TextInputResult } from "./dialogs";
export type { ConfirmOptions, ConfirmResult } from "./dialogs";
export type { MessageType, MessageOptions } from "./dialogs";
export type { SpinnerOptions, SpinnerController } from "./dialogs";
export type { HelpContent, HelpSection } from "./dialogs";

// Pickers
export { pickFile, pickFolder } from "./pickers";
export type { FilePickerOptions, FolderPickerOptions, PickerResult } from "./pickers";

// Theming
export { getCurrentTheme, setTheme, createTheme, getColors, resetTheme } from "./core";
export { style, RESET, BOLD, DIM, ITALIC, UNDERLINE, fg, bg, fgRgb, bgRgb } from "./core";
export type { Theme, ThemeColors, StyleType } from "./core";

// Keyboard
export { createKeyboardHandler, waitForKeypress, waitForKeypressCancellable } from "./core";
export { isUpKey, isDownKey, isLeftKey, isRightKey, isConfirmKey, isBackKey, isHelpKey } from "./core";
export { isPrintable, getNumberKey } from "./core";
export type { KeypressEvent, KeyboardHandler } from "./core";

// Terminal
export { clearScreen, clearToEnd, clearLine, hideCursor, showCursor } from "./core";
export { moveCursor, getTerminalSize, write, writeLine } from "./core";
export { beginRender, flushRender, cancelRender, isRenderBuffering } from "./core";
export type { TerminalSize } from "./core";

// Drawing
export { drawTopBorder, drawBottomBorder, drawDivider, drawEmptyLine } from "./core";
export { drawLine, drawCenteredLine, drawRightAlignedLine, drawVerticalPadding } from "./core";
export { BOX, BOX_SHARP, BOX_DOUBLE } from "./core";
export { setLayout, getLayout, getPadding, getFrameDimensions, invalidateFrameDimensionsCache } from "./core";

// Window (advanced)
export { createWindow } from "./window";
export type { WindowConfig, WindowActions, WindowInstance } from "./window";

// Renderer (advanced)
export { render, renderFitted } from "./renderer";
```

---

## Examples

### Complete Application Example

```typescript
import {
  Component,
  Text,
  Spacer,
  Row,
  selectMenu,
  confirm,
  showSpinner,
  type RenderContext,
  type Widget,
  type KeypressEvent,
} from "quarktui";

// Service layer
class AppService {
  private count = 0;

  getCount(): number {
    return this.count;
  }

  increment(): void {
    this.count++;
  }

  async saveData(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Main component
class CounterComponent extends Component<AppService> {
  readonly config = {
    title: "♯ COUNTER APP",
    description: "A simple counter example",
    hints: ["Space Increment", "s Save", "m Menu", "q/⌫ Back"],
  };

  render(ctx: RenderContext): Widget[] {
    const count = this.service.getCount();
    
    return [
      Spacer(),
      Text(`Count: ${count}`, { style: "bold", align: "center" }),
      Spacer(),
      Row(["Press Space to increment"], { align: "center" }),
    ];
  }

  async onKeypress(key: KeypressEvent): Promise<boolean> {
    if (key.name === "space") {
      this.service.increment();
      this.redraw();
      return true;
    }

    if (key.str === "s") {
      this.pauseKeyboard();
      const spinner = showSpinner("Saving...");
      await this.service.saveData();
      spinner.stop("Saved!");
      await new Promise((r) => setTimeout(r, 500));
      this.resumeKeyboard();
      return true;
    }

    if (key.str === "m") {
      this.pauseKeyboard();
      const result = await selectMenu({
        title: "Menu",
        options: [
          { label: "Reset counter", value: "reset" },
          { label: "Back", value: "back" },
        ],
      });
      if (result.type === "selected" && result.value === "reset") {
        // Reset logic here
      }
      this.resumeKeyboard();
      return true;
    }

    return false;
  }
}

// Run the app
async function main() {
  const service = new AppService();
  const component = new CounterComponent(service);
  await component.run();
}

main();
```

---

## License

MIT