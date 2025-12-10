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
export type { ListItem, ListOptions, ListStyle } from "./list";
export type { DividerOptions, DividerStyle } from "./divider";
export type { ColumnDef, ColumnWidth, ColumnsOptions } from "./columns";
export type { BoxOptions, BoxStyle, TitlePosition } from "./box";

// Widgets
export { Text } from "./text";
export { Spacer } from "./spacer";
export { Row } from "./row";
export { Table } from "./table";
export { ProgressBar, Progress } from "./progress";
export { List, BulletList, NumberedList, CheckboxList } from "./list";
export { Divider, HR } from "./divider";
export { Columns, KeyValue } from "./columns";
export { Box, Panel, InfoBox, WarningBox, ErrorBox, SuccessBox } from "./box";
