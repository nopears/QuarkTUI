# QuarkTUI Widgets Module

UI component primitives for building terminal interfaces.

## Import

```typescript
import {
  Text,
  Spacer,
  Row,
  Table,
  ProgressBar,
  Progress,
  List,
  BulletList,
  NumberedList,
  CheckboxList,
  Divider,
  HR,
  Columns,
  KeyValue,
  Box,
  Panel,
  InfoBox,
  WarningBox,
  ErrorBox,
  SuccessBox,
  type Widget,
  type RenderContext,
} from "quarktui/widgets";
```

## Features

### Text & Layout
- **Text** - Styled text with alignment
- **Spacer** - Vertical spacing
- **Row** - Horizontal layout with separators
- **Columns** - Multi-column layouts with flexible widths

### Data Display
- **Table** - Tabular data with columns and rows
- **List** - Various list styles (bullet, numbered, checkbox, etc.)
- **ProgressBar** - Progress indicators with multiple styles
- **Divider** - Horizontal separators with labels

### Containers
- **Box** - Bordered container with title and footer
- **Panel** - Simplified box with title
- **InfoBox, WarningBox, ErrorBox, SuccessBox** - Semantic boxes

## Common Tasks

### Display styled text
```typescript
import { Text } from "quarktui/widgets";

Text("Hello World", { style: "bold", align: "center" })
```

### Create a table
```typescript
import { Table } from "quarktui/widgets";

const columns = [
  { header: "Name", width: 20 },
  { header: "Value", width: 10, align: "right" },
];

const rows = [
  [{ text: "Item 1" }, { text: "100" }],
  [{ text: "Item 2" }, { text: "200" }],
];

Table({ columns, rows })
```

### Show progress
```typescript
import { ProgressBar } from "quarktui/widgets";

ProgressBar({
  value: 0.5,
  style: "block",
  label: "Loading",
  labelPosition: "left",
  valuePosition: "right",
})
```

### Create a list
```typescript
import { BulletList } from "quarktui/widgets";

BulletList(["Item 1", "Item 2", "Item 3"])
```

### Build a layout
```typescript
import { Columns, Text, Spacer } from "quarktui/widgets";

Columns({
  columns: [
    { content: "Sidebar", width: 20 },
    { content: "Main content", width: "flex" },
  ],
})
```

## API Reference

See the main [README.md](../../README.md) for complete API documentation.
