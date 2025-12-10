# QuarkTUI Dialogs Module

Pre-built dialog components for common user interactions.

## Import

```typescript
import {
  // Select menu
  selectMenu,
  // Multi-select
  multiSelect,
  quickMultiSelect,
  // Text input
  textInput,
  passwordInput,
  // Confirmation
  confirm,
  confirmYesNo,
  // Messages
  showMessage,
  showMessageAndWait,
  info,
  success,
  warning,
  error,
  // Spinner
  showSpinner,
  withSpinner,
  SPINNER_DOTS,
  SPINNER_CIRCLE,
  // Help
  showHelp,
  // Toast notifications
  showToast,
  toastInfo,
  toastSuccess,
  toastWarning,
  toastError,
  dismissAllToasts,
} from "quarktui/dialogs";
```

## Features

### Selection Dialogs
- **selectMenu** - Single selection from a list
- **multiSelect** - Multiple selections with checkboxes
- **quickMultiSelect** - Convenience wrapper for string arrays

### Input Dialogs
- **textInput** - Text input with validation
- **passwordInput** - Masked password input

### Confirmation
- **confirm** - Yes/No confirmation with custom labels
- **confirmYesNo** - Simple yes/no dialog

### Messages
- **showMessage** - Display message without waiting
- **showMessageAndWait** - Display and wait for keypress
- **info, success, warning, error** - Semantic message helpers

### Loading Indicators
- **showSpinner** - Manual spinner control
- **withSpinner** - Automatic spinner for async operations
- Multiple spinner frame presets

### Help System
- **showHelp** - Display scrollable help content

### Notifications
- **showToast** - Temporary notifications in top right
- **toastInfo, toastSuccess, toastWarning, toastError** - Semantic helpers
- **dismissAllToasts** - Clear all active toasts

## Common Tasks

### Show a menu
```typescript
import { selectMenu } from "quarktui/dialogs";

const result = await selectMenu({
  title: "Choose an option",
  options: [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ],
});

if (result.type === "selected") {
  console.log("Selected:", result.value);
}
```

### Get text input
```typescript
import { textInput } from "quarktui/dialogs";

const result = await textInput({
  title: "Enter your name",
  validate: (value) => {
    if (value.length < 2) return "Too short";
    return null;
  },
});

if (result.type === "submitted") {
  console.log("Name:", result.value);
}
```

### Show a spinner
```typescript
import { withSpinner } from "quarktui/dialogs";

const data = await withSpinner(
  "Loading data...",
  () => fetchData(),
  "Done!"
);
```

### Show a toast
```typescript
import { toastSuccess, toastError } from "quarktui/dialogs";

toastSuccess("File saved!");
toastError("Something went wrong");
```

### Confirm action
```typescript
import { confirm } from "quarktui/dialogs";

const result = await confirm({
  title: "Delete file?",
  message: "This cannot be undone.",
});

if (result.type === "confirmed") {
  // Delete the file
}
```

## API Reference

See the main [README.md](../../README.md) for complete API documentation.
