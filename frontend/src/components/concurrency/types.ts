// defined columns as subset of DataGrid's ColumnOrColumnGroup<undefined, unknown>[]
export type Column = { name: string; key: string; width?: number; minWidth?: number };

export type RowCol = { [key: string]: string };
