import 'react-table';

declare module 'react-table' {
  export interface ColumnInstance<D extends object = {}> extends UseSortByColumnProps<D> {}
  export interface HeaderGroup<D extends object = {}> extends UseSortByColumnProps<D> {}
}
