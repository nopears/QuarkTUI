# QuarkTUI

A lightweight TUI (Terminal User Interface) component framework for building interactive terminal applications with TypeScript.

## Features

- **Component System** - Build reusable UI components with lifecycle hooks
- **Widget Primitives** - Text, Row, Spacer, Table widgets for layout
- **Dialogs** - Select menus, text input, confirmations, messages, spinners
- **Pickers** - File and folder selection dialogs
- **Theming** - Customizable color themes
- **Keyboard Handling** - Raw mode keyboard input with key detection utilities
- **Drawing Primitives** - Box drawing, borders, and layout helpers

## Quick Start

```typescript
import {
  // Components
  Component,
  
  // Widgets
  Text, Spacer, Row, Table,
  
  // Dialogs
  selectMenu, textInput, confirm, showMessage, showSpinner,
  
  // Pickers
  pickFile, pickFolder,
  
  // Core utilities
  style, clearScreen, hideCursor, showCursor,
  
  // Keyboard
  createKeyboardHandler, waitForKeypress,
  
  // Types
  type KeypressEvent, type StyleType, type HelpContent,
} from "./quarktui";
