# QuarkTUI Core Module

Low-level terminal operations, theming, keyboard handling, and drawing primitives.

## Import

```typescript
import {
  // Terminal control
  clearScreen,
  hideCursor,
  showCursor,
  moveCursor,
  getTerminalSize,
  // Theming
  getCurrentTheme,
  setTheme,
  getColors,
  style,
  // Keyboard
  createKeyboardHandler,
  waitForKeypress,
  isUpKey,
  isDownKey,
  // Drawing
  drawTopBorder,
  drawBottomBorder,
  BOX,
} from "quarktui/core";
```

## Features

### Terminal Control
- Screen clearing and cursor management
- Terminal size detection
- Render buffering for flicker-free updates
- Alternate screen support

### Theming System
- Built-in color themes
- Custom theme creation
- ANSI color support (16, 256, RGB)
- Style application (bold, dim, italic, etc.)

### Keyboard Input
- Raw mode keyboard handling
- Key detection utilities
- Single keypress waiting
- Cancellable input

### Drawing Primitives
- Box drawing characters
- Border rendering
- Text alignment helpers
- Layout configuration

## Common Tasks

### Clear screen and hide cursor
```typescript
import { clearScreen, hideCursor, showCursor } from "quarktui/core";

clearScreen();
hideCursor();
// ... do work ...
showCursor();
```

### Apply styling
```typescript
import { style } from "quarktui/core";

const text = style("Hello", "bold", "success");
const dimmed = style("Muted", "dim");
```

### Get terminal size
```typescript
import { getTerminalSize } from "quarktui/core";

const { width, height } = getTerminalSize();
```

### Handle keyboard input
```typescript
import { createKeyboardHandler, isUpKey, isDownKey } from "quarktui/core";

const keyboard = createKeyboardHandler();
keyboard.onKeypress((key) => {
  if (isUpKey(key)) console.log("Up pressed");
  if (isDownKey(key)) console.log("Down pressed");
});
```

## API Reference

See the main [README.md](../../README.md) for complete API documentation.
