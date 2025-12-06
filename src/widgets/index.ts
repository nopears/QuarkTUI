/**
 * QuarkTUI - Widget Exports
 *
 * Re-exports all widget primitives and types.
 */

// Types
export type {
  Widget,
  RenderContext,
  WidgetType,
  Alignment,
  TextOptions,
  RowOptions,
  SpacerOptions,
} from "./types";

export type { TableCell, TableColumn, TableOptions } from "./table";
export type { ProgressBarOptions, ProgressBarStyle } from "./progress";

// Widgets
export { Text } from "./text";
export { Spacer } from "./spacer";
export { Row } from "./row";
export { Table } from "./table";
export { ProgressBar, Progress } from "./progress";
